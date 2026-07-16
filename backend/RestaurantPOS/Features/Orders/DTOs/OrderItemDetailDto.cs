namespace RestaurantPOS.Features.Orders
{
    public class OrderItemDetailDto
    {
        public int Id { get; set; }
        public int MenuItemId { get; set; }
        public string MenuItemName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public string Notes { get; set; }
        public decimal Total { get; set; }
    }
}
