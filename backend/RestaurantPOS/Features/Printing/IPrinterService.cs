namespace RestaurantPOS.Features.Printing
{
    public interface IPrinterService
    {
        void PrintReceipt(byte[] receiptBytes, string copyName);
        void PrintOrderReceipts(Orders.OrderDto order, Settings.SettingsDto settings);
    }
}
