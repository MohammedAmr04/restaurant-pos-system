using System;

namespace RestaurantPOS.Features.Reports
{
    public class ReturnsReportDto
    {
        public string InvoiceNumber { get; set; }
        public DateTime ReturnDate { get; set; }
        public string ReturnedItems { get; set; }
        public decimal RefundAmount { get; set; }
        public string Cashier { get; set; }
    }
}
