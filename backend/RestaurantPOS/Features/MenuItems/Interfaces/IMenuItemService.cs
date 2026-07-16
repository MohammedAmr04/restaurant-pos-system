using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantPOS.Features.MenuItems
{
    public interface IMenuItemService
    {
        Task<IEnumerable<MenuItemDto>> GetAllAsync();
        Task<MenuItemDto> GetByIdAsync(int id);
        Task<MenuItemDto> CreateAsync(CreateMenuItemDto dto);
        Task<MenuItemDto> UpdateAsync(int id, UpdateMenuItemDto dto);
        Task<bool> DeleteAsync(int id);
        Task<MenuItemDto> ToggleAvailabilityAsync(int id, bool isAvailable);
    }
}
