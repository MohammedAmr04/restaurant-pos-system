using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantPOS.Features.Tables
{
    public interface ITableRepository
    {
        Task<IEnumerable<RestaurantTable>> GetAllAsync();
        Task<RestaurantTable> GetByIdAsync(int id);
        Task<RestaurantTable> GetByNumberAsync(int number);
        Task<int> CreateAsync(RestaurantTable table);
        Task<bool> UpdateAsync(RestaurantTable table);
        Task<bool> DeleteAsync(int id);
        Task<bool> HasActiveOrderAsync(int tableId);
    }
}
