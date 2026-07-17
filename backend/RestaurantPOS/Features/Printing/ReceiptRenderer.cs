using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Text;
using System.IO;
using System.Linq;

namespace RestaurantPOS.Features.Printing
{
    public static class ReceiptRenderer
    {
        private const int PaperWidth80mm = 576;
        private const int Padding = 16;
        private const string FontFamily = "Tahoma";

        public static byte[] RenderToBytes(ReceiptModel receipt)
        {
            using (var bitmap = RenderToBitmap(receipt))
            using (var stream = new MemoryStream())
            {
                bitmap.Save(stream, System.Drawing.Imaging.ImageFormat.Png);
                return stream.ToArray();
            }
        }

        public static Bitmap RenderToBitmap(ReceiptModel receipt)
        {
            switch (receipt.Type)
            {
                case ReceiptType.Kitchen:
                    return RenderKitchenReceipt(receipt);
                case ReceiptType.Customer:
                    return RenderCustomerReceipt(receipt);
                case ReceiptType.Cashier:
                    return RenderCashierReceipt(receipt);
                default:
                    return RenderCashierReceipt(receipt);
            }
        }

        private static Bitmap RenderKitchenReceipt(ReceiptModel receipt)
        {
            var lines = new List<RenderLine>();
            var contentWidth = PaperWidth80mm - (Padding * 2);

            // Restaurant Name (centered, bold)
            lines.Add(new RenderLine(receipt.RestaurantName, 14, FontStyle.Bold, Justify.Center));

            // "المطبخ" header (centered, bold, underlined)
            lines.Add(new RenderLine("المطبخ", 16, FontStyle.Bold, Justify.Center));
            lines.Add(new RenderLine(Separator(contentWidth), 8, FontStyle.Regular, Justify.Center));

            // Date & Time
            var arabicDay = GetArabicDayName(receipt.OrderDate);
            lines.Add(new RenderLine($"التاريخ: {receipt.OrderDate:yyyy/MM/dd}  {arabicDay}", 10, FontStyle.Regular, Justify.Right));
            lines.Add(new RenderLine($"الوقت: {receipt.OrderDate:hh:mm tt}", 10, FontStyle.Regular, Justify.Right));

            // Order info
            lines.Add(new RenderLine($"نوع الطلب: {MapOrderType(receipt.OrderType)}", 10, FontStyle.Regular, Justify.Right));

            if (receipt.DailyOrderNumber > 0)
                lines.Add(new RenderLine($"طلب رقم {ToArabicNumerals(receipt.DailyOrderNumber.ToString())}", 10, FontStyle.Bold, Justify.Right));

            if (!string.IsNullOrEmpty(receipt.CustomerName))
                lines.Add(new RenderLine($"العميل: {receipt.CustomerName}", 10, FontStyle.Regular, Justify.Right));

            if (receipt.TableNumber.HasValue)
                lines.Add(new RenderLine($"الطاولة: {receipt.TableNumber}", 10, FontStyle.Regular, Justify.Right));

            lines.Add(new RenderLine(Separator(contentWidth), 8, FontStyle.Regular, Justify.Center));

            // Items (no prices)
            foreach (var item in receipt.Items)
            {
                var qtyName = $"{item.Quantity} x {item.Name}";
                lines.Add(new RenderLine(qtyName, 11, FontStyle.Bold, Justify.Right));

                if (!string.IsNullOrEmpty(item.Notes))
                    lines.Add(new RenderLine($"  ملاحظات: {item.Notes}", 9, FontStyle.Regular, Justify.Right));
            }

            lines.Add(new RenderLine(Separator(contentWidth), 8, FontStyle.Regular, Justify.Center));

            // PrintedAt + Cashier
            lines.Add(new RenderLine($"تاريخ الطباعة: {receipt.PrintedAt:yyyy/MM/dd hh:mm tt}", 9, FontStyle.Regular, Justify.Right));
            if (!string.IsNullOrEmpty(receipt.CashierName))
                lines.Add(new RenderLine($"الكاشير: {receipt.CashierName}", 9, FontStyle.Regular, Justify.Right));

            return RenderLinesToBitmap(lines, contentWidth);
        }

        private static Bitmap RenderCustomerReceipt(ReceiptModel receipt)
        {
            var lines = new List<RenderLine>();
            var contentWidth = PaperWidth80mm - (Padding * 2);

            // Restaurant Name (centered, bold)
            lines.Add(new RenderLine(receipt.RestaurantName, 14, FontStyle.Bold, Justify.Center));
            lines.Add(new RenderLine(Separator(contentWidth), 8, FontStyle.Regular, Justify.Center));

            // Date & Time + Order number
            lines.Add(new RenderLine($"التاريخ: {receipt.OrderDate:yyyy/MM/dd}", 10, FontStyle.Regular, Justify.Right));
            lines.Add(new RenderLine($"الوقت: {receipt.OrderDate:hh:mm tt}", 10, FontStyle.Regular, Justify.Right));

            if (receipt.DailyOrderNumber > 0)
                lines.Add(new RenderLine($"رقم الطلب: {ToArabicNumerals(receipt.DailyOrderNumber.ToString())}", 10, FontStyle.Bold, Justify.Right));

            lines.Add(new RenderLine(Separator(contentWidth), 8, FontStyle.Regular, Justify.Center));

            // Items (no prices, no totals, no payment)
            foreach (var item in receipt.Items)
            {
                var qtyName = $"{item.Quantity} x {item.Name}";
                lines.Add(new RenderLine(qtyName, 11, FontStyle.Regular, Justify.Right));
            }

            lines.Add(new RenderLine(Separator(contentWidth), 8, FontStyle.Regular, Justify.Center));

            return RenderLinesToBitmap(lines, contentWidth);
        }

