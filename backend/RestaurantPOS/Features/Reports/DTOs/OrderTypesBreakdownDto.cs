namespace RestaurantPOS.Features.Reports
{
    public class OrderTypesBreakdownDto
    {
        public OrderTypeCountAmountDto DineIn { get; set; }
        public OrderTypeCountAmountDto Delivery { get; set; }
        public OrderTypeCountAmountDto TakeAway { get; set; }
    }
}
