using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RestaurantPOS.Features.Categories
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<IEnumerable<CategoryDto>> GetAllAsync()
        {
            var categories = await _categoryRepository.GetAllAsync();
            return categories.Select(MapToDto);
        }

        public async Task<CategoryDto> GetByIdAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null) return null;
            return MapToDto(category);
        }

        public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto)
        {
            var existingCategory = await _categoryRepository.GetByNameAsync(dto.Name);
            if (existingCategory != null)
            {
                throw new Exception("Category name already exists");
            }

            var category = new Category
            {
                Name = dto.Name,
                Image = dto.Image,
                DisplayOrder = dto.DisplayOrder,
                CreatedAt = DateTime.Now
            };

            var id = await _categoryRepository.CreateAsync(category);
            category.Id = id;

            return MapToDto(category);
        }

        public async Task<CategoryDto> UpdateAsync(int id, UpdateCategoryDto dto)
        {
            var existingCategory = await _categoryRepository.GetByIdAsync(id);
            if (existingCategory == null)
            {
                throw new Exception("Category not found");
            }

            var duplicateCategory = await _categoryRepository.GetByNameAsync(dto.Name);
            if (duplicateCategory != null && duplicateCategory.Id != id)
            {
                throw new Exception("Category name already exists");
            }

            existingCategory.Name = dto.Name;
            existingCategory.Image = dto.Image;
            existingCategory.DisplayOrder = dto.DisplayOrder;
            existingCategory.UpdatedAt = DateTime.Now;

            await _categoryRepository.UpdateAsync(existingCategory);

            return MapToDto(existingCategory);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null)
            {
                throw new Exception("Category not found");
            }

            var hasMenuItems = await _categoryRepository.HasMenuItemsAsync(id);
            if (hasMenuItems)
            {
                throw new Exception("Cannot delete category with menu items");
            }

            return await _categoryRepository.DeleteAsync(id);
        }

        private CategoryDto MapToDto(Category category)
        {
            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Image = category.Image,
                DisplayOrder = category.DisplayOrder
            };
        }
    }
}
