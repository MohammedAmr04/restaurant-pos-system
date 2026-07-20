using System;
using System.Linq;

namespace RestaurantPOS.Features.Printing
{
    public static class CustomerReceiptBuilder
    {
        public static ReceiptModel Build(Orders.OrderDto order, Settings.SettingsDto settings)
        {
            return new ReceiptModel
            {
                Type = ReceiptType.Customer,
                RestaurantName = settings.RestaurantName ?? "مطعم ومشويات بيت المعز",
                InvoiceNumber = order.InvoiceNumber,
                DailyOrderNumber = ExtractDailyOrderNumber(order.InvoiceNumber),
                OrderDate = order.CompletedAt ?? order.CreatedAt,
                OrderType = order.OrderType,
                CustomerName = order.CustomerName,
                CustomerAddress = order.CustomerAddress,
                CustomerPhone = order.CustomerPhone,
                Items = order.Items.Select(i => new ReceiptItemModel
                {
                    Quantity = i.Quantity,
                    Name = i.MenuItemName,
                }).ToList(),
            };
        }

        private static int ExtractDailyOrderNumber(string invoiceNumber)
        {
            if (string.IsNullOrEmpty(invoiceNumber)) return 0;
            var parts = invoiceNumber.Split('-');
            if (parts.Length == 2 && int.TryParse(parts[1], out int num))
                return num;
            return 0;
        }
    }
}
