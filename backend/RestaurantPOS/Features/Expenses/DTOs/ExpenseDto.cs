using System;

namespace RestaurantPOS.Features.Expenses
{
    public class ExpenseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Title { get; set; }
        public decimal Amount { get; set; }
        public string Notes { get; set; }
        public DateTime BusinessDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
