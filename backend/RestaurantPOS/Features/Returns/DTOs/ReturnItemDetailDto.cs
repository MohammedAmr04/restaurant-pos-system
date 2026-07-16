namespace RestaurantPOS.Features.Returns
{
    public class ReturnItemDetailDto
    {
        public int Id { get; set; }
        public int OrderItemId { get; set; }
        public string MenuItemName { get; set; }
        public int Quantity { get; set; }
        public decimal RefundAmount { get; set; }
    }
}
