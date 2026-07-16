using System;
using System.Collections.Generic;

namespace RestaurantPOS.Features.Orders
{
    public class CreateOrderDto
    {
        public string OrderType { get; set; }
        public int? CustomerId { get; set; }
        public int? TableId { get; set; }
        public int? DeliveryRiderId { get; set; }
        public List<OrderItemDto> Items { get; set; }
    }
}
