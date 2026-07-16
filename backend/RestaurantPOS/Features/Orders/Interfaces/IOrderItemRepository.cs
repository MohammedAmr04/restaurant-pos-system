using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantPOS.Features.Orders
{
    public interface IOrderItemRepository
    {
        Task<IEnumerable<OrderItem>> GetByOrderIdAsync(int orderId);
        Task<OrderItem> GetByIdAsync(int id);
        Task<int> CreateAsync(OrderItem item);
        Task<bool> UpdateAsync(OrderItem item);
        Task<bool> DeleteAsync(int id);
    }
}
