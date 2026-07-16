using System;
using System.Collections.Generic;

namespace RestaurantPOS.Features.Orders
{
    public class OrderDto
    {
        public int Id { get; set; }
        public string InvoiceNumber { get; set; }
        public string OrderType { get; set; }
        public string Status { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public int? CustomerId { get; set; }
        public string CustomerName { get; set; }
        public int? TableId { get; set; }
        public int? TableNumber { get; set; }
        public int? DeliveryRiderId { get; set; }
        public string DeliveryRiderName { get; set; }
        public decimal Subtotal { get; set; }
        public string DiscountType { get; set; }
        public decimal DiscountValue { get; set; }
        public decimal ServiceCharge { get; set; }
        public decimal Tax { get; set; }
        public decimal GrandTotal { get; set; }
        public string PaymentMethod { get; set; }
        public decimal PaidAmount { get; set; }
        public DateTime BusinessDate { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<OrderItemDetailDto> Items { get; set; }
    }
}
