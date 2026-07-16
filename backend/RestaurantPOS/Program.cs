using System;
using System.Net.NetworkInformation;
using System.Threading;
using Microsoft.Owin.Hosting;
using Serilog;

namespace RestaurantPOS
{
    class Program
    {
        static readonly ManualResetEvent _shutdown = new ManualResetEvent(false);

        static void Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .WriteTo.Console()
                .WriteTo.File("logs/restaurant-pos-.log", rollingInterval: RollingInterval.Day)
                .CreateLogger();

            string baseAddress = "http://localhost:9000";
            int port = 9000;

            if (IsPortInUse(port))
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine();
                Console.WriteLine("  ERROR: Port " + port + " is already in use.");
                Console.WriteLine();
                Console.WriteLine("  Another instance of Restaurant POS is likely already running.");
                Console.WriteLine("  Close the other instance first, or change the port in Program.cs.");
                Console.WriteLine();
                Console.ResetColor();

                Log.Fatal("Port {Port} is already in use. Another instance may be running.", port);
                Log.CloseAndFlush();
                return;
            }

            Console.CancelKeyPress += (sender, e) =>
            {
                e.Cancel = true;
                _shutdown.Set();
            };

            try
            {
                using (WebApp.Start<Startup>(url: baseAddress))
                {
                    Log.Information("Restaurant POS System started on {BaseAddress}", baseAddress);
                    Console.ForegroundColor = ConsoleColor.Green;
                    Console.WriteLine();
                    Console.WriteLine("  Restaurant POS System started on " + baseAddress);
                    Console.WriteLine("  Press Ctrl+C to stop the server...");
                    Console.WriteLine();
                    Console.ResetColor();

                    _shutdown.WaitOne();
                }
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine();
                Console.WriteLine("  ERROR: " + ex.Message);
                Console.WriteLine();
                Console.ResetColor();

                Log.Fatal(ex, "Application failed to start");
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        static bool IsPortInUse(int port)
        {
            try
            {
                var properties = IPGlobalProperties.GetIPGlobalProperties();
                var listeners = properties.GetActiveTcpListeners();
                foreach (var listener in listeners)
                {
                    if (listener.Port == port)
                        return true;
                }
            }
            catch
            {
            }
            return false;
        }
    }
}
