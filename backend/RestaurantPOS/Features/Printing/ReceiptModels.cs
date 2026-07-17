using System;
using System.Collections.Generic;

namespace RestaurantPOS.Features.Printing
{
    public enum ReceiptType
    {
        Kitchen,
        Customer,
        Cashier
    }

    public class ReceiptModel
    {
        public ReceiptType Type { get; set; }
        public string RestaurantName { get; set; }
        public string Phone { get; set; }
        public string Phone2 { get; set; }
        public string Address { get; set; }
        public string InvoiceNumber { get; set; }
        public int DailyOrderNumber { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime PrintedAt { get; set; }
        public string CashierName { get; set; }
        public string OrderType { get; set; }
        public int? TableNumber { get; set; }
        public string CustomerName { get; set; }
        public string DeliveryRiderName { get; set; }
        public List<ReceiptItemModel> Items { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Discount { get; set; }
        public string DiscountType { get; set; }
        public decimal ServiceCharge { get; set; }
        public decimal Tax { get; set; }
        public decimal GrandTotal { get; set; }
        public decimal PaidAmount { get; set; }
        public string PaymentMethod { get; set; }
        public string FooterText { get; set; }
    }

    public class ReceiptItemModel
    {
        public int Quantity { get; set; }
        public string Name { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Total { get; set; }
        public string Notes { get; set; }
    }
}
