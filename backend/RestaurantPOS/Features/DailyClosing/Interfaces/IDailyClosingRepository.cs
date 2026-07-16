using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantPOS.Features.DailyClosing
{
    public interface IDailyClosingRepository
    {
        Task<DailyClosing> GetByDateAsync(DateTime date);
    Task<int> CreateAsync(DailyClosing closing);
    Task<IEnumerable<DailyClosing>> GetAllAsync();
}
}
