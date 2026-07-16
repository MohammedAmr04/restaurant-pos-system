using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;

namespace RestaurantPOS.Features.Tables
{
    public class TableRepository : ITableRepository
    {
        private readonly IDbConnection _connection;

        public TableRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<IEnumerable<RestaurantTable>> GetAllAsync()
        {
            var sql = "SELECT * FROM RestaurantTables WHERE DeletedAt IS NULL ORDER BY Number";
            return await _connection.QueryAsync<RestaurantTable>(sql);
        }

        public async Task<RestaurantTable> GetByIdAsync(int id)
        {
            var sql = "SELECT * FROM RestaurantTables WHERE Id = @Id AND DeletedAt IS NULL";
            return await _connection.QueryFirstOrDefaultAsync<RestaurantTable>(sql, new { Id = id });
        }

        public async Task<RestaurantTable> GetByNumberAsync(int number)
        {
            var sql = "SELECT * FROM RestaurantTables WHERE Number = @Number AND DeletedAt IS NULL";
            return await _connection.QueryFirstOrDefaultAsync<RestaurantTable>(sql, new { Number = number });
        }

        public async Task<int> CreateAsync(RestaurantTable table)
        {
            var sql = @"INSERT INTO RestaurantTables (Number, IsOccupied, CreatedAt) 
                       VALUES (@Number, @IsOccupied, @CreatedAt);
                       SELECT last_insert_rowid();";
            return await _connection.ExecuteScalarAsync<int>(sql, table);
        }

        public async Task<bool> UpdateAsync(RestaurantTable table)
        {
            var sql = @"UPDATE RestaurantTables 
                       SET Number = @Number, IsOccupied = @IsOccupied, UpdatedAt = @UpdatedAt 
                       WHERE Id = @Id";
            var affectedRows = await _connection.ExecuteAsync(sql, table);
            return affectedRows > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var sql = "UPDATE RestaurantTables SET DeletedAt = @DeletedAt WHERE Id = @Id";
            var affectedRows = await _connection.ExecuteAsync(sql, new { Id = id, DeletedAt = System.DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") });
            return affectedRows > 0;
        }

        public async Task<bool> HasActiveOrderAsync(int tableId)
        {
            var sql = "SELECT COUNT(*) FROM Orders WHERE TableId = @TableId AND Status = 'Hold' AND DeletedAt IS NULL";
            var count = await _connection.ExecuteScalarAsync<int>(sql, new { TableId = tableId });
            return count > 0;
        }
    }
}
