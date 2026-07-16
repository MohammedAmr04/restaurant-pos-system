using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;

namespace RestaurantPOS.Features.Returns
{
    public class ReturnItemRepository : IReturnItemRepository
    {
        private readonly IDbConnection _connection;

        public ReturnItemRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<IEnumerable<ReturnItem>> GetByReturnIdAsync(int returnId)
        {
            var sql = "SELECT * FROM ReturnItems WHERE ReturnId = @ReturnId";
            return await _connection.QueryAsync<ReturnItem>(sql, new { ReturnId = returnId });
        }

        public async Task<int> CreateAsync(ReturnItem item)
        {
            var sql = @"INSERT INTO ReturnItems (ReturnId, OrderItemId, Quantity, RefundAmount) 
                       VALUES (@ReturnId, @OrderItemId, @Quantity, @RefundAmount);
                       SELECT last_insert_rowid();";
            return await _connection.ExecuteScalarAsync<int>(sql, item);
        }
    }
}
