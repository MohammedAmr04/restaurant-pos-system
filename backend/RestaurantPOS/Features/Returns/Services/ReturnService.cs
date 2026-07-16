using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RestaurantPOS.Features.Orders;

namespace RestaurantPOS.Features.Returns
{
    public class ReturnService : IReturnService
    {
        private readonly IReturnRepository _returnRepository;
        private readonly IReturnItemRepository _returnItemRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly IOrderItemRepository _orderItemRepository;
        private readonly MenuItems.IMenuItemRepository _menuItemRepository;

        public ReturnService(
            IReturnRepository returnRepository,
            IReturnItemRepository returnItemRepository,
            IOrderRepository orderRepository,
            IOrderItemRepository orderItemRepository,
            MenuItems.IMenuItemRepository menuItemRepository)
        {
            _returnRepository = returnRepository;
            _returnItemRepository = returnItemRepository;
            _orderRepository = orderRepository;
            _orderItemRepository = orderItemRepository;
            _menuItemRepository = menuItemRepository;
        }

        public async Task<IEnumerable<ReturnDto>> GetAllAsync()
        {
            var returns = await _returnRepository.GetAllAsync();
            var result = new List<ReturnDto>();
            foreach (var returnEntity in returns)
            {
                result.Add(await MapToDto(returnEntity));
            }
            return result;
        }

        public async Task<ReturnDto> GetByIdAsync(int id)
        {
            var returnEntity = await _returnRepository.GetByIdAsync(id);
            if (returnEntity == null) return null;
            return await MapToDto(returnEntity);
        }

        public async Task<ReturnDto> CreateReturnAsync(CreateReturnDto dto)
        {
            var order = await _orderRepository.GetByIdAsync(dto.OrderId);
            if (order == null) throw new Exception("Order not found");
            if (order.Status != "Completed") throw new Exception("Returns can only be processed for completed orders");

            decimal totalRefund = 0;
            var returnItems = new List<ReturnItem>();

            foreach (var item in dto.Items)
            {
                var orderItem = await _orderItemRepository.GetByIdAsync(item.OrderItemId);
                if (orderItem == null || orderItem.OrderId != dto.OrderId)
                    throw new Exception("Invalid order item");
                if (item.Quantity > orderItem.Quantity)
                    throw new Exception("Return quantity cannot exceed ordered quantity");

                var refundAmount = orderItem.UnitPrice * item.Quantity;
                totalRefund += refundAmount;
                returnItems.Add(new ReturnItem
                {
                    OrderItemId = item.OrderItemId,
                    Quantity = item.Quantity,
                    RefundAmount = refundAmount
                });
            }

            var returnEntity = new Return
            {
                OrderId = dto.OrderId,
                UserId = Shared.AuthHelper.GetCurrentUserId(),
                TotalRefund = totalRefund,
                Reason = dto.Reason,
                CreatedAt = DateTime.Now
            };

            var returnId = await _returnRepository.CreateAsync(returnEntity);
            returnEntity.Id = returnId;

            foreach (var returnItem in returnItems)
            {
                returnItem.ReturnId = returnId;
                await _returnItemRepository.CreateAsync(returnItem);
            }

            order.Status = "Returned";
            order.UpdatedAt = DateTime.Now;
            await _orderRepository.UpdateAsync(order);

            return await MapToDto(returnEntity);
        }

        private async Task<ReturnDto> MapToDto(Return returnEntity)
        {
            var order = await _orderRepository.GetByIdAsync(returnEntity.OrderId);
            var items = await _returnItemRepository.GetByReturnIdAsync(returnEntity.Id);
            var itemDetails = new List<ReturnItemDetailDto>();

            foreach (var item in items)
            {
                var orderItem = await _orderItemRepository.GetByIdAsync(item.OrderItemId);
                var menuItem = orderItem != null ? await _menuItemRepository.GetByIdAsync(orderItem.MenuItemId) : null;
                itemDetails.Add(new ReturnItemDetailDto
                {
                    Id = item.Id,
                    OrderItemId = item.OrderItemId,
                    MenuItemName = menuItem?.Name ?? "Unknown",
                    Quantity = item.Quantity,
                    RefundAmount = item.RefundAmount
                });
            }

            return new ReturnDto
            {
                Id = returnEntity.Id,
                OrderId = returnEntity.OrderId,
                InvoiceNumber = order?.InvoiceNumber ?? "Unknown",
                UserId = returnEntity.UserId,
                TotalRefund = returnEntity.TotalRefund,
                Reason = returnEntity.Reason,
                CreatedAt = returnEntity.CreatedAt,
                Items = itemDetails
            };
        }
    }
}
