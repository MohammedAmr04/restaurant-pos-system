namespace RestaurantPOS.Features.Settings
{
    public class SettingsDto
    {
        public int Id { get; set; }
        public string RestaurantName { get; set; }
        public string Phone { get; set; }
        public string Phone2 { get; set; }
        public string Address { get; set; }
        public string Logo { get; set; }
        public bool TaxEnabled { get; set; }
        public decimal TaxPercentage { get; set; }
        public bool ServiceChargeEnabled { get; set; }
        public decimal ServiceChargePercentage { get; set; }
        public string ReceiptHeader { get; set; }
        public string ReceiptFooter { get; set; }
        public string PrinterName { get; set; }
        public int PaperWidth { get; set; }
        public int PrinterCopies { get; set; }
        public bool PrinterEnabled { get; set; }
    }
}
