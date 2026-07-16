namespace RestaurantPOS.Features.Expenses
{
    public class UpdateExpenseDto
    {
        public string Title { get; set; }
        public decimal Amount { get; set; }
        public string Notes { get; set; }
    }
}
