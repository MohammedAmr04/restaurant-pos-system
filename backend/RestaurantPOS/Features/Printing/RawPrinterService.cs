using System;
using System.Runtime.InteropServices;
using Serilog;

namespace RestaurantPOS.Features.Printing
{
    public static class RawPrinterService
    {
        [DllImport("winspool.drv", CharSet = CharSet.Ansi, SetLastError = true)]
        private static extern bool OpenPrinter(string pPrinterName, out IntPtr phPrinter, IntPtr pDefault);

        [DllImport("winspool.drv", SetLastError = true)]
        private static extern bool ClosePrinter(IntPtr hPrinter);

        [DllImport("winspool.drv", CharSet = CharSet.Ansi, SetLastError = true)]
        private static extern bool StartDocPrinter(IntPtr hPrinter, int level, ref DOCINFO pDocInfo);

        [DllImport("winspool.drv", SetLastError = true)]
        private static extern bool EndDocPrinter(IntPtr hPrinter);

        [DllImport("winspool.drv", SetLastError = true)]
        private static extern bool StartPagePrinter(IntPtr hPrinter);

        [DllImport("winspool.drv", SetLastError = true)]
        private static extern bool EndPagePrinter(IntPtr hPrinter);

        [DllImport("winspool.drv", SetLastError = true)]
        private static extern bool WritePrinter(IntPtr hPrinter, IntPtr pBytes, int dwCount, out int dwWritten);

        [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi)]
        private struct DOCINFO
        {
            [MarshalAs(UnmanagedType.LPStr)] public string pDocName;
            [MarshalAs(UnmanagedType.LPStr)] public string pOutputFile;
            [MarshalAs(UnmanagedType.LPStr)] public string pDataType;
        }

        public static bool PrintBytes(string printerName, byte[] bytes, string documentName = "POS Receipt")
        {
            if (!OpenPrinter(printerName, out IntPtr hPrinter, IntPtr.Zero))
            {
                Log.Error("Failed to open printer '{PrinterName}'", printerName);
                return false;
            }

            try
            {
                var docInfo = new DOCINFO
                {
                    pDocName = documentName,
                    pDataType = "RAW"
                };

                if (!StartDocPrinter(hPrinter, 1, ref docInfo))
                {
                    var error = Marshal.GetLastWin32Error();
                    Log.Error("StartDocPrinter failed. Win32 Error = {Error}", error);
                    return false;
                }

                if (!StartPagePrinter(hPrinter))
                {
                    var error = Marshal.GetLastWin32Error();
                    Log.Error("StartPagePrinter failed. Win32 Error = {Error}", error);
                    return false;
                }

                var pBytes = Marshal.AllocHGlobal(bytes.Length);
                try
                {
                    Marshal.Copy(bytes, 0, pBytes, bytes.Length);
                    if (!WritePrinter(hPrinter, pBytes, bytes.Length, out int written))
                    {
                        Log.Error("WritePrinter failed");
                        return false;
                    }
                    Log.Information("Wrote {Bytes} bytes to printer '{PrinterName}'", written, printerName);
                }
                finally
                {
                    Marshal.FreeHGlobal(pBytes);
                }

                EndPagePrinter(hPrinter);
                EndDocPrinter(hPrinter);
                return true;
            }
            finally
            {
                ClosePrinter(hPrinter);
            }
        }
    }
}
