using System;

namespace RestaurantPOS.Features.DailyClosing
{
    public class DailyClosing : Shared.BaseEntity
    {
        public int UserId { get; set; }
        public DateTime BusinessDate { get; set; }
        public decimal TotalSales { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal TotalReturns { get; set; }
        public decimal CashCollected { get; set; }
        public decimal ExpectedCash { get; set; }
        public decimal ActualCash { get; set; }
        public decimal Difference { get; set; }
        public string Notes { get; set; }
    }
}
