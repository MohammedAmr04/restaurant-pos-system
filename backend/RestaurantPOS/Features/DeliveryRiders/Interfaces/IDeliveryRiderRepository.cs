using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantPOS.Features.DeliveryRiders
{
    public interface IDeliveryRiderRepository
    {
        Task<IEnumerable<DeliveryRider>> GetAllAsync();
        Task<DeliveryRider> GetByIdAsync(int id);
        Task<int> CreateAsync(DeliveryRider rider);
        Task<bool> UpdateAsync(DeliveryRider rider);
        Task<bool> DeleteAsync(int id);
    }
}
