using System.Threading.Tasks;

namespace RestaurantPOS.Features.Settings
{
    public interface ISettingsService
    {
        Task<SettingsDto> GetAsync();
        Task<SettingsDto> UpdateAsync(UpdateSettingsDto dto);
    }
}
