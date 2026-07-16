using System.Data;
using System.Threading.Tasks;
using Dapper;

namespace RestaurantPOS.Features.Settings
{
    public class SettingsRepository : ISettingsRepository
    {
        private readonly IDbConnection _connection;

        public SettingsRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<Settings> GetAsync()
        {
            var sql = "SELECT * FROM Settings WHERE Id = 1";
            return await _connection.QueryFirstOrDefaultAsync<Settings>(sql);
        }

        public async Task<bool> UpdateAsync(Settings settings)
        {
            var sql = @"UPDATE Settings 
                       SET RestaurantName = @RestaurantName, Phone = @Phone, Address = @Address, Logo = @Logo, 
                           TaxEnabled = @TaxEnabled, TaxPercentage = @TaxPercentage, 
                           ServiceChargeEnabled = @ServiceChargeEnabled, ServiceChargePercentage = @ServiceChargePercentage, 
                           ReceiptHeader = @ReceiptHeader, ReceiptFooter = @ReceiptFooter,
                           PrinterName = @PrinterName, PaperWidth = @PaperWidth,
                           PrinterCopies = @PrinterCopies, PrinterEnabled = @PrinterEnabled,
                           UpdatedAt = @UpdatedAt 
                       WHERE Id = @Id";
            var affectedRows = await _connection.ExecuteAsync(sql, settings);
            return affectedRows > 0;
        }
    }
}