        private static Bitmap RenderCashierReceipt(ReceiptModel receipt)
        {
            var lines = new List<RenderLine>();
            var contentWidth = PaperWidth80mm - (Padding * 2);

            // Restaurant Name (centered, bold)
            lines.Add(new RenderLine(receipt.RestaurantName, 14, FontStyle.Bold, Justify.Center));
            lines.Add(new RenderLine(Separator(contentWidth), 8, FontStyle.Regular, Justify.Center));

            // Invoice & Daily Order
            if (!string.IsNullOrEmpty(receipt.InvoiceNumber))
                lines.Add(new RenderLine($"رقم الفاتورة: {receipt.InvoiceNumber}", 10, FontStyle.Bold, Justify.Right));

            if (receipt.DailyOrderNumber > 0)
                lines.Add(new RenderLine($"طلب رقم {ToArabicNumerals(receipt.DailyOrderNumber.ToString())}", 10, FontStyle.Bold, Justify.Right));

            // Date & Time
            lines.Add(new RenderLine($"التاريخ: {receipt.OrderDate:yyyy/MM/dd}", 10, FontStyle.Regular, Justify.Right));
            lines.Add(new RenderLine($"الوقت: {receipt.OrderDate:hh:mm tt}", 10, FontStyle.Regular, Justify.Right));

            // Order Type
            lines.Add(new RenderLine($"نوع الطلب: {MapOrderType(receipt.OrderType)}", 10, FontStyle.Regular, Justify.Right));

            // Cashier
            if (!string.IsNullOrEmpty(receipt.CashierName))
                lines.Add(new RenderLine($"الكاشير: {receipt.CashierName}", 10, FontStyle.Regular, Justify.Right));

            // Customer
            if (!string.IsNullOrEmpty(receipt.CustomerName))
                lines.Add(new RenderLine($"العميل: {receipt.CustomerName}", 10, FontStyle.Regular, Justify.Right));

            // Delivery Rider
            if (!string.IsNullOrEmpty(receipt.DeliveryRiderName))
                lines.Add(new RenderLine($"السائق: {receipt.DeliveryRiderName}", 10, FontStyle.Regular, Justify.Right));

            if (receipt.TableNumber.HasValue)
                lines.Add(new RenderLine($"الطاولة: {receipt.TableNumber}", 10, FontStyle.Regular, Justify.Right));

            lines.Add(new RenderLine(Separator(contentWidth), 8, FontStyle.Regular, Justify.Center));

            // Items with prices
            foreach (var item in receipt.Items)
            {
                lines.Add(new RenderLine($"{item.Quantity} x {item.Name}", 11, FontStyle.Bold, Justify.Right));
                lines.Add(new RenderLine($"  {item.UnitPrice:F2} x {item.Quantity} = {item.Total:F2}", 9, FontStyle.Regular, Justify.Right));

                if (!string.IsNullOrEmpty(item.Notes))
                    lines.Add(new RenderLine($"  ملاحظات: {item.Notes}", 9, FontStyle.Regular, Justify.Right));
            }

            lines.Add(new RenderLine(Separator(contentWidth), 8, FontStyle.Regular, Justify.Center));

            // Subtotal
            lines.Add(new RenderLine($"المجموع الفرعي: {receipt.Subtotal:F2}", 10, FontStyle.Regular, Justify.Right));

            // Discount
            if (receipt.Discount > 0)
            {
                var discountLabel = receipt.DiscountType == "Percentage"
                    ? $"الخصم ({receipt.Discount}%): "
                    : $"الخصم: {receipt.Discount:F2}";
                lines.Add(new RenderLine(discountLabel, 10, FontStyle.Regular, Justify.Right));
            }

            // Service Charge
            if (receipt.ServiceCharge > 0)
                lines.Add(new RenderLine($"رسوم الخدمة: {receipt.ServiceCharge:F2}", 10, FontStyle.Regular, Justify.Right));

            // Tax
            if (receipt.Tax > 0)
                lines.Add(new RenderLine($"الضريبة: {receipt.Tax:F2}", 10, FontStyle.Regular, Justify.Right));

            // Grand Total (most prominent - 16pt Bold)
            lines.Add(new RenderLine($"الإجمالي: {receipt.GrandTotal:F2}", 16, FontStyle.Bold, Justify.Right));

            lines.Add(new RenderLine(Separator(contentWidth), 8, FontStyle.Regular, Justify.Center));

            // Payment Method
            lines.Add(new RenderLine($"طريقة الدفع: {MapPaymentMethod(receipt.PaymentMethod)}", 10, FontStyle.Regular, Justify.Right));

            // Footer
            lines.Add(new RenderLine(Separator(contentWidth), 8, FontStyle.Regular, Justify.Center));
            if (!string.IsNullOrEmpty(receipt.Address))
                lines.Add(new RenderLine(receipt.Address, 9, FontStyle.Regular, Justify.Center));

            if (!string.IsNullOrEmpty(receipt.Phone))
                lines.Add(new RenderLine(receipt.Phone, 9, FontStyle.Regular, Justify.Center));
            if (!string.IsNullOrEmpty(receipt.Phone2))
                lines.Add(new RenderLine(receipt.Phone2, 9, FontStyle.Regular, Justify.Center));

            if (!string.IsNullOrEmpty(receipt.FooterText))
                lines.Add(new RenderLine(receipt.FooterText, 10, FontStyle.Bold, Justify.Center));

            return RenderLinesToBitmap(lines, contentWidth);
        }

