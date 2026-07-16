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
                RestaurantName = settings.RestaurantName,
                Phone = settings.Phone,
                Address = settings.Address,
                InvoiceNumber = order.InvoiceNumber,
                OrderDate = order.CompletedAt ?? order.CreatedAt,
                CashierName = order.UserName,
                OrderType = order.OrderType,
                TableNumber = order.TableNumber,
                CustomerName = order.CustomerName,
                DeliveryRiderName = order.DeliveryRiderName,
                Items = order.Items.Select(i => new ReceiptItemModel
                {
                    Quantity = i.Quantity,
                    Name = i.MenuItemName,
                    UnitPrice = i.UnitPrice,
                    Total = i.Total,
                    Notes = i.Notes,
                    ShowPrice = true
                }).ToList(),
                Subtotal = order.Subtotal,
                Discount = order.DiscountValue,
                DiscountType = order.DiscountType,
                ServiceCharge = order.ServiceCharge,
                Tax = order.Tax,
                GrandTotal = order.GrandTotal,
                PaidAmount = order.PaidAmount,
                PaymentMethod = order.PaymentMethod,
                FooterText = settings.ReceiptFooter
            };
        }
    }
}
