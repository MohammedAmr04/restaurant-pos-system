using System;
using System.Globalization;

namespace RestaurantPOS.Shared
{
    public static class BusinessDayHelper
    {
        public const string DefaultShiftStart = "11:00";
        public const string DefaultShiftEnd = "03:00";

        public static TimeSpan GetShiftStart(Features.Settings.Settings settings)
        {
            return ParseTime(settings?.ShiftStart, DefaultShiftStart);
        }

        public static TimeSpan GetShiftEnd(Features.Settings.Settings settings)
        {
            return ParseTime(settings?.ShiftEnd, DefaultShiftEnd);
        }

        public static TimeSpan ParseTime(string value, string fallback)
        {
            if (TimeSpan.TryParse(value, out var parsed))
                return parsed;
            if (TimeSpan.TryParse(fallback, out var parsedFallback))
                return parsedFallback;
            return TimeSpan.FromHours(11);
        }

        /// <summary>
        /// Determines the business (shift) date a given instant belongs to.
        /// Rule: if the time of day is at or after the shift start, the instant belongs
        /// to its calendar date; otherwise it belongs to the previous calendar date.
        /// This correctly handles shifts that cross midnight (e.g. 11:00 AM - 03:00 AM),
        /// where an order at 01:00 AM belongs to the previous business day.
        /// Boundary: the shift end (e.g. 03:00 AM) belongs to the closing shift, since it
        /// is before the shift start.
        /// </summary>
        public static DateTime GetBusinessDate(DateTime dateTime, TimeSpan shiftStart)
        {
            return dateTime.TimeOfDay >= shiftStart ? dateTime.Date : dateTime.Date.AddDays(-1);
        }

        /// <summary>
        /// Inclusive start and exclusive end of a business day, e.g. for a business date D
        /// with shift 11:00 AM - 03:00 AM the range is [D 11:00, D+1 03:00).
        /// </summary>
        public static Tuple<DateTime, DateTime> GetBusinessDayRange(DateTime businessDate, TimeSpan shiftStart, TimeSpan shiftEnd)
        {
            var start = businessDate.Date.Add(shiftStart);
            var end = shiftEnd > shiftStart
                ? businessDate.Date.Add(shiftEnd)
                : businessDate.Date.AddDays(1).Add(shiftEnd);
            return Tuple.Create(start, end);
        }

        public static string FormatShift(TimeSpan time)
        {
            var dateTime = DateTime.Today.Add(time);
            return dateTime.ToString("hh:mm tt", CultureInfo.InvariantCulture);
        }
    }
}
