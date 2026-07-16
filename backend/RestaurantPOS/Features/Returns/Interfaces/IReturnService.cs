using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantPOS.Features.Returns
{
    public interface IReturnService
    {
        System.Threading.Tasks.Task<IEnumerable<ReturnDto>> GetAllAsync();
        System.Threading.Tasks.Task<ReturnDto> GetByIdAsync(int id);
        System.Threading.Tasks.Task<ReturnDto> CreateReturnAsync(CreateReturnDto dto);
    }
}
