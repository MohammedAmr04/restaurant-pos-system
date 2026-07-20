using System;
using System.Linq;

namespace RestaurantPOS.Features.Printing
{
    public static class CashierReceiptBuilder
    {
        public static ReceiptModel Build(Orders.OrderDto order, Settings.SettingsDto settings)
        {
            return new ReceiptModel
            {
                Type = ReceiptType.Cashier,
                RestaurantName = settings.RestaurantName ?? "مطعم ومشويات بيت المعز",
                Phone = settings.Phone,
                Phone2 = settings.Phone2,
                Address = settings.Address,
                InvoiceNumber = order.InvoiceNumber,
                DailyOrderNumber = ExtractDailyOrderNumber(order.InvoiceNumber),
                OrderDate = order.CompletedAt ?? order.CreatedAt,
                CashierName = order.UserName,
                OrderType = order.OrderType,
                TableNumber = order.TableNumber,
                CustomerName = order.CustomerName,
                CustomerAddress = order.CustomerAddress,
                CustomerPhone = order.CustomerPhone,
                DeliveryRiderName = order.DeliveryRiderName,
                Items = order.Items.Select(i => new ReceiptItemModel
                {
                    Quantity = i.Quantity,
                    Name = i.MenuItemName,
                    UnitPrice = i.UnitPrice,
                    Total = i.Total,
                    Notes = i.Notes,
                }).ToList(),
                Subtotal = order.Subtotal,
                Discount = order.DiscountValue,
                DiscountType = order.DiscountType,
                ServiceCharge = order.ServiceCharge,
                Tax = order.Tax,
                GrandTotal = order.GrandTotal,
                PaidAmount = order.PaidAmount,
                PaymentMethod = order.PaymentMethod,
                FooterText = "شكراً لزيارتكم",
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
