using System;

namespace RestaurantPOS.Features.DailyClosing
{
    public class DailyClosingSummaryDto
    {
        public DateTime BusinessDate { get; set; }
        public int TotalOrders { get; set; }
        public decimal TotalSales { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal TotalReturns { get; set; }
        public decimal CashCollected { get; set; }
        public decimal ExpectedCash { get; set; }
    }
}
