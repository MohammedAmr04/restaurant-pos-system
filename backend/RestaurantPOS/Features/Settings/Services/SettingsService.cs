using System;
using System.Threading.Tasks;

namespace RestaurantPOS.Features.Settings
{
    public class SettingsService : ISettingsService
    {
        private readonly ISettingsRepository _settingsRepository;

        public SettingsService(ISettingsRepository settingsRepository)
        {
            _settingsRepository = settingsRepository;
        }

        public async Task<SettingsDto> GetAsync()
        {
            var settings = await _settingsRepository.GetAsync();
            if (settings == null) return null;
            return MapToDto(settings);
        }

        public async Task<SettingsDto> UpdateAsync(UpdateSettingsDto dto)
        {
            var settings = await _settingsRepository.GetAsync();
            if (settings == null)
            {
                throw new Exception("Settings not found");
            }

            settings.RestaurantName = dto.RestaurantName;
            settings.Phone = dto.Phone;
            settings.Phone2 = dto.Phone2;
            settings.Address = dto.Address;
            settings.Logo = dto.Logo;
            settings.TaxEnabled = dto.TaxEnabled;
            settings.TaxPercentage = dto.TaxPercentage;
            settings.ServiceChargeEnabled = dto.ServiceChargeEnabled;
            settings.ServiceChargePercentage = dto.ServiceChargePercentage;
            settings.ReceiptHeader = dto.ReceiptHeader;
            settings.ReceiptFooter = dto.ReceiptFooter;
            settings.PrinterName = dto.PrinterName ?? "";
            settings.PaperWidth = dto.PaperWidth > 0 ? dto.PaperWidth : 80;
            settings.PrinterCopies = dto.PrinterCopies > 0 ? dto.PrinterCopies : 1;
            settings.PrinterEnabled = dto.PrinterEnabled;
            settings.UpdatedAt = DateTime.Now;

            await _settingsRepository.UpdateAsync(settings);

            return MapToDto(settings);
        }

        private SettingsDto MapToDto(Settings settings)
        {
            return new SettingsDto
            {
                Id = settings.Id,
                RestaurantName = settings.RestaurantName,
                Phone = settings.Phone,
                Phone2 = settings.Phone2,
                Address = settings.Address,
                Logo = settings.Logo,
                TaxEnabled = settings.TaxEnabled,
                TaxPercentage = settings.TaxPercentage,
                ServiceChargeEnabled = settings.ServiceChargeEnabled,
                ServiceChargePercentage = settings.ServiceChargePercentage,
                ReceiptHeader = settings.ReceiptHeader,
                ReceiptFooter = settings.ReceiptFooter,
                PrinterName = settings.PrinterName ?? "",
                PaperWidth = settings.PaperWidth > 0 ? settings.PaperWidth : 80,
                PrinterCopies = settings.PrinterCopies > 0 ? settings.PrinterCopies : 1,
                PrinterEnabled = settings.PrinterEnabled
            };
        }
    }
}
