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
        private readonly Settings.ISettingsRepository _settingsRepository;

        public ReportsService(IDbConnection connection, Settings.ISettingsRepository settingsRepository)
        {
            _connection = connection;
            _settingsRepository = settingsRepository;
        }

        public async Task<DateTime> GetCurrentBusinessDateAsync()
        {
            var settings = await _settingsRepository.GetAsync();
            return Shared.BusinessDayHelper.GetBusinessDate(DateTime.Now, Shared.BusinessDayHelper.GetShiftStart(settings));
        }

        public async Task<DailySalesReportDto> GetDailyReportAsync(DateTime date)
        {
            var businessDate = date.Date.ToString("yyyy-MM-dd");

            var orders = await _connection.QueryAsync<Features.Orders.Order>(
                "SELECT * FROM Orders WHERE date(BusinessDate) = @BusinessDate AND Status IN ('Completed', 'Returned')",
                new { BusinessDate = businessDate });

            var expenses = await _connection.QueryAsync<Features.Expenses.Expense>(
                "SELECT * FROM Expenses WHERE date(BusinessDate) = @BusinessDate",
                new { BusinessDate = businessDate });

            var returns = await _connection.QueryAsync<Features.Returns.Return>(
                "SELECT r.* FROM Returns r INNER JOIN Orders o ON r.OrderId = o.Id WHERE date(o.BusinessDate) = @BusinessDate",
                new { BusinessDate = businessDate });

            var settings = await _settingsRepository.GetAsync();
            var shiftStart = Shared.BusinessDayHelper.GetShiftStart(settings);
            var shiftEnd = Shared.BusinessDayHelper.GetShiftEnd(settings);

            var totalSales = orders.Sum(o => o.GrandTotal);
            var discounts = orders.Sum(o => o.DiscountValue);
            var serviceCharge = orders.Sum(o => o.ServiceCharge);
            var totalExpenses = expenses.Sum(e => e.Amount);
            var totalReturns = returns.Sum(r => r.TotalRefund);

            return new DailySalesReportDto
            {
                BusinessDate = date.Date,
                TotalOrders = orders.Count(),
                CompletedOrders = orders.Count(o => o.Status == "Completed"),
                ReturnedOrders = orders.Count(o => o.Status == "Returned"),
                TotalSales = totalSales,
                Discounts = discounts,
                ServiceCharge = serviceCharge,
                Returns = totalReturns,
                Expenses = totalExpenses,
                RevenueBeforeExpenses = totalSales - totalReturns,
                RevenueAfterExpenses = totalSales - totalReturns - totalExpenses,
                ShiftStart = Shared.BusinessDayHelper.FormatShift(shiftStart),
                ShiftEnd = Shared.BusinessDayHelper.FormatShift(shiftEnd),
                OrderTypes = BuildOrderTypesBreakdown(orders)
            };
        }

        private static OrderTypesBreakdownDto BuildOrderTypesBreakdown(IEnumerable<Features.Orders.Order> orders)
        {
            var list = orders as IReadOnlyCollection<Features.Orders.Order> ?? orders.ToList();
            return new OrderTypesBreakdownDto
            {
                DineIn = BuildTypeBreakdown(list, o => o.OrderType == "DineIn"),
                Delivery = BuildTypeBreakdown(list, o => o.OrderType == "Delivery"),
                TakeAway = BuildTypeBreakdown(list, o => o.OrderType == "TakeAway")
            };
        }

        private static OrderTypeCountAmountDto BuildTypeBreakdown(IReadOnlyCollection<Features.Orders.Order> orders, Func<Features.Orders.Order, bool> predicate)
        {
            var filtered = orders.Where(predicate).ToList();
            return new OrderTypeCountAmountDto
            {
                Count = filtered.Count,
                Amount = filtered.Sum(o => o.GrandTotal)
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
                "SELECT * FROM Orders WHERE date(BusinessDate) >= @Start AND date(BusinessDate) <= @End AND Status IN ('Completed', 'Returned')",
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
            var settings = await _settingsRepository.GetAsync();
            var today = Shared.BusinessDayHelper.GetBusinessDate(DateTime.Now, Shared.BusinessDayHelper.GetShiftStart(settings)).ToString("yyyy-MM-dd");
            var monthStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).ToString("yyyy-MM-dd");
            var monthEnd = DateTime.Now.Date.ToString("yyyy-MM-dd");

            var todayOrders = await _connection.QueryAsync<Features.Orders.Order>(
                "SELECT * FROM Orders WHERE date(BusinessDate) = @Today AND Status IN ('Completed', 'Returned')",
                new { Today = today });

            var todayExpenses = await _connection.QueryAsync<Features.Expenses.Expense>(
                "SELECT * FROM Expenses WHERE date(BusinessDate) = @Today",
                new { Today = today });

            var todayReturns = await _connection.QueryAsync<Features.Returns.Return>(
                "SELECT r.* FROM Returns r INNER JOIN Orders o ON r.OrderId = o.Id WHERE date(o.BusinessDate) = @Today",
                new { Today = today });

            var monthOrders = await _connection.QueryAsync<Features.Orders.Order>(
                "SELECT * FROM Orders WHERE date(BusinessDate) >= @Start AND date(BusinessDate) <= @End AND Status IN ('Completed', 'Returned')",
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

        public async Task<DailyDetailsDto> GetDailyDetailsAsync(DateTime date)
        {
            var businessDate = date.Date.ToString("yyyy-MM-dd");

            var orderRows = await _connection.QueryAsync<DailyInvoiceRow>(
                @"SELECT o.Id, o.InvoiceNumber, o.OrderType, o.Status, o.CreatedAt, o.PaymentMethod,
                         o.Subtotal, o.DiscountValue, o.ServiceCharge, o.Tax, o.GrandTotal,
                         u.FullName AS CashierName, c.Name AS CustomerName
                  FROM Orders o
                  LEFT JOIN Users u ON o.UserId = u.Id
                  LEFT JOIN Customers c ON o.CustomerId = c.Id
                  WHERE date(o.BusinessDate) = @BusinessDate
                    AND o.Status IN ('Completed', 'Returned')
                    AND o.DeletedAt IS NULL
                  ORDER BY o.CreatedAt",
                new { BusinessDate = businessDate });

            var orderIds = orderRows.Select(o => o.Id).ToList();

            var itemRows = orderIds.Count > 0
                ? await _connection.QueryAsync<DailyInvoiceItemRow>(
                    @"SELECT oi.OrderId, mi.Name AS MenuItemName, oi.Quantity, oi.UnitPrice, oi.Total
                      FROM OrderItems oi
                      INNER JOIN MenuItems mi ON oi.MenuItemId = mi.Id
                      WHERE oi.OrderId IN @OrderIds
                      ORDER BY oi.Id",
                    new { OrderIds = orderIds })
                : Enumerable.Empty<DailyInvoiceItemRow>();

            var returnRows = orderIds.Count > 0
                ? await _connection.QueryAsync<ReturnDetailRow>(
                    @"SELECT r.OrderId, r.TotalRefund, r.Reason,
                             (mi.Name || ' x' || ri.Quantity) AS ReturnedItemText
                      FROM Returns r
                      INNER JOIN Orders o ON r.OrderId = o.Id
                      INNER JOIN ReturnItems ri ON r.Id = ri.ReturnId
                      INNER JOIN OrderItems oi ON ri.OrderItemId = oi.Id
                      INNER JOIN MenuItems mi ON oi.MenuItemId = mi.Id
                      WHERE date(o.BusinessDate) = @BusinessDate
                      ORDER BY r.Id, ri.Id",
                    new { BusinessDate = businessDate })
                : Enumerable.Empty<ReturnDetailRow>();

            var totalExpenses = await _connection.ExecuteScalarAsync<decimal>(
                "SELECT COALESCE(SUM(Amount), 0) FROM Expenses WHERE date(BusinessDate) = @BusinessDate",
                new { BusinessDate = businessDate });

            var itemsByOrder = itemRows
                .GroupBy(i => i.OrderId)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(i => new DailyInvoiceItemDto
                    {
                        MenuItemName = i.MenuItemName,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        Total = i.Total
                    }).ToList());

            var returnsByOrder = returnRows
                .GroupBy(r => r.OrderId)
                .ToDictionary(
                    g => g.Key,
                    g => new ReturnDetailDto
                    {
                        TotalRefund = g.Sum(r => r.TotalRefund),
                        Reason = g.FirstOrDefault(r => !string.IsNullOrEmpty(r.Reason))?.Reason,
                        ReturnedItemsText = string.Join("، ", g.Select(r => r.ReturnedItemText))
                    });

            var invoices = orderRows.Select(o =>
            {
                var hasReturn = returnsByOrder.TryGetValue(o.Id, out var ret);
                return new DailyInvoiceDto
                {
                    Id = o.Id,
                    InvoiceNumber = o.InvoiceNumber,
                    OrderType = o.OrderType,
                    Status = o.Status,
                    CreatedAt = o.CreatedAt,
                    Cashier = o.CashierName,
                    CustomerName = o.CustomerName,
                    PaymentMethod = o.PaymentMethod,
                    Subtotal = o.Subtotal,
                    DiscountValue = o.DiscountValue,
                    ServiceCharge = o.ServiceCharge,
                    Tax = o.Tax,
                    GrandTotal = o.GrandTotal,
                    IsReturned = hasReturn,
                    RefundAmount = hasReturn ? ret.TotalRefund : 0,
                    ReturnReason = hasReturn ? ret.Reason : null,
                    ReturnedItems = hasReturn ? ret.ReturnedItemsText : null,
                    Items = itemsByOrder.TryGetValue(o.Id, out var invoiceItems) ? invoiceItems : new List<DailyInvoiceItemDto>()
                };
            }).ToList();

            var grossSales = invoices.Sum(i => i.GrandTotal);
            var totalReturns = invoices.Sum(i => i.RefundAmount);

            return new DailyDetailsDto
            {
                BusinessDate = date.Date,
                TotalOrders = invoices.Count,
                CompletedOrders = invoices.Count(i => i.Status == "Completed"),
                ReturnedOrders = invoices.Count(i => i.Status == "Returned"),
                GrossSales = grossSales,
                Returns = totalReturns,
                Discounts = invoices.Sum(i => i.DiscountValue),
                ServiceCharges = invoices.Sum(i => i.ServiceCharge),
                Tax = invoices.Sum(i => i.Tax),
                Expenses = totalExpenses,
                Net = grossSales - totalReturns - totalExpenses,
                Invoices = invoices
            };
        }

        private class DailyInvoiceRow
        {
            public int Id { get; set; }
            public string InvoiceNumber { get; set; }
            public string OrderType { get; set; }
            public string Status { get; set; }
            public DateTime CreatedAt { get; set; }
            public string CashierName { get; set; }
            public string CustomerName { get; set; }
            public string PaymentMethod { get; set; }
            public decimal Subtotal { get; set; }
            public decimal DiscountValue { get; set; }
            public decimal ServiceCharge { get; set; }
            public decimal Tax { get; set; }
            public decimal GrandTotal { get; set; }
        }

        private class DailyInvoiceItemRow
        {
            public int OrderId { get; set; }
            public string MenuItemName { get; set; }
            public int Quantity { get; set; }
            public decimal UnitPrice { get; set; }
            public decimal Total { get; set; }
        }

        private class ReturnDetailRow
        {
            public int OrderId { get; set; }
            public decimal TotalRefund { get; set; }
            public string Reason { get; set; }
            public string ReturnedItemText { get; set; }
        }

        private class ReturnDetailDto
        {
            public decimal TotalRefund { get; set; }
            public string Reason { get; set; }
            public string ReturnedItemsText { get; set; }
        }
    }
}
