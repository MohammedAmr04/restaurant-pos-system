using System;
using System.Linq;

namespace RestaurantPOS.Features.Printing
{
    public static class KitchenReceiptBuilder
    {
        public static ReceiptModel Build(Orders.OrderDto order, Settings.SettingsDto settings)
        {
            return new ReceiptModel
            {
                Type = ReceiptType.Kitchen,
                RestaurantName = settings.RestaurantName ?? "مطعم ومشويات بيت المعز",
                InvoiceNumber = order.InvoiceNumber,
                DailyOrderNumber = ExtractDailyOrderNumber(order.InvoiceNumber),
                OrderDate = order.CompletedAt ?? order.CreatedAt,
                PrintedAt = DateTime.Now,
                CashierName = order.UserName,
                OrderType = order.OrderType,
                TableNumber = order.TableNumber,
                CustomerName = order.CustomerName,
                Items = order.Items.Select(i => new ReceiptItemModel
                {
                    Quantity = i.Quantity,
                    Name = i.MenuItemName,
                    Notes = i.Notes,
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
