using System;
using System.Drawing;
using System.Drawing.Printing;
using System.IO;
using Serilog;

namespace RestaurantPOS.Features.Printing
{
    public class PrinterService : IPrinterService
    {
        private string _printerName;

        public PrinterService()
        {
            _printerName = GetDefaultPrinter();
        }

        public void ConfigurePrinter(string printerName, bool enabled)
        {
            if (!enabled)
            {
                _printerName = null;
                return;
            }
            if (!string.IsNullOrEmpty(printerName))
            {
                _printerName = printerName;
            }
        }

        public void PrintReceipt(byte[] receiptBytes, string copyName)
        {
            try
            {
                if (string.IsNullOrEmpty(_printerName))
                {
                    Log.Warning("No printer found, skipping print for {CopyName}", copyName);
                    return;
                }

                using (var stream = new MemoryStream(receiptBytes))
                using (var image = Image.FromStream(stream))
                {
                    var printDocument = new PrintDocument();
                    printDocument.PrinterSettings.PrinterName = _printerName;
                    printDocument.PrintPage += (sender, e) =>
                    {
                        var rect = e.MarginBounds;
                        e.Graphics.DrawImage(image, rect);
                    };

                    printDocument.Print();
                    Log.Information("Receipt printed: {CopyName}", copyName);
                }
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Failed to print receipt: {CopyName}", copyName);
            }
        }

        public void PrintOrderReceipts(Orders.OrderDto order, Settings.SettingsDto settings)
        {
            if (settings != null)
            {
                ConfigurePrinter(settings.PrinterName, settings.PrinterEnabled);
            }

            var copies = settings?.PrinterCopies > 0 ? settings.PrinterCopies : 1;

            for (int i = 0; i < copies; i++)
            {
                var kitchenReceipt = KitchenReceiptBuilder.Build(order, settings);
                var kitchenBytes = ReceiptRenderer.RenderToBytes(kitchenReceipt, showPrices: false);
                PrintReceipt(kitchenBytes, "Kitchen Copy");

                var customerReceipt = CustomerReceiptBuilder.Build(order, settings);
                var customerBytes = ReceiptRenderer.RenderToBytes(customerReceipt, showPrices: true);
                PrintReceipt(customerBytes, "Customer Copy");

                var cashierReceipt = CashierReceiptBuilder.Build(order, settings);
                var cashierBytes = ReceiptRenderer.RenderToBytes(cashierReceipt, showPrices: true);
                PrintReceipt(cashierBytes, "Cashier Copy");
            }
        }

        private string GetDefaultPrinter()
        {
            try
            {
                return PrinterSettings.InstalledPrinters[0];
            }
            catch
            {
                Log.Warning("No printers installed");
                return null;
            }
        }
    }
}
