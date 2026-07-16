using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using RestaurantPOS.Features.Authentication.Services;
using RestaurantPOS.Shared;

namespace RestaurantPOS.Features.DailyClosing.Controllers
{
    [RoutePrefix("api/v1/daily-closing")]
    public class DailyClosingController : ApiController
    {
        private readonly IDailyClosingService _closingService;
        private readonly AuditLogService _auditLogService;

        public DailyClosingController(IDailyClosingService closingService, AuditLogService auditLogService)
        {
            _closingService = closingService;
            _auditLogService = auditLogService;
        }

        [HttpGet]
        [Route("")]
        public async Task<IHttpActionResult> GetTodaySummary()
        {
            var summary = await _closingService.GetTodaySummaryAsync();
            return Ok(ApiResponse<DailyClosingSummaryDto>.Ok(summary));
        }

        [HttpGet]
        [Route("history")]
        public async Task<IHttpActionResult> GetAll()
        {
            var closings = await _closingService.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<DailyClosingDto>>.Ok(closings));
        }

        [HttpGet]
        [Route("{date:datetime}")]
        public async Task<IHttpActionResult> GetByDate(DateTime date)
        {
            var closing = await _closingService.GetByDateAsync(date);
            if (closing == null)
            {
                return Ok(ApiResponse.Fail("No closing record found for this date"));
            }
            return Ok(ApiResponse<DailyClosingDto>.Ok(closing));
        }

        [HttpPost]
        [Route("")]
        public async Task<IHttpActionResult> Create([FromBody] CreateDailyClosingDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Request body is required");
            }

            try
            {
                var closing = await _closingService.CreateAsync(dto);
                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Create", "DailyClosing", closing.Id, $"Closed day: {closing.BusinessDate:yyyy-MM-dd}");
                return Ok(ApiResponse<DailyClosingDto>.Ok(closing, "Daily closing recorded successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }
    }
}
