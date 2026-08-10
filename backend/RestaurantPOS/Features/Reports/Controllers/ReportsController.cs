using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using RestaurantPOS.Features.Authentication.Services;
using RestaurantPOS.Shared;

namespace RestaurantPOS.Features.Reports.Controllers
{
    [RoutePrefix("api/v1/reports")]
    public class ReportsController : ApiController
    {
        private readonly IReportsService _reportsService;
        private readonly Settings.ISettingsService _settingsService;
        private readonly Printing.IPrinterService _printerService;
        private readonly AuditLogService _auditLogService;

        public ReportsController(
            IReportsService reportsService,
            Settings.ISettingsService settingsService,
            Printing.IPrinterService printerService,
            AuditLogService auditLogService)
        {
            _reportsService = reportsService;
            _settingsService = settingsService;
            _printerService = printerService;
            _auditLogService = auditLogService;
        }

        [HttpGet]
        [Route("daily")]
        public async Task<IHttpActionResult> GetDailyReport([FromUri] DateTime? date = null)
        {
            var reportDate = date ?? await _reportsService.GetCurrentBusinessDateAsync();
            var report = await _reportsService.GetDailyReportAsync(reportDate);
            return Ok(ApiResponse<DailySalesReportDto>.Ok(report));
        }

        [HttpPost]
        [Route("daily/print")]
        public async Task<IHttpActionResult> PrintDailyReport([FromUri] DateTime? date = null)
        {
            try
            {
                var reportDate = date ?? await _reportsService.GetCurrentBusinessDateAsync();
                var report = await _reportsService.GetDailyReportAsync(reportDate);
                var settings = await _settingsService.GetAsync();
                _printerService.PrintDailyReport(report, settings);

                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Print", "DailyReport", 0, $"Printed daily report: {reportDate:yyyy-MM-dd}");
                return Ok(ApiResponse.Ok("Daily report printed successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }

        [HttpGet]
        [Route("monthly")]
        public async Task<IHttpActionResult> GetMonthlyReport([FromUri] int? year = null, [FromUri] int? month = null)
        {
            var reportYear = year ?? DateTime.Now.Year;
            var reportMonth = month ?? DateTime.Now.Month;
            var report = await _reportsService.GetMonthlyReportAsync(reportYear, reportMonth);
            return Ok(ApiResponse<MonthlySalesReportDto>.Ok(report));
        }

        [HttpGet]
        [Route("daily-details")]
        public async Task<IHttpActionResult> GetDailyDetails([FromUri] DateTime? date = null)
        {
            var reportDate = date ?? await _reportsService.GetCurrentBusinessDateAsync();
            var report = await _reportsService.GetDailyDetailsAsync(reportDate);
            return Ok(ApiResponse<DailyDetailsDto>.Ok(report));
        }

        [HttpGet]
        [Route("custom")]
        public async Task<IHttpActionResult> GetCustomReport([FromUri] DateTime startDate, [FromUri] DateTime endDate)
        {
            var report = await _reportsService.GetCustomReportAsync(startDate, endDate);
            return Ok(ApiResponse<CustomReportDto>.Ok(report));
        }

        [HttpGet]
        [Route("delivery")]
        public async Task<IHttpActionResult> GetDeliveryReport([FromUri] DateTime startDate, [FromUri] DateTime endDate)
        {
            var report = await _reportsService.GetDeliveryReportAsync(startDate, endDate);
            return Ok(ApiResponse<IEnumerable<DeliveryReportDto>>.Ok(report));
        }

        [HttpGet]
        [Route("expenses")]
        public async Task<IHttpActionResult> GetExpenseReport([FromUri] DateTime startDate, [FromUri] DateTime endDate)
        {
            var report = await _reportsService.GetExpenseReportAsync(startDate, endDate);
            return Ok(ApiResponse<IEnumerable<ExpenseReportDto>>.Ok(report));
        }

        [HttpGet]
        [Route("returns")]
        public async Task<IHttpActionResult> GetReturnsReport([FromUri] DateTime startDate, [FromUri] DateTime endDate)
        {
            var report = await _reportsService.GetReturnsReportAsync(startDate, endDate);
            return Ok(ApiResponse<IEnumerable<ReturnsReportDto>>.Ok(report));
        }

        [HttpGet]
        [Route("dashboard")]
        public async Task<IHttpActionResult> GetDashboardSummary()
        {
            var summary = await _reportsService.GetDashboardSummaryAsync();
            return Ok(ApiResponse<DashboardSummaryDto>.Ok(summary));
        }
    }
}
