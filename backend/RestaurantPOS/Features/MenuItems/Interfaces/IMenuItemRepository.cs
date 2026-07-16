using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantPOS.Features.MenuItems
{
    public interface IMenuItemRepository
    {
        Task<IEnumerable<MenuItem>> GetAllAsync();
        Task<MenuItem> GetByIdAsync(int id);
        Task<MenuItem> GetByNameAndCategoryAsync(string name, int categoryId);
        Task<int> CreateAsync(MenuItem menuItem);
        Task<bool> UpdateAsync(MenuItem menuItem);
        Task<bool> DeleteAsync(int id);
    }
}
