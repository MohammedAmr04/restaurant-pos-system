using System;

namespace RestaurantPOS.Features.Expenses
{
    public class Expense : Shared.BaseEntity
    {
        public int UserId { get; set; }
        public string Title { get; set; }
        public decimal Amount { get; set; }
        public string Notes { get; set; }
        public DateTime BusinessDate { get; set; }
    }
}
