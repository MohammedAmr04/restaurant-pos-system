using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RestaurantPOS.Features.MenuItems
{
    public class MenuItemService : IMenuItemService
    {
        private readonly IMenuItemRepository _menuItemRepository;
        private readonly Features.Categories.ICategoryRepository _categoryRepository;

        public MenuItemService(IMenuItemRepository menuItemRepository, Features.Categories.ICategoryRepository categoryRepository)
        {
            _menuItemRepository = menuItemRepository;
            _categoryRepository = categoryRepository;
        }

        public async Task<IEnumerable<MenuItemDto>> GetAllAsync()
        {
            var menuItems = await _menuItemRepository.GetAllAsync();
            var categories = await _categoryRepository.GetAllAsync();

            return menuItems.Select(mi => MapToDto(mi, categories.FirstOrDefault(c => c.Id == mi.CategoryId)?.Name));
        }

        public async Task<MenuItemDto> GetByIdAsync(int id)
        {
            var menuItem = await _menuItemRepository.GetByIdAsync(id);
            if (menuItem == null) return null;

            var category = await _categoryRepository.GetByIdAsync(menuItem.CategoryId);
            return MapToDto(menuItem, category?.Name);
        }

        public async Task<MenuItemDto> CreateAsync(CreateMenuItemDto dto)
        {
            var category = await _categoryRepository.GetByIdAsync(dto.CategoryId);
            if (category == null)
            {
                throw new Exception("Category not found");
            }

            var existingItem = await _menuItemRepository.GetByNameAndCategoryAsync(dto.Name, dto.CategoryId);
            if (existingItem != null)
            {
                throw new Exception("Menu item name already exists in this category");
            }

            var menuItem = new MenuItem
            {
                CategoryId = dto.CategoryId,
                Name = dto.Name,
                Price = dto.Price,
                Image = dto.Image,
                Notes = dto.Notes,
                DisplayOrder = dto.DisplayOrder,
                IsAvailable = true,
                CreatedAt = DateTime.Now
            };

            var id = await _menuItemRepository.CreateAsync(menuItem);
            menuItem.Id = id;

            return MapToDto(menuItem, category.Name);
        }

        public async Task<MenuItemDto> UpdateAsync(int id, UpdateMenuItemDto dto)
        {
            var existingItem = await _menuItemRepository.GetByIdAsync(id);
            if (existingItem == null)
            {
                throw new Exception("Menu item not found");
            }

            var category = await _categoryRepository.GetByIdAsync(dto.CategoryId);
            if (category == null)
            {
                throw new Exception("Category not found");
            }

            var duplicateItem = await _menuItemRepository.GetByNameAndCategoryAsync(dto.Name, dto.CategoryId);
            if (duplicateItem != null && duplicateItem.Id != id)
            {
                throw new Exception("Menu item name already exists in this category");
            }

            existingItem.CategoryId = dto.CategoryId;
            existingItem.Name = dto.Name;
            existingItem.Price = dto.Price;
            existingItem.Image = dto.Image;
            existingItem.Notes = dto.Notes;
            existingItem.DisplayOrder = dto.DisplayOrder;
            existingItem.UpdatedAt = DateTime.Now;

            await _menuItemRepository.UpdateAsync(existingItem);

            return MapToDto(existingItem, category.Name);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var menuItem = await _menuItemRepository.GetByIdAsync(id);
            if (menuItem == null)
            {
                throw new Exception("Menu item not found");
            }

            return await _menuItemRepository.DeleteAsync(id);
        }

        public async Task<MenuItemDto> ToggleAvailabilityAsync(int id, bool isAvailable)
        {
            var menuItem = await _menuItemRepository.GetByIdAsync(id);
            if (menuItem == null)
            {
                throw new Exception("Menu item not found");
            }

            menuItem.IsAvailable = isAvailable;
            menuItem.UpdatedAt = DateTime.Now;
            await _menuItemRepository.UpdateAsync(menuItem);

            var category = await _categoryRepository.GetByIdAsync(menuItem.CategoryId);
            return MapToDto(menuItem, category?.Name);
        }

        private MenuItemDto MapToDto(MenuItem menuItem, string categoryName)
        {
            return new MenuItemDto
            {
                Id = menuItem.Id,
                CategoryId = menuItem.CategoryId,
                CategoryName = categoryName,
                Name = menuItem.Name,
                Price = menuItem.Price,
                Image = menuItem.Image,
                Notes = menuItem.Notes,
                DisplayOrder = menuItem.DisplayOrder,
                IsAvailable = menuItem.IsAvailable
            };
        }
    }
}
