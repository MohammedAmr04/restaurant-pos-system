using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using FluentValidation;
using RestaurantPOS.Features.Authentication.Services;
using RestaurantPOS.Shared;

namespace RestaurantPOS.Features.Categories.Controllers
{
    [RoutePrefix("api/v1/categories")]
    public class CategoriesController : ApiController
    {
        private readonly ICategoryService _categoryService;
        private readonly AuditLogService _auditLogService;

        public CategoriesController(ICategoryService categoryService, AuditLogService auditLogService)
        {
            _categoryService = categoryService;
            _auditLogService = auditLogService;
        }

        [HttpGet]
        [Route("")]
        public async Task<IHttpActionResult> GetAll()
        {
            var categories = await _categoryService.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<CategoryDto>>.Ok(categories));
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IHttpActionResult> GetById(int id)
        {
            var category = await _categoryService.GetByIdAsync(id);
            if (category == null)
            {
                return Ok(ApiResponse.Fail("Category not found"));
            }
            return Ok(ApiResponse<CategoryDto>.Ok(category));
        }

        [HttpPost]
        [Route("")]
        public async Task<IHttpActionResult> Create([FromBody] CreateCategoryDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Request body is required");
            }

            var validator = new CreateCategoryValidator();
            var validationResult = await validator.ValidateAsync(dto);

            if (!validationResult.IsValid)
            {
                var errors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    errors.Add(error.ErrorMessage);
                }
                return Ok(ApiResponse.Fail("Validation failed", errors));
            }

            try
            {
                var category = await _categoryService.CreateAsync(dto);
                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Create", "Category", category.Id, $"Created category: {category.Name}");
                return Ok(ApiResponse<CategoryDto>.Ok(category, "Category created successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IHttpActionResult> Update(int id, [FromBody] UpdateCategoryDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Request body is required");
            }

            var validator = new UpdateCategoryValidator();
            var validationResult = await validator.ValidateAsync(dto);

            if (!validationResult.IsValid)
            {
                var errors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    errors.Add(error.ErrorMessage);
                }
                return Ok(ApiResponse.Fail("Validation failed", errors));
            }

            try
            {
                var category = await _categoryService.UpdateAsync(id, dto);
                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Update", "Category", category.Id, $"Updated category: {category.Name}");
                return Ok(ApiResponse<CategoryDto>.Ok(category, "Category updated successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IHttpActionResult> Delete(int id)
        {
            try
            {
                var result = await _categoryService.DeleteAsync(id);
                if (!result)
                {
                    return Ok(ApiResponse.Fail("Category not found"));
                }
                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Delete", "Category", id, "Deleted category");
                return Ok(ApiResponse.Ok("Category deleted successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }
    }
}
