using System;

namespace RestaurantPOS.Features.Reports
{
    public class CustomReportDto
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int TotalOrders { get; set; }
        public decimal Sales { get; set; }
        public decimal Returns { get; set; }
        public decimal Expenses { get; set; }
        public decimal NetRevenue { get; set; }
    }
}
