using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;

namespace RestaurantPOS.Features.DeliveryRiders
{
    public class DeliveryRiderRepository : IDeliveryRiderRepository
    {
        private readonly IDbConnection _connection;

        public DeliveryRiderRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<IEnumerable<DeliveryRider>> GetAllAsync()
        {
            var sql = "SELECT * FROM DeliveryRiders WHERE DeletedAt IS NULL ORDER BY Name";
            return await _connection.QueryAsync<DeliveryRider>(sql);
        }

        public async Task<DeliveryRider> GetByIdAsync(int id)
        {
            var sql = "SELECT * FROM DeliveryRiders WHERE Id = @Id AND DeletedAt IS NULL";
            return await _connection.QueryFirstOrDefaultAsync<DeliveryRider>(sql, new { Id = id });
        }

        public async Task<int> CreateAsync(DeliveryRider rider)
        {
            var sql = @"INSERT INTO DeliveryRiders (Name, Phone, Notes, CreatedAt) 
                       VALUES (@Name, @Phone, @Notes, @CreatedAt);
                       SELECT last_insert_rowid();";
            return await _connection.ExecuteScalarAsync<int>(sql, rider);
        }

        public async Task<bool> UpdateAsync(DeliveryRider rider)
        {
            var sql = @"UPDATE DeliveryRiders 
                       SET Name = @Name, Phone = @Phone, Notes = @Notes, UpdatedAt = @UpdatedAt 
                       WHERE Id = @Id";
            var affectedRows = await _connection.ExecuteAsync(sql, rider);
            return affectedRows > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var sql = "UPDATE DeliveryRiders SET DeletedAt = @DeletedAt WHERE Id = @Id";
            var affectedRows = await _connection.ExecuteAsync(sql, new { Id = id, DeletedAt = System.DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") });
            return affectedRows > 0;
        }
    }
}
