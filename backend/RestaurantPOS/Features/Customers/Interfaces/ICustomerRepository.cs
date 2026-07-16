using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantPOS.Features.Customers
{
    public interface ICustomerRepository
    {
        Task<IEnumerable<Customer>> GetAllAsync();
        Task<IEnumerable<Customer>> SearchAsync(string query);
        Task<Customer> GetByIdAsync(int id);
        Task<Customer> GetByPhoneAsync(string phone);
        Task<int> CreateAsync(Customer customer);
        Task<bool> UpdateAsync(Customer customer);
        Task<bool> DeleteAsync(int id);
    }
}
