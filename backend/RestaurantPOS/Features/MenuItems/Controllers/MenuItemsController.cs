using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using FluentValidation;
using RestaurantPOS.Features.Authentication.Services;
using RestaurantPOS.Shared;

namespace RestaurantPOS.Features.MenuItems.Controllers
{
    [RoutePrefix("api/v1/menu-items")]
    public class MenuItemsController : ApiController
    {
        private readonly IMenuItemService _menuItemService;
        private readonly AuditLogService _auditLogService;

        public MenuItemsController(IMenuItemService menuItemService, AuditLogService auditLogService)
        {
            _menuItemService = menuItemService;
            _auditLogService = auditLogService;
        }

        [HttpGet]
        [Route("")]
        public async Task<IHttpActionResult> GetAll()
        {
            var menuItems = await _menuItemService.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<MenuItemDto>>.Ok(menuItems));
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IHttpActionResult> GetById(int id)
        {
            var menuItem = await _menuItemService.GetByIdAsync(id);
            if (menuItem == null)
            {
                return Ok(ApiResponse.Fail("Menu item not found"));
            }
            return Ok(ApiResponse<MenuItemDto>.Ok(menuItem));
        }

        [HttpPost]
        [Route("")]
        public async Task<IHttpActionResult> Create([FromBody] CreateMenuItemDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Request body is required");
            }

            var validator = new CreateMenuItemValidator();
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
                var menuItem = await _menuItemService.CreateAsync(dto);
                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Create", "MenuItem", menuItem.Id, $"Created menu item: {menuItem.Name}");
                return Ok(ApiResponse<MenuItemDto>.Ok(menuItem, "Menu item created successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IHttpActionResult> Update(int id, [FromBody] UpdateMenuItemDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Request body is required");
            }

            var validator = new UpdateMenuItemValidator();
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
                var menuItem = await _menuItemService.UpdateAsync(id, dto);
                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Update", "MenuItem", menuItem.Id, $"Updated menu item: {menuItem.Name}");
                return Ok(ApiResponse<MenuItemDto>.Ok(menuItem, "Menu item updated successfully"));
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
                var result = await _menuItemService.DeleteAsync(id);
                if (!result)
                {
                    return Ok(ApiResponse.Fail("Menu item not found"));
                }
                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Delete", "MenuItem", id, "Deleted menu item");
                return Ok(ApiResponse.Ok("Menu item deleted successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }

        [HttpPatch]
        [Route("{id:int}/availability")]
        public async Task<IHttpActionResult> ToggleAvailability(int id, [FromBody] ToggleAvailabilityDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Request body is required");
            }

            try
            {
                var menuItem = await _menuItemService.ToggleAvailabilityAsync(id, dto.IsAvailable);
                var userId = AuthHelper.GetCurrentUserId();
                var status = dto.IsAvailable ? "available" : "unavailable";
                await _auditLogService.LogAsync(userId, "Update", "MenuItem", menuItem.Id, $"Changed availability to {status}: {menuItem.Name}");
                return Ok(ApiResponse<MenuItemDto>.Ok(menuItem, "Availability updated successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }
    }
}
