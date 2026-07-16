using System;

namespace RestaurantPOS.Features.Reports
{
    public class DailySalesReportDto
    {
        public DateTime BusinessDate { get; set; }
        public int TotalOrders { get; set; }
        public int CompletedOrders { get; set; }
        public decimal TotalSales { get; set; }
        public decimal Discounts { get; set; }
        public decimal ServiceCharge { get; set; }
        public decimal Returns { get; set; }
        public decimal Expenses { get; set; }
        public decimal RevenueBeforeExpenses { get; set; }
        public decimal RevenueAfterExpenses { get; set; }
    }
}
