using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

namespace RestaurantPOS.Features.Printing
{
    public static class EscPosEncoder
    {
        private static readonly byte[] InitializePrinter = { 0x1B, 0x40 };
        private static readonly byte[] CutPaper = { 0x1D, 0x56, 0x00 };
        private static readonly byte[] FeedLines = { 0x1B, 0x64, 0x03 };

        public static byte[] EncodeBitmap(Bitmap bitmap)
        {
            using (var ms = new MemoryStream())
            {
                ms.Write(InitializePrinter, 0, InitializePrinter.Length);

                var imageBytes = ConvertBitmapToBytes(bitmap);
                ms.Write(imageBytes, 0, imageBytes.Length);

                ms.Write(FeedLines, 0, FeedLines.Length);
                ms.Write(CutPaper, 0, CutPaper.Length);

                return ms.ToArray();
            }
        }

        public static byte[] EncodeImageBytes(byte[] imageBytes)
        {
            using (var ms = new MemoryStream())
            {
                ms.Write(InitializePrinter, 0, InitializePrinter.Length);

                using (var imageStream = new MemoryStream(imageBytes))
                using (var image = Image.FromStream(imageStream))
                using (var bitmap = new Bitmap(image))
                {
                    var encodedImage = ConvertBitmapToBytes(bitmap);
                    ms.Write(encodedImage, 0, encodedImage.Length);
                }

                ms.Write(FeedLines, 0, FeedLines.Length);
                ms.Write(CutPaper, 0, CutPaper.Length);

                return ms.ToArray();
            }
        }

        private static byte[] ConvertBitmapToBytes(Bitmap bitmap)
        {
            using (var ms = new MemoryStream())
            {
                bitmap.Save(ms, ImageFormat.Png);
                return ms.ToArray();
            }
        }

        public static byte[] EncodeText(string text)
        {
            var encoding = System.Text.Encoding.UTF8;
            return encoding.GetBytes(text);
        }

        public static byte[] FeedAndCut(int lines = 3)
        {
            var feed = new byte[] { 0x1B, 0x64, (byte)lines };
            return feed;
        }
    }
}
