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
        public string CustomerAddress { get; set; }
        public string CustomerPhone { get; set; }
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
        public bool IsForeign { get; set; }
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

    public class DailyReportModel
    {
        public string RestaurantName { get; set; }
        public string Phone { get; set; }
        public string Phone2 { get; set; }
        public string Address { get; set; }
        public DateTime BusinessDate { get; set; }
        public string ShiftStart { get; set; }
        public string ShiftEnd { get; set; }
        public int TotalOrders { get; set; }
        public int CompletedOrders { get; set; }
        public int ReturnedOrders { get; set; }
        public decimal TotalSales { get; set; }
        public decimal Discounts { get; set; }
        public decimal ServiceCharge { get; set; }
        public decimal Returns { get; set; }
        public decimal Expenses { get; set; }
        public decimal RevenueBeforeExpenses { get; set; }
        public decimal RevenueAfterExpenses { get; set; }
        public int DineInCount { get; set; }
        public decimal DineInAmount { get; set; }
        public int DeliveryCount { get; set; }
        public decimal DeliveryAmount { get; set; }
        public int TakeAwayCount { get; set; }
        public decimal TakeAwayAmount { get; set; }
        public DateTime PrintedAt { get; set; }
    }
}
