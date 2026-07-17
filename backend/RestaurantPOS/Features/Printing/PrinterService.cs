using System;
using System.Drawing;
using System.Drawing.Printing;
using System.IO;
using Serilog;

namespace RestaurantPOS.Features.Printing
{
    public class PrinterService : IPrinterService
    {
        private const string DefaultPrinterName = "cash";
        private string _printerName;

        public PrinterService()
        {
            _printerName = DefaultPrinterName;
            Log.Information("Printer initialized with default: {PrinterName}", _printerName);
        }

        public void ConfigurePrinter(string printerName, bool enabled)
        {
            if (!enabled)
            {
                _printerName = null;
                Log.Warning("Printer disabled");
                return;
            }
            if (!string.IsNullOrEmpty(printerName))
            {
                _printerName = printerName;
            }
            else
            {
                _printerName = DefaultPrinterName;
            }
            Log.Information("Printer configured: {PrinterName}", _printerName);
        }

        public void PrintReceipt(byte[] receiptBytes, string copyName)
        {
            try
            {
                if (string.IsNullOrEmpty(_printerName))
                {
                    Log.Warning("No printer configured, skipping print for {CopyName}", copyName);
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

                    Log.Information("Sending {CopyName} to printer: {PrinterName}", copyName, _printerName);
                    printDocument.Print();
                    Log.Information("Printed: {CopyName}", copyName);
                }
            }
            catch (InvalidPrinterException ex)
            {
                Log.Error(ex, "Printer '{PrinterName}' not found. Available printers may differ. Copy: {CopyName}", _printerName, copyName);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Failed to print {CopyName} on printer '{PrinterName}': {Error}", copyName, _printerName, ex.Message);
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
                var kitchenBytes = ReceiptRenderer.RenderToBytes(kitchenReceipt);
                PrintReceipt(kitchenBytes, "Kitchen Copy");

                switch (order.OrderType)
                {
                    case "TakeAway":
                        var customerReceipt = CustomerReceiptBuilder.Build(order, settings);
                        var customerBytes = ReceiptRenderer.RenderToBytes(customerReceipt);
                        PrintReceipt(customerBytes, "Customer Copy");
                        break;
                }

                var cashierReceipt = CashierReceiptBuilder.Build(order, settings);
                var cashierBytes = ReceiptRenderer.RenderToBytes(cashierReceipt);
                PrintReceipt(cashierBytes, "Cashier Copy");
            }
        }

        public void PrintCashierCopy(Orders.OrderDto order, Settings.SettingsDto settings)
        {
            if (settings != null)
            {
                ConfigurePrinter(settings.PrinterName, settings.PrinterEnabled);
            }

            var cashierReceipt = CashierReceiptBuilder.Build(order, settings);
            var cashierBytes = ReceiptRenderer.RenderToBytes(cashierReceipt);
            PrintReceipt(cashierBytes, "Cashier Copy (Reprint)");
        }

    }
}
