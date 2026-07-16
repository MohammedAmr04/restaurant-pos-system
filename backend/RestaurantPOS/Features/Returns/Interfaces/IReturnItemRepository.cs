using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantPOS.Features.Returns
{
    public interface IReturnItemRepository
    {
        Task<IEnumerable<ReturnItem>> GetByReturnIdAsync(int returnId);
        Task<int> CreateAsync(ReturnItem item);
    }
}
