namespace RestaurantPOS.Features.Orders
{
    public class CompleteOrderDto
    {
        public string PaymentMethod { get; set; }
        public decimal PaidAmount { get; set; }
    }
}
