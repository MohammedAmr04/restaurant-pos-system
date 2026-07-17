using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RestaurantPOS.Features.MenuItems;

namespace RestaurantPOS.Features.Orders
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IOrderItemRepository _orderItemRepository;
        private readonly IMenuItemRepository _menuItemRepository;
        private readonly Features.Tables.ITableRepository _tableRepository;
        private readonly Features.Customers.ICustomerRepository _customerRepository;
        private readonly Features.DeliveryRiders.IDeliveryRiderRepository _deliveryRiderRepository;
        private readonly Features.Authentication.IUserRepository _userRepository;
        private readonly Features.Settings.ISettingsRepository _settingsRepository;
        private readonly Features.Settings.ISettingsService _settingsService;
        private readonly Features.Printing.IPrinterService _printerService;

        public OrderService(
            IOrderRepository orderRepository,
            IOrderItemRepository orderItemRepository,
            IMenuItemRepository menuItemRepository,
            Features.Tables.ITableRepository tableRepository,
            Features.Customers.ICustomerRepository customerRepository,
            Features.DeliveryRiders.IDeliveryRiderRepository deliveryRiderRepository,
            Features.Authentication.IUserRepository userRepository,
            Features.Settings.ISettingsRepository settingsRepository,
            Features.Settings.ISettingsService settingsService,
            Features.Printing.IPrinterService printerService)
        {
            _orderRepository = orderRepository;
            _orderItemRepository = orderItemRepository;
            _menuItemRepository = menuItemRepository;
            _tableRepository = tableRepository;
            _customerRepository = customerRepository;
            _deliveryRiderRepository = deliveryRiderRepository;
            _userRepository = userRepository;
            _settingsRepository = settingsRepository;
            _settingsService = settingsService;
            _printerService = printerService;
        }

        public async Task<IEnumerable<OrderDto>> GetAllAsync()
        {
            var orders = await _orderRepository.GetAllAsync();
            var result = new List<OrderDto>();

            foreach (var order in orders)
            {
                result.Add(await MapToDto(order));
            }

            return result;
        }

        public async Task<OrderDto> GetByIdAsync(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            if (order == null) return null;
            return await MapToDto(order);
        }

        public async Task<OrderDto> CreateOrderAsync(CreateOrderDto dto)
        {
            var invoiceNumber = await _orderRepository.GetNextInvoiceNumberAsync();
            var settings = await _settingsRepository.GetAsync();

            var order = new Order
            {
                InvoiceNumber = invoiceNumber,
                OrderType = dto.OrderType,
                Status = "Hold",
                UserId = Shared.AuthHelper.GetCurrentUserId(),
                CustomerId = dto.CustomerId,
                TableId = dto.TableId,
                DeliveryRiderId = dto.DeliveryRiderId,
                Subtotal = 0,
                DiscountType = null,
                DiscountValue = 0,
                ServiceCharge = 0,
                Tax = 0,
                GrandTotal = 0,
                PaymentMethod = null,
                PaidAmount = 0,
                BusinessDate = DateTime.Now.Date,
                CompletedAt = null,
                CreatedAt = DateTime.Now
            };

            var orderId = await _orderRepository.CreateAsync(order);
            order.Id = orderId;

            if (dto.Items != null && dto.Items.Any())
            {
                foreach (var item in dto.Items)
                {
                    await AddItemToOrder(orderId, item);
                }
                await RecalculateOrderTotals(orderId);
            }

            if (dto.OrderType == "DineIn" && dto.TableId.HasValue)
            {
                var table = await _tableRepository.GetByIdAsync(dto.TableId.Value);
                if (table == null)
                    throw new Exception("Table not found");
                if (table.IsOccupied)
                    throw new Exception("Table is already occupied");

                table.IsOccupied = true;
                table.UpdatedAt = DateTime.Now;
                await _tableRepository.UpdateAsync(table);
            }

            var updatedOrder = await _orderRepository.GetByIdAsync(orderId);
            return await MapToDto(updatedOrder);
        }

        public async Task<OrderDto> AddItemAsync(int orderId, OrderItemDto dto)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null) throw new Exception("Order not found");
            if (order.Status != "Hold") throw new Exception("Can only add items to hold orders");

            await AddItemToOrder(orderId, dto);

            await RecalculateOrderTotals(orderId);
            var updatedOrder = await _orderRepository.GetByIdAsync(orderId);
            return await MapToDto(updatedOrder);
        }

        private async Task AddItemToOrder(int orderId, OrderItemDto dto)
        {
            var menuItem = await _menuItemRepository.GetByIdAsync(dto.MenuItemId.Value);
            if (menuItem == null) throw new Exception("Menu item not found");
            if (!menuItem.IsAvailable) throw new Exception("Menu item is not available");

            var orderItem = new OrderItem
            {
                OrderId = orderId,
                MenuItemId = dto.MenuItemId.Value,
                Quantity = dto.Quantity,
                UnitPrice = menuItem.Price,
                Notes = dto.Notes,
                Total = menuItem.Price * dto.Quantity
            };

            await _orderItemRepository.CreateAsync(orderItem);
        }

        public async Task<OrderDto> UpdateItemAsync(int orderId, int itemId, UpdateOrderItemDto dto)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null) throw new Exception("Order not found");
            if (order.Status != "Hold") throw new Exception("Can only update items in hold orders");

            var orderItem = await _orderItemRepository.GetByIdAsync(itemId);
            if (orderItem == null || orderItem.OrderId != orderId) throw new Exception("Order item not found");

            orderItem.Quantity = dto.Quantity;
            orderItem.Notes = dto.Notes;
            orderItem.Total = orderItem.UnitPrice * dto.Quantity;

            await _orderItemRepository.UpdateAsync(orderItem);

            await RecalculateOrderTotals(orderId);
            var updatedOrder = await _orderRepository.GetByIdAsync(orderId);
            return await MapToDto(updatedOrder);
        }

        public async Task<OrderDto> RemoveItemAsync(int orderId, int itemId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null) throw new Exception("Order not found");
            if (order.Status != "Hold") throw new Exception("Can only remove items from hold orders");

            var orderItem = await _orderItemRepository.GetByIdAsync(itemId);
            if (orderItem == null || orderItem.OrderId != orderId) throw new Exception("Order item not found");

            await _orderItemRepository.DeleteAsync(itemId);

            await RecalculateOrderTotals(orderId);
            var updatedOrder = await _orderRepository.GetByIdAsync(orderId);
            return await MapToDto(updatedOrder);
        }

        public async Task<OrderDto> ApplyDiscountAsync(int orderId, ApplyDiscountDto dto)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null) throw new Exception("Order not found");
            if (order.Status != "Hold") throw new Exception("Can only apply discount to hold orders");

            order.DiscountType = dto.DiscountType;
            order.DiscountValue = dto.DiscountValue;
            order.UpdatedAt = DateTime.Now;

            await _orderRepository.UpdateAsync(order);

            await RecalculateOrderTotals(orderId);
            var updatedOrder = await _orderRepository.GetByIdAsync(orderId);
            return await MapToDto(updatedOrder);
        }

        public async Task<OrderDto> RemoveDiscountAsync(int orderId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null) throw new Exception("Order not found");
            if (order.Status != "Hold") throw new Exception("Can only modify hold orders");

            order.DiscountType = null;
            order.DiscountValue = 0;
            order.UpdatedAt = DateTime.Now;

            await _orderRepository.UpdateAsync(order);

            await RecalculateOrderTotals(orderId);
            var updatedOrder = await _orderRepository.GetByIdAsync(orderId);
            return await MapToDto(updatedOrder);
        }

        public async Task<OrderDto> ApplyServiceChargeAsync(int orderId, ApplyServiceChargeDto dto)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null) throw new Exception("Order not found");
            if (order.Status != "Hold") throw new Exception("Can only apply service charge to hold orders");

            order.ServiceCharge = dto.ServiceCharge;
            order.UpdatedAt = DateTime.Now;

            await _orderRepository.UpdateAsync(order);

            await RecalculateOrderTotals(orderId);
            var updatedOrder = await _orderRepository.GetByIdAsync(orderId);
            return await MapToDto(updatedOrder);
        }

        public async Task<OrderDto> RemoveServiceChargeAsync(int orderId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null) throw new Exception("Order not found");
            if (order.Status != "Hold") throw new Exception("Can only modify hold orders");

            order.ServiceCharge = 0;
            order.UpdatedAt = DateTime.Now;

            await _orderRepository.UpdateAsync(order);

            await RecalculateOrderTotals(orderId);
            var updatedOrder = await _orderRepository.GetByIdAsync(orderId);
            return await MapToDto(updatedOrder);
        }

        public async Task<OrderDto> CompleteOrderAsync(int orderId, CompleteOrderDto dto)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null) throw new Exception("Order not found");
            if (order.Status != "Hold") throw new Exception("Order is not in hold status");

            var items = await _orderItemRepository.GetByOrderIdAsync(orderId);
            if (!items.Any()) throw new Exception("Order has no items");

            if (order.OrderType == "Delivery" && !order.DeliveryRiderId.HasValue)
                throw new Exception("Delivery orders require a rider");

            if ((order.OrderType == "TakeAway" || order.OrderType == "Delivery") && !order.CustomerId.HasValue)
                throw new Exception("Take away and delivery orders require a customer");

            order.Status = "Completed";
            order.PaymentMethod = dto.PaymentMethod;
            order.PaidAmount = dto.PaidAmount;
            order.CompletedAt = DateTime.Now;
            order.UpdatedAt = DateTime.Now;

            await _orderRepository.UpdateAsync(order);

            if (order.OrderType == "DineIn" && order.TableId.HasValue)
            {
                var table = await _tableRepository.GetByIdAsync(order.TableId.Value);
                if (table != null)
                {
                    table.IsOccupied = false;
                    table.UpdatedAt = DateTime.Now;
                    await _tableRepository.UpdateAsync(table);
                }
            }

            // Print receipts
            try
            {
                    var completedOrder = await MapToDto(order);
                    var settingsDto = await _settingsService.GetAsync();
                    if (settingsDto != null)
                    {
                        _printerService.PrintOrderReceipts(completedOrder, settingsDto);
                    }
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, "Failed to print receipts for order {OrderId}", orderId);
            }

            var freshOrder = await _orderRepository.GetByIdAsync(orderId);
            return await MapToDto(freshOrder);
        }

        public async Task<IEnumerable<OrderDto>> GetHoldOrdersAsync()
        {
            var orders = await _orderRepository.GetByStatusAsync("Hold");
            var result = new List<OrderDto>();

            foreach (var order in orders)
            {
                result.Add(await MapToDto(order));
            }

            return result;
        }

        public async Task<IEnumerable<OrderDto>> SearchInvoicesAsync(string search, string orderType, string paymentMethod, DateTime? dateFrom, DateTime? dateTo)
        {
            var orders = await _orderRepository.SearchInvoicesAsync(search, orderType, paymentMethod, dateFrom, dateTo);
            var result = new List<OrderDto>();

            foreach (var order in orders)
            {
                result.Add(await MapToDto(order));
            }

            return result;
        }

        public async Task<OrderDto> ResumeOrderAsync(int orderId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null) throw new Exception("Order not found");
            if (order.Status != "Hold") throw new Exception("Order is not in hold status");

            return await MapToDto(order);
        }

        public async Task<bool> DeleteOrderAsync(int orderId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null) throw new Exception("Order not found");
            if (order.Status != "Hold") throw new Exception("Only hold orders can be deleted");

            if (order.TableId.HasValue)
            {
                var table = await _tableRepository.GetByIdAsync(order.TableId.Value);
                if (table != null)
                {
                    table.IsOccupied = false;
                    table.UpdatedAt = DateTime.Now;
                    await _tableRepository.UpdateAsync(table);
                }
            }

            var items = await _orderItemRepository.GetByOrderIdAsync(orderId);
            foreach (var item in items)
            {
                await _orderItemRepository.DeleteAsync(item.Id);
            }

            return await _orderRepository.DeleteAsync(orderId);
        }

        private async Task RecalculateOrderTotals(int orderId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null) return;

            var items = await _orderItemRepository.GetByOrderIdAsync(orderId);
            order.Subtotal = items.Sum(i => i.Total);

            decimal discount = 0;
            if (!string.IsNullOrEmpty(order.DiscountType))
            {
                if (order.DiscountType == "Amount")
                    discount = order.DiscountValue;
                else if (order.DiscountType == "Percentage")
                    discount = order.Subtotal * (order.DiscountValue / 100);
            }

            var settings = await _settingsRepository.GetAsync();
            decimal tax = 0;
            if (settings != null && settings.TaxEnabled)
            {
                tax = (order.Subtotal - discount + order.ServiceCharge) * (settings.TaxPercentage / 100);
            }

            order.Tax = tax;
            order.GrandTotal = order.Subtotal - discount + order.ServiceCharge + tax;
            order.UpdatedAt = DateTime.Now;

            await _orderRepository.UpdateAsync(order);
        }

        private async Task<OrderDto> MapToDto(Order order)
        {
            var items = await _orderItemRepository.GetByOrderIdAsync(order.Id);
            var itemDetails = new List<OrderItemDetailDto>();

            foreach (var item in items)
            {
                var menuItem = await _menuItemRepository.GetByIdAsync(item.MenuItemId);
                itemDetails.Add(new OrderItemDetailDto
                {
                    Id = item.Id,
                    MenuItemId = item.MenuItemId,
                    MenuItemName = menuItem?.Name ?? "Unknown",
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    Notes = item.Notes,
                    Total = item.Total
                });
            }

            string userName = null;
            if (order.UserId > 0)
            {
                var user = await _userRepository.GetByIdAsync(order.UserId);
                userName = user?.FullName ?? user?.Username;
            }

            string customerName = null;
            if (order.CustomerId.HasValue)
            {
                var customer = await _customerRepository.GetByIdAsync(order.CustomerId.Value);
                customerName = customer?.Name;
            }

            int? tableNumber = null;
            if (order.TableId.HasValue)
            {
                var table = await _tableRepository.GetByIdAsync(order.TableId.Value);
                tableNumber = table?.Number;
            }

            string deliveryRiderName = null;
            if (order.DeliveryRiderId.HasValue)
            {
                var rider = await _deliveryRiderRepository.GetByIdAsync(order.DeliveryRiderId.Value);
                deliveryRiderName = rider?.Name;
            }

            return new OrderDto
            {
                Id = order.Id,
                InvoiceNumber = order.InvoiceNumber,
                OrderType = order.OrderType,
                Status = order.Status,
                UserId = order.UserId,
                UserName = userName,
                CustomerId = order.CustomerId,
                CustomerName = customerName,
                TableId = order.TableId,
                TableNumber = tableNumber,
                DeliveryRiderId = order.DeliveryRiderId,
                DeliveryRiderName = deliveryRiderName,
                Subtotal = order.Subtotal,
                DiscountType = order.DiscountType,
                DiscountValue = order.DiscountValue,
                ServiceCharge = order.ServiceCharge,
                Tax = order.Tax,
                GrandTotal = order.GrandTotal,
                PaymentMethod = order.PaymentMethod,
                PaidAmount = order.PaidAmount,
                BusinessDate = order.BusinessDate,
                CompletedAt = order.CompletedAt,
                CreatedAt = order.CreatedAt,
                Items = itemDetails
            };
        }
    }
}
