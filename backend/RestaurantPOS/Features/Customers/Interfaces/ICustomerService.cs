using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantPOS.Features.Customers
{
    public interface ICustomerService
    {
        Task<IEnumerable<CustomerDto>> GetAllAsync();
        Task<IEnumerable<CustomerDto>> SearchAsync(string query);
        Task<CustomerDto> GetByIdAsync(int id);
        Task<CustomerDto> GetByPhoneAsync(string phone);
        Task<CustomerDto> CreateAsync(CreateCustomerDto dto);
        Task<CustomerDto> UpdateAsync(int id, UpdateCustomerDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
