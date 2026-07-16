namespace RestaurantPOS.Features.Expenses
{
    public class CreateExpenseDto
    {
        public string Title { get; set; }
        public decimal Amount { get; set; }
        public string Notes { get; set; }
    }
}
