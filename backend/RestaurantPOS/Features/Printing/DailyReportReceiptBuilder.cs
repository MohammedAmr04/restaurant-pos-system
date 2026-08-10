using System;

namespace RestaurantPOS.Features.Printing
{
    public static class DailyReportReceiptBuilder
    {
        public static DailyReportModel Build(Reports.DailySalesReportDto report, Settings.SettingsDto settings)
        {
            return new DailyReportModel
            {
                RestaurantName = settings?.RestaurantName ?? "مطعم ومشويات بيت المعز",
                Phone = settings?.Phone,
                Phone2 = settings?.Phone2,
                Address = settings?.Address,
                BusinessDate = report.BusinessDate,
                ShiftStart = report.ShiftStart ?? Shared.BusinessDayHelper.DefaultShiftStart,
                ShiftEnd = report.ShiftEnd ?? Shared.BusinessDayHelper.DefaultShiftEnd,
                TotalOrders = report.TotalOrders,
                CompletedOrders = report.CompletedOrders,
                ReturnedOrders = report.ReturnedOrders,
                TotalSales = report.TotalSales,
                Discounts = report.Discounts,
                ServiceCharge = report.ServiceCharge,
                Returns = report.Returns,
                Expenses = report.Expenses,
                RevenueBeforeExpenses = report.RevenueBeforeExpenses,
                RevenueAfterExpenses = report.RevenueAfterExpenses,
                DineInCount = report.OrderTypes?.DineIn?.Count ?? 0,
                DineInAmount = report.OrderTypes?.DineIn?.Amount ?? 0,
                DeliveryCount = report.OrderTypes?.Delivery?.Count ?? 0,
                DeliveryAmount = report.OrderTypes?.Delivery?.Amount ?? 0,
                TakeAwayCount = report.OrderTypes?.TakeAway?.Count ?? 0,
                TakeAwayAmount = report.OrderTypes?.TakeAway?.Amount ?? 0,
                PrintedAt = DateTime.Now
            };
        }
    }
}
