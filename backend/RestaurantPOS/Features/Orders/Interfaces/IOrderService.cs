using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantPOS.Features.Orders
{
    public interface IOrderService
    {
        Task<IEnumerable<OrderDto>> GetAllAsync();
        Task<OrderDto> GetByIdAsync(int id);
        Task<OrderDto> CreateOrderAsync(CreateOrderDto dto);
        Task<OrderDto> AddItemAsync(int orderId, OrderItemDto dto);
        Task<OrderDto> UpdateItemAsync(int orderId, int itemId, UpdateOrderItemDto dto);
        Task<OrderDto> RemoveItemAsync(int orderId, int itemId);
        Task<OrderDto> ApplyDiscountAsync(int orderId, ApplyDiscountDto dto);
        Task<OrderDto> RemoveDiscountAsync(int orderId);
        Task<OrderDto> ApplyServiceChargeAsync(int orderId, ApplyServiceChargeDto dto);
        Task<OrderDto> RemoveServiceChargeAsync(int orderId);
        Task<OrderDto> CompleteOrderAsync(int orderId, CompleteOrderDto dto);
        Task<IEnumerable<OrderDto>> GetHoldOrdersAsync();
        Task<IEnumerable<OrderDto>> SearchInvoicesAsync(string search, string orderType, string paymentMethod, DateTime? dateFrom, DateTime? dateTo);
        Task<OrderDto> ResumeOrderAsync(int orderId);
        Task<bool> DeleteOrderAsync(int orderId);
    }
}
