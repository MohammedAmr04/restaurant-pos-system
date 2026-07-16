using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantPOS.Features.DailyClosing
{
    public interface IDailyClosingService
    {
        Task<DailyClosingSummaryDto> GetTodaySummaryAsync();
    Task<DailyClosingSummaryDto> GetSummaryByDateAsync(DateTime date);
    Task<DailyClosingDto> CreateAsync(CreateDailyClosingDto dto);
    Task<DailyClosingDto> GetByDateAsync(DateTime date);
    Task<IEnumerable<DailyClosingDto>> GetAllAsync();
}
}
