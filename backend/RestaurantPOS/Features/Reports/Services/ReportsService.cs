using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;

namespace RestaurantPOS.Features.Reports
{
    public class ReportsService : IReportsService
    {
        private readonly IDbConnection _connection;

        public ReportsService(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<DailySalesReportDto> GetDailyReportAsync(DateTime date)
        {
            var businessDate = date.Date.ToString("yyyy-MM-dd");

            var orders = await _connection.QueryAsync<Features.Orders.Order>(
                "SELECT * FROM Orders WHERE date(BusinessDate) = @BusinessDate AND Status = 'Completed'",
                new { BusinessDate = businessDate });

            var expenses = await _connection.QueryAsync<Features.Expenses.Expense>(
                "SELECT * FROM Expenses WHERE date(BusinessDate) = @BusinessDate",
                new { BusinessDate = businessDate });

            var returns = await _connection.QueryAsync<Features.Returns.Return>(
                "SELECT r.* FROM Returns r INNER JOIN Orders o ON r.OrderId = o.Id WHERE date(o.BusinessDate) = @BusinessDate",
                new { BusinessDate = businessDate });

            var totalSales = orders.Sum(o => o.GrandTotal);
            var discounts = orders.Sum(o => o.DiscountValue);
            var serviceCharge = orders.Sum(o => o.ServiceCharge);
            var totalExpenses = expenses.Sum(e => e.Amount);
            var totalReturns = returns.Sum(r => r.TotalRefund);

            return new DailySalesReportDto
            {
                BusinessDate = date.Date,
                TotalOrders = orders.Count(),
                CompletedOrders = orders.Count(),
                TotalSales = totalSales,
                Discounts = discounts,
                ServiceCharge = serviceCharge,
                Returns = totalReturns,
                Expenses = totalExpenses,
                RevenueBeforeExpenses = totalSales - totalReturns,
                RevenueAfterExpenses = totalSales - totalReturns - totalExpenses
            };
        }

        public async Task<MonthlySalesReportDto> GetMonthlyReportAsync(int year, int month)
        {
            var startDate = new DateTime(year, month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);

            var dailyReports = new List<DailySalesReportDto>();
            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                var dailyReport = await GetDailyReportAsync(date);
                if (dailyReport.TotalOrders > 0 || dailyReport.Expenses > 0)
                {
                    dailyReports.Add(dailyReport);
                }
            }

            return new MonthlySalesReportDto
            {
                Year = year,
                Month = month,
                DailySales = dailyReports,
                MonthlyTotal = dailyReports.Sum(d => d.TotalSales),
                MonthlyExpenses = dailyReports.Sum(d => d.Expenses),
                MonthlyReturns = dailyReports.Sum(d => d.Returns),
                NetRevenue = dailyReports.Sum(d => d.RevenueAfterExpenses)
            };
        }

        public async Task<CustomReportDto> GetCustomReportAsync(DateTime startDate, DateTime endDate)
        {
            var start = startDate.Date.ToString("yyyy-MM-dd");
            var end = endDate.Date.ToString("yyyy-MM-dd");

            var orders = await _connection.QueryAsync<Features.Orders.Order>(
                "SELECT * FROM Orders WHERE date(BusinessDate) >= @Start AND date(BusinessDate) <= @End AND Status = 'Completed'",
                new { Start = start, End = end });

            var expenses = await _connection.QueryAsync<Features.Expenses.Expense>(
                "SELECT * FROM Expenses WHERE date(BusinessDate) >= @Start AND date(BusinessDate) <= @End",
                new { Start = start, End = end });

            var returns = await _connection.QueryAsync<Features.Returns.Return>(
                "SELECT r.* FROM Returns r INNER JOIN Orders o ON r.OrderId = o.Id WHERE date(o.BusinessDate) >= @Start AND date(o.BusinessDate) <= @End",
                new { Start = start, End = end });

            var totalSales = orders.Sum(o => o.GrandTotal);
            var totalExpenses = expenses.Sum(e => e.Amount);
            var totalReturns = returns.Sum(r => r.TotalRefund);

            return new CustomReportDto
            {
                StartDate = startDate.Date,
                EndDate = endDate.Date,
                TotalOrders = orders.Count(),
                Sales = totalSales,
                Returns = totalReturns,
                Expenses = totalExpenses,
                NetRevenue = totalSales - totalReturns - totalExpenses
            };
        }

