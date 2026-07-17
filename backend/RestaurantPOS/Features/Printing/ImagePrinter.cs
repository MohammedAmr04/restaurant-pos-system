using System;
using System.Collections.Generic;
using System.Drawing;

namespace RestaurantPOS.Features.Printing
{
    public static class ImagePrinter
    {
        public static byte[] GetImageBytes(Bitmap bitmap, int idealWidth = 576)
        {
            if (bitmap == null) return new byte[0];

            int width = idealWidth;
            int height = (bitmap.Height * width) / bitmap.Width;

            using (Bitmap resized = new Bitmap(bitmap, new Size(width, height)))
            {
                List<byte> byteList = new List<byte>();
                int byteWidth = width / 8;

                byteList.AddRange(new byte[] { 0x1D, 0x76, 0x30, 0x00 });
                byteList.Add((byte)(byteWidth % 256));
                byteList.Add((byte)(byteWidth / 256));
                byteList.Add((byte)(height % 256));
                byteList.Add((byte)(height / 256));

                for (int y = 0; y < height; y++)
                {
                    for (int x = 0; x < byteWidth; x++)
                    {
                        byte slice = 0;
                        for (int b = 0; b < 8; b++)
                        {
                            int pixelX = (x * 8) + b;
                            Color c = resized.GetPixel(pixelX, y);

                            int luminance = (int)(c.R * 0.3 + c.G * 0.59 + c.B * 0.11);

                            if (luminance < 128 && c.A > 128)
                            {
                                slice |= (byte)(0x80 >> b);
                            }
                        }
                        byteList.Add(slice);
                    }
                }
                return byteList.ToArray();
            }
        }
    }
}
