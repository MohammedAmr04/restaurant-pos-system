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
        private const int Margin = 15;
        private const string FontFamily = "Tahoma";

        // Typography hierarchy
        private const float RestaurantNameSize = 28;
        private const float ReceiptTitleSize = 20;
        private const float InvoiceInfoSize = 16;
        private const float ItemSize = 16;
        private const float TotalsSize = 18;
        private const float GrandTotalSize = 22;
        private const float FooterSize = 14;

        // Spacing
        private const int SectionGapLarge = 20;
        private const int SectionGapMedium = 15;
        private const int LineSpacing = 5;
        private const int SeparatorPadding = 10;

        private static readonly StringFormat RtlFormat = new StringFormat
        {
            Alignment = StringAlignment.Near,
            FormatFlags = StringFormatFlags.DirectionRightToLeft | StringFormatFlags.LineLimit,
            Trimming = StringTrimming.Word,
        };

        private static readonly StringFormat LtrFormat = new StringFormat
        {
            Alignment = StringAlignment.Far,
            LineAlignment = StringAlignment.Near,
        };

        private static readonly StringFormat CenterFormat = new StringFormat
        {
            Alignment = StringAlignment.Center,
            LineAlignment = StringAlignment.Near,
        };

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
            int contentWidth = PaperWidth80mm - (Margin * 2);
            var canvas = new Bitmap(PaperWidth80mm, 4000);

            using (var g = Graphics.FromImage(canvas))
            {
                g.Clear(Color.White);
                g.TextRenderingHint = TextRenderingHint.SingleBitPerPixelGridFit;

                int y = Margin;

                // Restaurant Name
                y = DrawText(g, receipt.RestaurantName, RestaurantNameSize, FontStyle.Bold, Justify.Center, y, contentWidth);
                y += SectionGapLarge;

                // Separator
                y = DrawSeparator(g, y, contentWidth);

                // Receipt Title
                y = DrawText(g, "المطبخ", ReceiptTitleSize, FontStyle.Bold, Justify.Center, y, contentWidth);
                y += SectionGapLarge;

                // Separator
                y = DrawSeparator(g, y, contentWidth);

                // Date & Time
                var arabicDay = GetArabicDayName(receipt.OrderDate);
                y = DrawText(g, $"التاريخ: {receipt.OrderDate:yyyy/MM/dd}  {arabicDay}", InvoiceInfoSize, FontStyle.Regular, Justify.Right, y, contentWidth);
                y = DrawText(g, $"الوقت: {receipt.OrderDate:hh:mm tt}", InvoiceInfoSize, FontStyle.Regular, Justify.Right, y, contentWidth);

                // Order Type
                y = DrawText(g, $"نوع الطلب: {MapOrderType(receipt.OrderType)}", InvoiceInfoSize, FontStyle.Regular, Justify.Right, y, contentWidth);

                // Order Number
                if (receipt.DailyOrderNumber > 0)
                    y = DrawText(g, $"طلب رقم {ToArabicNumerals(receipt.DailyOrderNumber.ToString())}", InvoiceInfoSize, FontStyle.Bold, Justify.Right, y, contentWidth);

                // Customer
                if (!string.IsNullOrEmpty(receipt.CustomerName))
                    y = DrawText(g, $"العميل: {receipt.CustomerName}", InvoiceInfoSize, FontStyle.Regular, Justify.Right, y, contentWidth);

                // Table
                if (receipt.TableNumber.HasValue)
                    y = DrawText(g, $"الطاولة: {receipt.TableNumber}", InvoiceInfoSize, FontStyle.Regular, Justify.Right, y, contentWidth);

                y += SectionGapMedium;

                // Separator
                y = DrawSeparator(g, y, contentWidth);

                // Items
                foreach (var item in receipt.Items)
                {
                    y = DrawText(g, $"{item.Quantity} x {item.Name}", ItemSize, FontStyle.Bold, Justify.Right, y, contentWidth);

                    if (!string.IsNullOrEmpty(item.Notes))
                        y = DrawText(g, $"  ملاحظات: {item.Notes}", ItemSize - 2, FontStyle.Regular, Justify.Right, y, contentWidth);
                }

                y += SectionGapMedium;

                // Separator
                y = DrawSeparator(g, y, contentWidth);

                // Printed At
                y = DrawText(g, $"تاريخ الطباعة: {receipt.PrintedAt:yyyy/MM/dd hh:mm tt}", FooterSize, FontStyle.Regular, Justify.Right, y, contentWidth);

                // Cashier
                if (!string.IsNullOrEmpty(receipt.CashierName))
                    y = DrawText(g, $"الكاشير: {receipt.CashierName}", FooterSize, FontStyle.Regular, Justify.Right, y, contentWidth);

                y += Margin;

                return CropBitmap(canvas, y);
            }
        }

        private static Bitmap RenderCustomerReceipt(ReceiptModel receipt)
        {
            int contentWidth = PaperWidth80mm - (Margin * 2);
            var canvas = new Bitmap(PaperWidth80mm, 4000);

            using (var g = Graphics.FromImage(canvas))
            {
                g.Clear(Color.White);
                g.TextRenderingHint = TextRenderingHint.SingleBitPerPixelGridFit;

                int y = Margin;

                // Restaurant Name
                y = DrawText(g, receipt.RestaurantName, RestaurantNameSize, FontStyle.Bold, Justify.Center, y, contentWidth);
                y += SectionGapLarge;

                // Separator
                y = DrawSeparator(g, y, contentWidth);

                // Date & Time
                y = DrawText(g, $"التاريخ: {receipt.OrderDate:yyyy/MM/dd}", InvoiceInfoSize, FontStyle.Regular, Justify.Right, y, contentWidth);
                y = DrawText(g, $"الوقت: {receipt.OrderDate:hh:mm tt}", InvoiceInfoSize, FontStyle.Regular, Justify.Right, y, contentWidth);

                // Order Number
                if (receipt.DailyOrderNumber > 0)
                    y = DrawText(g, $"رقم الطلب: {ToArabicNumerals(receipt.DailyOrderNumber.ToString())}", InvoiceInfoSize, FontStyle.Bold, Justify.Right, y, contentWidth);

                y += SectionGapMedium;

                // Separator
                y = DrawSeparator(g, y, contentWidth);

                // Items
                foreach (var item in receipt.Items)
                {
                    y = DrawText(g, $"{item.Quantity} x {item.Name}", ItemSize, FontStyle.Regular, Justify.Right, y, contentWidth);
                }

                y += SectionGapMedium;

                // Separator
                y = DrawSeparator(g, y, contentWidth);

                y += Margin;

                return CropBitmap(canvas, y);
            }
        }

        private static Bitmap RenderCashierReceipt(ReceiptModel receipt)
        {
            int contentWidth = PaperWidth80mm - (Margin * 2);
            var canvas = new Bitmap(PaperWidth80mm, 4000);

            using (var g = Graphics.FromImage(canvas))
            {
                g.Clear(Color.White);
                g.TextRenderingHint = TextRenderingHint.SingleBitPerPixelGridFit;

                int y = Margin;

                // ── Restaurant Name ──
                y = DrawText(g, receipt.RestaurantName, RestaurantNameSize, FontStyle.Bold, Justify.Center, y, contentWidth);
                y += SectionGapLarge;

                // Separator
                y = DrawSeparator(g, y, contentWidth);

                // ── Receipt Title ──
                y = DrawText(g, "فاتورة الكاشير", ReceiptTitleSize, FontStyle.Bold, Justify.Center, y, contentWidth);
                y += SectionGapLarge;

                // Separator
                y = DrawSeparator(g, y, contentWidth);

                // ── Invoice Info ──
                if (!string.IsNullOrEmpty(receipt.InvoiceNumber))
                    y = DrawText(g, $"رقم الفاتورة: {receipt.InvoiceNumber}", InvoiceInfoSize, FontStyle.Bold, Justify.Right, y, contentWidth);

                if (receipt.DailyOrderNumber > 0)
                    y = DrawText(g, $"طلب رقم {ToArabicNumerals(receipt.DailyOrderNumber.ToString())}", InvoiceInfoSize, FontStyle.Bold, Justify.Right, y, contentWidth);

                y = DrawText(g, $"التاريخ: {receipt.OrderDate:yyyy/MM/dd}", InvoiceInfoSize, FontStyle.Regular, Justify.Right, y, contentWidth);
                y = DrawText(g, $"الوقت: {receipt.OrderDate:hh:mm tt}", InvoiceInfoSize, FontStyle.Regular, Justify.Right, y, contentWidth);
                y = DrawText(g, $"نوع الطلب: {MapOrderType(receipt.OrderType)}", InvoiceInfoSize, FontStyle.Regular, Justify.Right, y, contentWidth);

                if (!string.IsNullOrEmpty(receipt.CashierName))
                    y = DrawText(g, $"الكاشير: {receipt.CashierName}", InvoiceInfoSize, FontStyle.Regular, Justify.Right, y, contentWidth);

                if (!string.IsNullOrEmpty(receipt.CustomerName))
                    y = DrawText(g, $"العميل: {receipt.CustomerName}", InvoiceInfoSize, FontStyle.Regular, Justify.Right, y, contentWidth);

                if (!string.IsNullOrEmpty(receipt.CustomerPhone))
                    y = DrawText(g, $"هاتف العميل: {receipt.CustomerPhone}", InvoiceInfoSize - 2, FontStyle.Regular, Justify.Right, y, contentWidth);

                if (!string.IsNullOrEmpty(receipt.CustomerAddress))
                    y = DrawText(g, $"عنوان العميل: {receipt.CustomerAddress}", InvoiceInfoSize - 2, FontStyle.Regular, Justify.Right, y, contentWidth);

                if (!string.IsNullOrEmpty(receipt.DeliveryRiderName))
                    y = DrawText(g, $"السائق: {receipt.DeliveryRiderName}", InvoiceInfoSize, FontStyle.Regular, Justify.Right, y, contentWidth);

                if (receipt.TableNumber.HasValue)
                    y = DrawText(g, $"الطاولة: {receipt.TableNumber}", InvoiceInfoSize, FontStyle.Regular, Justify.Right, y, contentWidth);

                y += SectionGapMedium;

                // Separator
                y = DrawSeparator(g, y, contentWidth);

                // ── Items ──
                foreach (var item in receipt.Items)
                {
                    string itemText = $"{item.Quantity} x {item.Name}";
                    string priceText = $"{item.Total:F2}";
                    y = DrawDottedLine(g, itemText, priceText, ItemSize, y, contentWidth);

                    if (!string.IsNullOrEmpty(item.Notes))
                        y = DrawText(g, $"  ملاحظات: {item.Notes}", ItemSize - 2, FontStyle.Regular, Justify.Right, y, contentWidth);
                }

                y += SectionGapMedium;

                // Separator
                y = DrawSeparator(g, y, contentWidth);

                // ── Totals ──
                y = DrawText(g, $"المجموع الفرعي: {receipt.Subtotal:F2}", TotalsSize, FontStyle.Bold, Justify.Right, y, contentWidth);

                if (receipt.Discount > 0)
                {
                    var discountLabel = receipt.DiscountType == "Percentage"
                        ? $"الخصم ({receipt.Discount}%): "
                        : $"الخصم: {receipt.Discount:F2}";
                    y = DrawText(g, discountLabel, TotalsSize, FontStyle.Bold, Justify.Right, y, contentWidth);
                }

                if (receipt.ServiceCharge > 0)
                    y = DrawText(g, $"رسوم الخدمة: {receipt.ServiceCharge:F2}", TotalsSize, FontStyle.Bold, Justify.Right, y, contentWidth);

                if (receipt.Tax > 0)
                    y = DrawItemLine(g, "الضريبة:", $"{receipt.Tax:F2}", TotalsSize, y, contentWidth);

                y += SectionGapMedium;

                // Separator
                y = DrawSeparator(g, y, contentWidth);

                // ── Grand Total ──
                y = DrawText(g, $"الإجمالي: {receipt.GrandTotal:F2}", GrandTotalSize, FontStyle.Bold, Justify.Right, y, contentWidth);

                // Separator
                y = DrawSeparator(g, y, contentWidth);

                // ── Payment Method ──
                y = DrawText(g, $"طريقة الدفع: {MapPaymentMethod(receipt.PaymentMethod)}", InvoiceInfoSize, FontStyle.Regular, Justify.Right, y, contentWidth);

                y += SectionGapLarge;

                // Separator
                y = DrawSeparator(g, y, contentWidth);

                // ── Footer ──
                if (!string.IsNullOrEmpty(receipt.Address))
                    y = DrawText(g, receipt.Address, FooterSize, FontStyle.Regular, Justify.Center, y, contentWidth);

                if (!string.IsNullOrEmpty(receipt.Phone))
                    y = DrawText(g, receipt.Phone, FooterSize, FontStyle.Regular, Justify.Center, y, contentWidth);

                if (!string.IsNullOrEmpty(receipt.Phone2))
                    y = DrawText(g, receipt.Phone2, FooterSize, FontStyle.Regular, Justify.Center, y, contentWidth);

                if (!string.IsNullOrEmpty(receipt.FooterText))
                    y = DrawText(g, receipt.FooterText, FooterSize, FontStyle.Bold, Justify.Center, y, contentWidth);

                y = DrawText(g, "Software by brazilyy", FooterSize - 2, FontStyle.Regular, Justify.Center, y, contentWidth);
                y = DrawText(g, "01101352017", FooterSize - 4, FontStyle.Regular, Justify.Center, y, contentWidth);

                y += Margin;

                return CropBitmap(canvas, y);
            }
        }

        // ── Drawing helpers ──

        private static int DrawText(Graphics g, string text, float fontSize, FontStyle style, Justify justify, int y, int contentWidth)
        {
            using (var font = new Font(FontFamily, fontSize, style))
            {
                var align = StringAlignment.Near;
                switch (justify)
                {
                    case Justify.Center: align = StringAlignment.Center; break;
                    case Justify.Right: align = StringAlignment.Near; break;
                    case Justify.Left: align = StringAlignment.Far; break;
                }

                var format = new StringFormat(RtlFormat) { Alignment = align };
                var size = g.MeasureString(text, font, contentWidth, RtlFormat);
                int h = (int)Math.Ceiling(size.Height);

                g.DrawString(text, font, Brushes.Black,
                    new RectangleF(Margin, y, contentWidth, h + 4), format);

                return y + h + LineSpacing;
            }
        }

        private static int DrawItemLine(Graphics g, string rightRtlText, string leftLtrText, float fontSize, int y, int contentWidth)
        {
            using (var font = new Font(FontFamily, fontSize, FontStyle.Regular))
            {
                var rightSize = g.MeasureString(rightRtlText, font, contentWidth, RtlFormat);
                var leftSize = g.MeasureString(leftLtrText, font, contentWidth, LtrFormat);

                int rightWidth = (int)Math.Ceiling(rightSize.Width);
                int leftWidth = (int)Math.Ceiling(leftSize.Width);

                if (rightWidth + leftWidth + 10 <= contentWidth)
                {
                    // Draw right text (RTL) from right edge
                    g.DrawString(rightRtlText, font, Brushes.Black,
                        new RectangleF(Margin, y, contentWidth, rightSize.Height + 4), RtlFormat);

                    // Draw left text (LTR) from left edge
                    g.DrawString(leftLtrText, font, Brushes.Black,
                        new RectangleF(Margin, y, contentWidth, leftSize.Height + 4), LtrFormat);

                    return y + (int)Math.Max(rightSize.Height, leftSize.Height) + LineSpacing;
                }
                else
                {
                    // Fallback: stack vertically
                    int y1 = DrawText(g, rightRtlText, fontSize, FontStyle.Regular, Justify.Right, y, contentWidth);
                    return DrawText(g, leftLtrText, fontSize, FontStyle.Regular, Justify.Left, y1, contentWidth);
                }
            }
        }

        private static int DrawSeparator(Graphics g, int y, int contentWidth)
        {
            y += SeparatorPadding;
            g.DrawLine(Pens.Black, Margin, y, PaperWidth80mm - Margin, y);
            return y + SeparatorPadding;
        }

        private static int DrawDottedLine(Graphics g, string leftText, string rightText, float fontSize, int y, int contentWidth)
        {
            using (var font = new Font(FontFamily, fontSize, FontStyle.Regular))
            {
                var leftSize = g.MeasureString(leftText, font, contentWidth, RtlFormat);
                var rightSize = g.MeasureString(rightText, font, contentWidth, RtlFormat);
                var dotSize = g.MeasureString("...", font, contentWidth, RtlFormat);

                float usedWidth = leftSize.Width + rightSize.Width;
                float gap = contentWidth - usedWidth;
                int dotPairs = Math.Max(1, (int)(gap / dotSize.Width));

                string line = leftText + new string('.', dotPairs * 2) + rightText;
                y = DrawText(g, line, fontSize, FontStyle.Regular, Justify.Right, y, contentWidth);
                return y;
            }
        }

        private static Bitmap CropBitmap(Bitmap source, int usedHeight)
        {
            var cropped = new Bitmap(PaperWidth80mm, usedHeight);
            using (var g = Graphics.FromImage(cropped))
            {
                g.DrawImage(source, new Rectangle(0, 0, PaperWidth80mm, usedHeight),
                                  new Rectangle(0, 0, PaperWidth80mm, usedHeight), GraphicsUnit.Pixel);
            }
            source.Dispose();
            return cropped;
        }

        // ── Text helpers ──

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
    }
}
