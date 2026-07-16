using System;
using System.Collections.Generic;

namespace RestaurantPOS.Features.Returns
{
    public class ReturnDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string InvoiceNumber { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public decimal TotalRefund { get; set; }
        public string Reason { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<ReturnItemDetailDto> Items { get; set; }
    }
}
