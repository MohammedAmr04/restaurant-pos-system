using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Text;
using System.IO;

namespace RestaurantPOS.Features.Printing
{
    public static class ReceiptRenderer
    {
        private const int ReceiptWidth = 400;
        private const int LineHeight = 25;
        private const int Padding = 20;

        public static byte[] RenderToBytes(ReceiptModel receipt, bool showPrices = true)
        {
            using (var bitmap = RenderToBitmap(receipt, showPrices))
            using (var stream = new MemoryStream())
            {
                bitmap.Save(stream, System.Drawing.Imaging.ImageFormat.Png);
                return stream.ToArray();
            }
        }

        public static Bitmap RenderToBitmap(ReceiptModel receipt, bool showPrices = true)
        {
            var items = showPrices ? receipt.Items : receipt.Items;
            var totalLines = CalculateTotalLines(receipt, showPrices);
            var height = (totalLines * LineHeight) + (Padding * 2) + 100;

            var bitmap = new Bitmap(ReceiptWidth, height);
            using (var graphics = Graphics.FromImage(bitmap))
            {
                graphics.Clear(Color.White);
                graphics.TextRenderingHint = TextRenderingHint.ClearTypeGridFit;
                graphics.SmoothingMode = SmoothingMode.AntiAlias;

                var y = Padding;
                y = RenderHeader(graphics, receipt, y);
                y = RenderItems(graphics, receipt, y, showPrices);
                y = RenderTotals(graphics, receipt, y, showPrices);
                y = RenderFooter(graphics, receipt, y);
            }

            return bitmap;
        }

        private static int RenderHeader(Graphics graphics, ReceiptModel receipt, int startY)
        {
            var font = new Font("Arial", 14, FontStyle.Bold);
            var normalFont = new Font("Arial", 12);

            var x = ReceiptWidth / 2;
            var y = startY;

            // Restaurant Name
            var nameSize = graphics.MeasureString(receipt.RestaurantName, font);
            graphics.DrawString(receipt.RestaurantName, font, Brushes.Black, (x - nameSize.Width / 2), y);
            y += LineHeight + 5;

            // Phone
            if (!string.IsNullOrEmpty(receipt.Phone))
            {
                var phoneSize = graphics.MeasureString(receipt.Phone, normalFont);
                graphics.DrawString(receipt.Phone, normalFont, Brushes.Black, (x - phoneSize.Width / 2), y);
                y += LineHeight;
            }

            // Address
            if (!string.IsNullOrEmpty(receipt.Address))
            {
                var addrSize = graphics.MeasureString(receipt.Address, normalFont);
                graphics.DrawString(receipt.Address, normalFont, Brushes.Black, (x - addrSize.Width / 2), y);
                y += LineHeight;
            }

            y += 10;

            // Invoice Number
            graphics.DrawString($"رقم الفاتورة: {receipt.InvoiceNumber}", normalFont, Brushes.Black, Padding, y);
            y += LineHeight;

            // Date & Time
            graphics.DrawString($"التاريخ: {receipt.OrderDate:yyyy-MM-dd}", normalFont, Brushes.Black, Padding, y);
            y += LineHeight;
            graphics.DrawString($"الوقت: {receipt.OrderDate:HH:mm}", normalFont, Brushes.Black, Padding, y);
            y += LineHeight;

            // Cashier
            graphics.DrawString($"الكاشير: {receipt.CashierName}", normalFont, Brushes.Black, Padding, y);
            y += LineHeight;

            // Order Type
            string orderTypeArabic;
            switch (receipt.OrderType)
            {
                case "DineIn": orderTypeArabic = "صالة"; break;
                case "TakeAway": orderTypeArabic = "تيك أواي"; break;
                case "Delivery": orderTypeArabic = "توصيل"; break;
                default: orderTypeArabic = receipt.OrderType; break;
            }
            graphics.DrawString($"نوع الطلب: {orderTypeArabic}", normalFont, Brushes.Black, Padding, y);
            y += LineHeight;

            // Table Number
            if (receipt.TableNumber.HasValue)
            {
                graphics.DrawString($"رقم الطاولة: {receipt.TableNumber}", normalFont, Brushes.Black, Padding, y);
                y += LineHeight;
            }

            // Customer Name
            if (!string.IsNullOrEmpty(receipt.CustomerName))
            {
                graphics.DrawString($"العميل: {receipt.CustomerName}", normalFont, Brushes.Black, Padding, y);
                y += LineHeight;
            }

            // Delivery Rider
            if (!string.IsNullOrEmpty(receipt.DeliveryRiderName))
            {
                graphics.DrawString($"السائق: {receipt.DeliveryRiderName}", normalFont, Brushes.Black, Padding, y);
                y += LineHeight;
            }

            // Separator
            y += 5;
            graphics.DrawLine(Pens.Black, Padding, y, ReceiptWidth - Padding, y);
            y += 10;

            return y;
        }

