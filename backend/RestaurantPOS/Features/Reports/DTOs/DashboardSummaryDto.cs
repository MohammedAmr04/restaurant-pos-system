namespace RestaurantPOS.Features.Reports
{
    public class DashboardSummaryDto
    {
        public decimal TodaySales { get; set; }
        public int TodayOrders { get; set; }
        public decimal TodayExpenses { get; set; }
        public decimal TodayReturns { get; set; }
        public decimal MonthSales { get; set; }
        public int MonthOrders { get; set; }
        public int ActiveHoldOrders { get; set; }
        public int TotalMenuItems { get; set; }
        public int AvailableMenuItems { get; set; }
    }
}
