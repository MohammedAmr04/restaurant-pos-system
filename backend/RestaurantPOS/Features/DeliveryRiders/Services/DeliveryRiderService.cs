using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RestaurantPOS.Features.DeliveryRiders
{
    public class DeliveryRiderService : IDeliveryRiderService
    {
        private readonly IDeliveryRiderRepository _riderRepository;

        public DeliveryRiderService(IDeliveryRiderRepository riderRepository)
        {
            _riderRepository = riderRepository;
        }

        public async Task<IEnumerable<DeliveryRiderDto>> GetAllAsync()
        {
            var riders = await _riderRepository.GetAllAsync();
            return riders.Select(MapToDto);
        }

        public async Task<DeliveryRiderDto> GetByIdAsync(int id)
        {
            var rider = await _riderRepository.GetByIdAsync(id);
            if (rider == null) return null;
            return MapToDto(rider);
        }

        public async Task<DeliveryRiderDto> CreateAsync(CreateDeliveryRiderDto dto)
        {
            var rider = new DeliveryRider
            {
                Name = dto.Name,
                Phone = dto.Phone,
                Notes = dto.Notes,
                CreatedAt = DateTime.Now
            };

            var id = await _riderRepository.CreateAsync(rider);
            rider.Id = id;

            return MapToDto(rider);
        }

        public async Task<DeliveryRiderDto> UpdateAsync(int id, UpdateDeliveryRiderDto dto)
        {
            var existingRider = await _riderRepository.GetByIdAsync(id);
            if (existingRider == null)
            {
                throw new Exception("Delivery rider not found");
            }

            existingRider.Name = dto.Name;
            existingRider.Phone = dto.Phone;
            existingRider.Notes = dto.Notes;
            existingRider.UpdatedAt = DateTime.Now;

            await _riderRepository.UpdateAsync(existingRider);

            return MapToDto(existingRider);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var rider = await _riderRepository.GetByIdAsync(id);
            if (rider == null)
            {
                throw new Exception("Delivery rider not found");
            }

            return await _riderRepository.DeleteAsync(id);
        }

        private DeliveryRiderDto MapToDto(DeliveryRider rider)
        {
            return new DeliveryRiderDto
            {
                Id = rider.Id,
                Name = rider.Name,
                Phone = rider.Phone,
                Notes = rider.Notes
            };
        }
    }
}
