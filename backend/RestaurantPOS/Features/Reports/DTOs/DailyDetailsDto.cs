using System;
using System.Collections.Generic;

namespace RestaurantPOS.Features.Reports
{
    public class DailyDetailsDto
    {
        public DateTime BusinessDate { get; set; }
        public int TotalOrders { get; set; }
        public int CompletedOrders { get; set; }
        public int ReturnedOrders { get; set; }
        public decimal GrossSales { get; set; }
        public decimal Returns { get; set; }
        public decimal Discounts { get; set; }
        public decimal ServiceCharges { get; set; }
        public decimal Tax { get; set; }
        public decimal Expenses { get; set; }
        public decimal Net { get; set; }
        public List<DailyInvoiceDto> Invoices { get; set; } = new List<DailyInvoiceDto>();
    }
}
