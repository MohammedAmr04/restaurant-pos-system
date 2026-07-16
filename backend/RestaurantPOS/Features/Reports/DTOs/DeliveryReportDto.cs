namespace RestaurantPOS.Features.Reports
{
    public class DeliveryReportDto
    {
        public int RiderId { get; set; }
        public string RiderName { get; set; }
        public int NumberOfOrders { get; set; }
        public decimal TotalSales { get; set; }
    }
}
