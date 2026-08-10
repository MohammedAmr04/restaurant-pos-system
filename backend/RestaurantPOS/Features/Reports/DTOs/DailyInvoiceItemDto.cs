namespace RestaurantPOS.Features.Reports
{
    public class DailyInvoiceItemDto
    {
        public string MenuItemName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Total { get; set; }
    }
}
