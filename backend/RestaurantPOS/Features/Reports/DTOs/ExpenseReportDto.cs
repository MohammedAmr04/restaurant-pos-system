using System;

namespace RestaurantPOS.Features.Reports
{
    public class ExpenseReportDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public decimal Amount { get; set; }
        public string CreatedBy { get; set; }
        public DateTime Date { get; set; }
        public string Notes { get; set; }
    }
}
