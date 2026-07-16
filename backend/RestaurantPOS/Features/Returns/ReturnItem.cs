namespace RestaurantPOS.Features.Returns
{
    public class ReturnItem
    {
        public int Id { get; set; }
        public int ReturnId { get; set; }
        public int OrderItemId { get; set; }
        public int Quantity { get; set; }
        public decimal RefundAmount { get; set; }
    }
}
