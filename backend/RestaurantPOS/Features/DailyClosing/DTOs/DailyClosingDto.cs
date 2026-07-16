using System;

namespace RestaurantPOS.Features.DailyClosing
{
    public class DailyClosingDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public DateTime BusinessDate { get; set; }
        public decimal TotalSales { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal TotalReturns { get; set; }
        public decimal CashCollected { get; set; }
        public decimal ExpectedCash { get; set; }
        public decimal ActualCash { get; set; }
        public decimal Difference { get; set; }
        public string Notes { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