        private static int RenderItems(Graphics graphics, ReceiptModel receipt, int startY, bool showPrices)
        {
            var font = new Font("Arial", 12);
            var boldFont = new Font("Arial", 12, FontStyle.Bold);
            var y = startY;

            foreach (var item in receipt.Items)
            {
                // Quantity x Name
                var itemText = $"{item.Quantity} x {item.Name}";
                graphics.DrawString(itemText, font, Brushes.Black, Padding, y);
                y += LineHeight;

                if (showPrices)
                {
                    // Unit Price
                    graphics.DrawString($"  السعر: {item.UnitPrice:F2}", font, Brushes.Black, Padding, y);
                    y += LineHeight;

                    // Total
                    graphics.DrawString($"  الإجمالي: {item.Total:F2}", font, Brushes.Black, Padding, y);
                    y += LineHeight;
                }

                // Notes
                if (!string.IsNullOrEmpty(item.Notes))
                {
                    graphics.DrawString($"  ملاحظات: {item.Notes}", font, Brushes.Black, Padding, y);
                    y += LineHeight;
                }

                y += 5;
            }

            // Separator
            graphics.DrawLine(Pens.Black, Padding, y, ReceiptWidth - Padding, y);
            y += 10;

            return y;
        }

        private static int RenderTotals(Graphics graphics, ReceiptModel receipt, int startY, bool showPrices)
        {
            if (!showPrices) return startY;

            var font = new Font("Arial", 12);
            var boldFont = new Font("Arial", 12, FontStyle.Bold);
            var y = startY;

            // Subtotal
            DrawRightAligned(graphics, $"المجموع الفرعي: {receipt.Subtotal:F2}", font, y);
            y += LineHeight;

            // Discount
            if (receipt.Discount > 0)
            {
                var discountText = receipt.DiscountType == "Percentage"
                    ? $"الخصم ({receipt.Discount}%): "
                    : $"الخصم: {receipt.Discount:F2}";
                DrawRightAligned(graphics, discountText, font, y);
                y += LineHeight;
            }

            // Service Charge
            if (receipt.ServiceCharge > 0)
            {
                DrawRightAligned(graphics, $"رسوم الخدمة: {receipt.ServiceCharge:F2}", font, y);
                y += LineHeight;
            }

            // Tax
            if (receipt.Tax > 0)
            {
                DrawRightAligned(graphics, $"الضريبة: {receipt.Tax:F2}", font, y);
                y += LineHeight;
            }

            // Grand Total
            DrawRightAligned(graphics, $"الإجمالي: {receipt.GrandTotal:F2}", boldFont, y);
            y += LineHeight;

            // Paid Amount
            DrawRightAligned(graphics, $"المدفوع: {receipt.PaidAmount:F2}", font, y);
            y += LineHeight;

            // Payment Method
            string paymentMethodArabic;
            switch (receipt.PaymentMethod)
            {
                case "Cash": paymentMethodArabic = "نقدي"; break;
                case "Visa": paymentMethodArabic = "فيزا"; break;
                case "Instapay": paymentMethodArabic = "إنستاباي"; break;
                case "Wallet": paymentMethodArabic = "محفظة"; break;
                default: paymentMethodArabic = receipt.PaymentMethod; break;
            }
            DrawRightAligned(graphics, $"طريقة الدفع: {paymentMethodArabic}", font, y);
            y += LineHeight;

            // Separator
            y += 5;
            graphics.DrawLine(Pens.Black, Padding, y, ReceiptWidth - Padding, y);
            y += 10;

            return y;
        }

        private static int RenderFooter(Graphics graphics, ReceiptModel receipt, int startY)
        {
            var font = new Font("Arial", 11);
            var y = startY;

            if (!string.IsNullOrEmpty(receipt.FooterText))
            {
                var footerSize = graphics.MeasureString(receipt.FooterText, font);
                graphics.DrawString(receipt.FooterText, font, Brushes.Black, (ReceiptWidth - footerSize.Width) / 2, y);
                y += LineHeight;
            }

            var thankYou = "شكرا لزيارتكم";
            var thankYouSize = graphics.MeasureString(thankYou, font);
            graphics.DrawString(thankYou, font, Brushes.Black, (ReceiptWidth - thankYouSize.Width) / 2, y);
            y += LineHeight;

            return y;
        }

        private static void DrawRightAligned(Graphics graphics, string text, Font font, int y)
        {
            var size = graphics.MeasureString(text, font);
            graphics.DrawString(text, font, Brushes.Black, ReceiptWidth - Padding - size.Width, y);
        }

        private static int CalculateTotalLines(ReceiptModel receipt, bool showPrices)
        {
            var lines = 15; // Header lines
            lines += receipt.Items.Count * (showPrices ? 4 : 2); // Item lines
            lines += showPrices ? 10 : 2; // Totals lines
            lines += 3; // Footer lines
            return lines;
        }
    }
}
