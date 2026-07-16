using System;
using System.Threading.Tasks;
using System.Web.Http;
using FluentValidation;
using RestaurantPOS.Features.Authentication.Services;
using RestaurantPOS.Shared;

namespace RestaurantPOS.Features.Settings.Controllers
{
    [RoutePrefix("api/v1/settings")]
    public class SettingsController : ApiController
    {
        private readonly ISettingsService _settingsService;
        private readonly AuditLogService _auditLogService;

        public SettingsController(ISettingsService settingsService, AuditLogService auditLogService)
        {
            _settingsService = settingsService;
            _auditLogService = auditLogService;
        }

        [HttpGet]
        [Route("")]
        public async Task<IHttpActionResult> Get()
        {
            var settings = await _settingsService.GetAsync();
            if (settings == null)
            {
                return Ok(ApiResponse.Fail("Settings not found"));
            }
            return Ok(ApiResponse<SettingsDto>.Ok(settings));
        }

        [HttpPut]
        [Route("")]
        public async Task<IHttpActionResult> Update([FromBody] UpdateSettingsDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Request body is required");
            }

            try
            {
                var settings = await _settingsService.UpdateAsync(dto);
                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Update", "Settings", settings.Id, "Updated system settings");
                return Ok(ApiResponse<SettingsDto>.Ok(settings, "Settings updated successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }
    }
}
