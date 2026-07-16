namespace RestaurantPOS.Features.Orders
{
    public class OrderItemDto
    {
        public int? MenuItemId { get; set; }
        public int Quantity { get; set; }
        public string Notes { get; set; }
    }
}