        public async Task<IEnumerable<DeliveryReportDto>> GetDeliveryReportAsync(DateTime startDate, DateTime endDate)
        {
            var start = startDate.Date.ToString("yyyy-MM-dd");
            var end = endDate.Date.ToString("yyyy-MM-dd");

            var sql = @"SELECT dr.Id as RiderId, dr.Name as RiderName, 
                       COUNT(o.Id) as NumberOfOrders, SUM(o.GrandTotal) as TotalSales
                       FROM Orders o 
                       INNER JOIN DeliveryRiders dr ON o.DeliveryRiderId = dr.Id
                       WHERE o.OrderType = 'Delivery' AND o.Status = 'Completed'
                       AND date(o.BusinessDate) >= @Start AND date(o.BusinessDate) <= @End
                       GROUP BY dr.Id, dr.Name";

            return await _connection.QueryAsync<DeliveryReportDto>(sql, new { Start = start, End = end });
        }

        public async Task<IEnumerable<ExpenseReportDto>> GetExpenseReportAsync(DateTime startDate, DateTime endDate)
        {
            var start = startDate.Date.ToString("yyyy-MM-dd");
            var end = endDate.Date.ToString("yyyy-MM-dd");

            var sql = @"SELECT e.Id, e.Title, e.Amount, u.FullName as CreatedBy, e.BusinessDate as Date, e.Notes
                       FROM Expenses e 
                       INNER JOIN Users u ON e.UserId = u.Id
                       WHERE date(e.BusinessDate) >= @Start AND date(e.BusinessDate) <= @End
                       ORDER BY e.BusinessDate DESC";

            return await _connection.QueryAsync<ExpenseReportDto>(sql, new { Start = start, End = end });
        }

        public async Task<IEnumerable<ReturnsReportDto>> GetReturnsReportAsync(DateTime startDate, DateTime endDate)
        {
            var start = startDate.Date.ToString("yyyy-MM-dd");
            var end = endDate.Date.ToString("yyyy-MM-dd");

            var sql = @"SELECT o.InvoiceNumber, r.CreatedAt as ReturnDate, 
                       GROUP_CONCAT(mi.Name || ' x' || ri.Quantity) as ReturnedItems,
                       r.TotalRefund as RefundAmount, u.FullName as Cashier
                       FROM Returns r
                       INNER JOIN Orders o ON r.OrderId = o.Id
                       INNER JOIN ReturnItems ri ON r.Id = ri.ReturnId
                       INNER JOIN OrderItems oi ON ri.OrderItemId = oi.Id
                       INNER JOIN MenuItems mi ON oi.MenuItemId = mi.Id
                       INNER JOIN Users u ON r.UserId = u.Id
                       WHERE date(o.BusinessDate) >= @Start AND date(o.BusinessDate) <= @End
                       GROUP BY r.Id";

            return await _connection.QueryAsync<ReturnsReportDto>(sql, new { Start = start, End = end });
        }

        public async Task<DashboardSummaryDto> GetDashboardSummaryAsync()
        {
            var today = DateTime.Now.Date.ToString("yyyy-MM-dd");
            var monthStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).ToString("yyyy-MM-dd");
            var monthEnd = DateTime.Now.Date.ToString("yyyy-MM-dd");

            var todayOrders = await _connection.QueryAsync<Features.Orders.Order>(
                "SELECT * FROM Orders WHERE date(BusinessDate) = @Today AND Status = 'Completed'",
                new { Today = today });

            var todayExpenses = await _connection.QueryAsync<Features.Expenses.Expense>(
                "SELECT * FROM Expenses WHERE date(BusinessDate) = @Today",
                new { Today = today });

            var todayReturns = await _connection.QueryAsync<Features.Returns.Return>(
                "SELECT r.* FROM Returns r INNER JOIN Orders o ON r.OrderId = o.Id WHERE date(o.BusinessDate) = @Today",
                new { Today = today });

            var monthOrders = await _connection.QueryAsync<Features.Orders.Order>(
                "SELECT * FROM Orders WHERE date(BusinessDate) >= @Start AND date(BusinessDate) <= @End AND Status = 'Completed'",
                new { Start = monthStart, End = monthEnd });

            var holdOrders = await _connection.QueryAsync<Features.Orders.Order>(
                "SELECT * FROM Orders WHERE Status = 'Hold'");

            var totalMenuItems = await _connection.QuerySingleAsync<int>(
                "SELECT COUNT(*) FROM MenuItems");

            var availableMenuItems = await _connection.QuerySingleAsync<int>(
                "SELECT COUNT(*) FROM MenuItems WHERE IsActive = 1");

            return new DashboardSummaryDto
            {
                TodaySales = todayOrders.Sum(o => o.GrandTotal),
                TodayOrders = todayOrders.Count(),
                TodayExpenses = todayExpenses.Sum(e => e.Amount),
                TodayReturns = todayReturns.Sum(r => r.TotalRefund),
                MonthSales = monthOrders.Sum(o => o.GrandTotal),
                MonthOrders = monthOrders.Count(),
                ActiveHoldOrders = holdOrders.Count(),
                TotalMenuItems = totalMenuItems,
                AvailableMenuItems = availableMenuItems
            };
        }
    }
}
