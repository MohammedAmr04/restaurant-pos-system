using System;
using System.Collections.Generic;

namespace RestaurantPOS.Features.Reports
{
    public class DailyInvoiceDto
    {
        public int Id { get; set; }
        public string InvoiceNumber { get; set; }
        public string OrderType { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Cashier { get; set; }
        public string CustomerName { get; set; }
        public string PaymentMethod { get; set; }
        public decimal Subtotal { get; set; }
        public decimal DiscountValue { get; set; }
        public decimal ServiceCharge { get; set; }
        public decimal Tax { get; set; }
        public decimal GrandTotal { get; set; }
        public bool IsReturned { get; set; }
        public decimal RefundAmount { get; set; }
        public string ReturnReason { get; set; }
        public string ReturnedItems { get; set; }
        public List<DailyInvoiceItemDto> Items { get; set; } = new List<DailyInvoiceItemDto>();
    }
}
