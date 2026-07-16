using System;

namespace RestaurantPOS.Features.Returns
{
    public class Return
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public decimal TotalRefund { get; set; }
        public string Reason { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
