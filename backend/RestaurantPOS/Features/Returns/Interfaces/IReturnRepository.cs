using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantPOS.Features.Returns
{
    public interface IReturnRepository
    {
        Task<IEnumerable<Return>> GetAllAsync();
        Task<Return> GetByIdAsync(int id);
        Task<int> CreateAsync(Return returnEntity);
    }
}
