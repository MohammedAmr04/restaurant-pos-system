using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;

namespace RestaurantPOS.Features.Reports
{
    public interface IReportsService
    {
        Task<DailySalesReportDto> GetDailyReportAsync(DateTime date);
        Task<MonthlySalesReportDto> GetMonthlyReportAsync(int year, int month);
        Task<CustomReportDto> GetCustomReportAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<DeliveryReportDto>> GetDeliveryReportAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<ExpenseReportDto>> GetExpenseReportAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<ReturnsReportDto>> GetReturnsReportAsync(DateTime startDate, DateTime endDate);
        Task<DashboardSummaryDto> GetDashboardSummaryAsync();
    }
}
