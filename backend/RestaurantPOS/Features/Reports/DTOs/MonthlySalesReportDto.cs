using System;
using System.Collections.Generic;

namespace RestaurantPOS.Features.Reports
{
    public class MonthlySalesReportDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public List<DailySalesReportDto> DailySales { get; set; }
        public decimal MonthlyTotal { get; set; }
        public decimal MonthlyExpenses { get; set; }
        public decimal MonthlyReturns { get; set; }
        public decimal NetRevenue { get; set; }
    }
}
