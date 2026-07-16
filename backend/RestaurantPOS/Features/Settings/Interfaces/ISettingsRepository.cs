using System.Threading.Tasks;

namespace RestaurantPOS.Features.Settings
{
    public interface ISettingsRepository
    {
        Task<Settings> GetAsync();
        Task<bool> UpdateAsync(Settings settings);
    }
}
