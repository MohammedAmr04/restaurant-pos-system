using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantPOS.Features.DeliveryRiders
{
    public interface IDeliveryRiderService
    {
        Task<IEnumerable<DeliveryRiderDto>> GetAllAsync();
        Task<DeliveryRiderDto> GetByIdAsync(int id);
        Task<DeliveryRiderDto> CreateAsync(CreateDeliveryRiderDto dto);
        Task<DeliveryRiderDto> UpdateAsync(int id, UpdateDeliveryRiderDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
