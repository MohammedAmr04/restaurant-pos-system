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
                    Notes = i.Notes,
                    ShowPrice = false
                }).ToList(),
                FooterText = null
            };
        }
    }
}