        private static Bitmap RenderLinesToBitmap(List<RenderLine> lines, int contentWidth)
        {
            var rtlFormat = new StringFormat
            {
                Alignment = StringAlignment.Near,
                FormatFlags = StringFormatFlags.DirectionRightToLeft | StringFormatFlags.LineLimit,
                Trimming = StringTrimming.Word,
            };

            int totalHeight = Padding;
            var measuredLines = new List<(RenderLine line, int height, int wrappedHeight)>();

            using (var measureBmp = new Bitmap(1, 1))
            using (var g = Graphics.FromImage(measureBmp))
            {
                foreach (var line in lines)
                {
                    using (var font = new Font(FontFamily, line.Size, line.Style))
                    {
                        var rect = new RectangleF(0, 0, contentWidth, 10000);
                        var size = g.MeasureString(line.Text, font, contentWidth, rtlFormat);
                        var h = (int)Math.Ceiling(size.Height);
                        measuredLines.Add((line, h, h));
                        totalHeight += h + 2;
                    }
                }
            }

            totalHeight += Padding;

            var bitmap = new Bitmap(PaperWidth80mm, totalHeight);
            using (var graphics = Graphics.FromImage(bitmap))
            {
                graphics.Clear(Color.White);
                graphics.TextRenderingHint = TextRenderingHint.ClearTypeGridFit;
                graphics.SmoothingMode = SmoothingMode.AntiAlias;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;

                int y = Padding;

        foreach (var (line, h, _) in measuredLines)
            {
                using (var font = new Font(FontFamily, line.Size, line.Style))
                {
                    var align = StringAlignment.Near;
                    switch (line.Justify)
                    {
                        case Justify.Center: align = StringAlignment.Center; break;
                        case Justify.Right:  align = StringAlignment.Near; break;
                        case Justify.Left:   align = StringAlignment.Far; break;
                    }

                    var lineFormat = new StringFormat(rtlFormat) { Alignment = align };
                    graphics.DrawString(line.Text, font, Brushes.Black,
                        new RectangleF(Padding, y, contentWidth, h + 4), lineFormat);
                    y += h + 2;
                }
            }
            }

            return bitmap;
        }

        private static string Separator(int width)
        {
            int dashCount = width / 8;
            return new string('-', dashCount);
        }

        private static string MapOrderType(string orderType)
        {
            switch (orderType)
            {
                case "DineIn": return "صالة";
                case "TakeAway": return "تيك أواي";
                case "Delivery": return "توصيل";
                default: return orderType;
            }
        }

        private static string MapPaymentMethod(string method)
        {
            switch (method)
            {
                case "Cash": return "نقدي";
                case "Visa": return "فيزا";
                case "Instapay": return "إنستاباي";
                case "Wallet": return "محفظة";
                default: return method;
            }
        }

        private static string GetArabicDayName(DateTime date)
        {
            switch (date.DayOfWeek)
            {
                case DayOfWeek.Saturday: return "السبت";
                case DayOfWeek.Sunday: return "الأحد";
                case DayOfWeek.Monday: return "الاثنين";
                case DayOfWeek.Tuesday: return "الثلاثاء";
                case DayOfWeek.Wednesday: return "الأربعاء";
                case DayOfWeek.Thursday: return "الخميس";
                case DayOfWeek.Friday: return "الجمعة";
                default: return "";
            }
        }

        private static string ToArabicNumerals(string input)
        {
            var arabicDigits = new[] { '٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩' };
            var result = new char[input.Length];
            for (int i = 0; i < input.Length; i++)
            {
                if (input[i] >= '0' && input[i] <= '9')
                    result[i] = arabicDigits[input[i] - '0'];
                else
                    result[i] = input[i];
            }
            return new string(result);
        }

        private enum Justify { Left, Center, Right }

        private class RenderLine
        {
            public string Text { get; }
            public float Size { get; }
            public FontStyle Style { get; }
            public Justify Justify { get; }

            public RenderLine(string text, float size, FontStyle style, Justify justify)
            {
                Text = text;
                Size = size;
                Style = style;
                Justify = justify;
            }
        }
    }
}
