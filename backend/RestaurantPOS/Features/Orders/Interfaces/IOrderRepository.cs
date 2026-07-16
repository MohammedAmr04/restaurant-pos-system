using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantPOS.Features.Orders
{
    public interface IOrderRepository
    {
        Task<IEnumerable<Order>> GetAllAsync();
        Task<Order> GetByIdAsync(int id);
        Task<IEnumerable<Order>> GetByStatusAsync(string status);
        Task<int> CreateAsync(Order order);
        Task<bool> UpdateAsync(Order order);
        Task<bool> DeleteAsync(int id);
        Task<string> GetNextInvoiceNumberAsync();
    }
}
