using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;

namespace RestaurantPOS.Features.Orders
{
    public class OrderItemRepository : IOrderItemRepository
    {
        private readonly IDbConnection _connection;

        public OrderItemRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<IEnumerable<OrderItem>> GetByOrderIdAsync(int orderId)
        {
            var sql = "SELECT * FROM OrderItems WHERE OrderId = @OrderId";
            return await _connection.QueryAsync<OrderItem>(sql, new { OrderId = orderId });
        }

        public async Task<OrderItem> GetByIdAsync(int id)
        {
            var sql = "SELECT * FROM OrderItems WHERE Id = @Id";
            return await _connection.QueryFirstOrDefaultAsync<OrderItem>(sql, new { Id = id });
        }

        public async Task<int> CreateAsync(OrderItem item)
        {
            var sql = @"INSERT INTO OrderItems (OrderId, MenuItemId, Quantity, UnitPrice, Notes, Total) 
                       VALUES (@OrderId, @MenuItemId, @Quantity, @UnitPrice, @Notes, @Total);
                       SELECT last_insert_rowid();";
            return await _connection.ExecuteScalarAsync<int>(sql, item);
        }

        public async Task<bool> UpdateAsync(OrderItem item)
        {
            var sql = @"UPDATE OrderItems 
                       SET Quantity = @Quantity, Notes = @Notes, Total = @Total 
                       WHERE Id = @Id";
            var affectedRows = await _connection.ExecuteAsync(sql, item);
            return affectedRows > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var sql = "DELETE FROM OrderItems WHERE Id = @Id";
            var affectedRows = await _connection.ExecuteAsync(sql, new { Id = id });
            return affectedRows > 0;
        }
    }
}
