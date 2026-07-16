using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;

namespace RestaurantPOS.Features.Orders
{
    public class OrderRepository : IOrderRepository
    {
        private readonly IDbConnection _connection;

        public OrderRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<IEnumerable<Order>> GetAllAsync()
        {
            var sql = "SELECT * FROM Orders WHERE DeletedAt IS NULL ORDER BY CreatedAt DESC";
            return await _connection.QueryAsync<Order>(sql);
        }

        public async Task<Order> GetByIdAsync(int id)
        {
            var sql = "SELECT * FROM Orders WHERE Id = @Id AND DeletedAt IS NULL";
            return await _connection.QueryFirstOrDefaultAsync<Order>(sql, new { Id = id });
        }

        public async Task<IEnumerable<Order>> GetByStatusAsync(string status)
        {
            var sql = "SELECT * FROM Orders WHERE Status = @Status AND DeletedAt IS NULL ORDER BY CreatedAt DESC";
            return await _connection.QueryAsync<Order>(sql, new { Status = status });
        }

        public async Task<int> CreateAsync(Order order)
        {
            var sql = @"INSERT INTO Orders (InvoiceNumber, OrderType, Status, UserId, CustomerId, TableId, DeliveryRiderId, 
                       Subtotal, DiscountType, DiscountValue, ServiceCharge, Tax, GrandTotal, PaymentMethod, PaidAmount, 
                       BusinessDate, CompletedAt, CreatedAt) 
                       VALUES (@InvoiceNumber, @OrderType, @Status, @UserId, @CustomerId, @TableId, @DeliveryRiderId, 
                       @Subtotal, @DiscountType, @DiscountValue, @ServiceCharge, @Tax, @GrandTotal, @PaymentMethod, @PaidAmount, 
                       @BusinessDate, @CompletedAt, @CreatedAt);
                       SELECT last_insert_rowid();";
            return await _connection.ExecuteScalarAsync<int>(sql, order);
        }

        public async Task<bool> UpdateAsync(Order order)
        {
            var sql = @"UPDATE Orders 
                       SET InvoiceNumber = @InvoiceNumber, OrderType = @OrderType, Status = @Status, UserId = @UserId, 
                           CustomerId = @CustomerId, TableId = @TableId, DeliveryRiderId = @DeliveryRiderId, 
                           Subtotal = @Subtotal, DiscountType = @DiscountType, DiscountValue = @DiscountValue, 
                           ServiceCharge = @ServiceCharge, Tax = @Tax, GrandTotal = @GrandTotal, 
                           PaymentMethod = @PaymentMethod, PaidAmount = @PaidAmount, BusinessDate = @BusinessDate, 
                           CompletedAt = @CompletedAt, UpdatedAt = @UpdatedAt 
                       WHERE Id = @Id";
            var affectedRows = await _connection.ExecuteAsync(sql, order);
            return affectedRows > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var sql = "UPDATE Orders SET DeletedAt = @DeletedAt WHERE Id = @Id";
            var affectedRows = await _connection.ExecuteAsync(sql, new { Id = id, DeletedAt = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") });
            return affectedRows > 0;
        }

        public async Task<string> GetNextInvoiceNumberAsync()
        {
            var today = DateTime.Now.ToString("yyyy-MM-dd");
            var prefix = DateTime.Now.ToString("yyyyMMdd");
            var sql = "SELECT COUNT(*) FROM Orders WHERE date(BusinessDate) = @BusinessDate";
            var count = await _connection.ExecuteScalarAsync<int>(sql, new { BusinessDate = today });
            return $"{prefix}-{(count + 1).ToString("D4")}";
        }
    }
}
