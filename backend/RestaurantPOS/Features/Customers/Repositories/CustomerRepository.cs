using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;

namespace RestaurantPOS.Features.Customers
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly IDbConnection _connection;

        public CustomerRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<IEnumerable<Customer>> GetAllAsync()
        {
            var sql = "SELECT * FROM Customers WHERE DeletedAt IS NULL ORDER BY Name";
            return await _connection.QueryAsync<Customer>(sql);
        }

        public async Task<IEnumerable<Customer>> SearchAsync(string query)
        {
            var sql = @"SELECT * FROM Customers 
                        WHERE DeletedAt IS NULL 
                          AND (Phone LIKE @Query OR Name LIKE @Query) 
                        ORDER BY Name 
                        LIMIT 20";
            return await _connection.QueryAsync<Customer>(sql, new { Query = $"%{query}%" });
        }

        public async Task<Customer> GetByIdAsync(int id)
        {
            var sql = "SELECT * FROM Customers WHERE Id = @Id AND DeletedAt IS NULL";
            return await _connection.QueryFirstOrDefaultAsync<Customer>(sql, new { Id = id });
        }

        public async Task<Customer> GetByPhoneAsync(string phone)
        {
            var sql = "SELECT * FROM Customers WHERE Phone = @Phone AND DeletedAt IS NULL";
            return await _connection.QueryFirstOrDefaultAsync<Customer>(sql, new { Phone = phone });
        }

        public async Task<int> CreateAsync(Customer customer)
        {
            var sql = @"INSERT INTO Customers (Name, Phone, Address, Notes, CreatedAt) 
                       VALUES (@Name, @Phone, @Address, @Notes, @CreatedAt);
                       SELECT last_insert_rowid();";
            return await _connection.ExecuteScalarAsync<int>(sql, customer);
        }

        public async Task<bool> UpdateAsync(Customer customer)
        {
            var sql = @"UPDATE Customers 
                       SET Name = @Name, Phone = @Phone, Address = @Address, Notes = @Notes, UpdatedAt = @UpdatedAt 
                       WHERE Id = @Id";
            var affectedRows = await _connection.ExecuteAsync(sql, customer);
            return affectedRows > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var sql = "UPDATE Customers SET DeletedAt = @DeletedAt WHERE Id = @Id";
            var affectedRows = await _connection.ExecuteAsync(sql, new { Id = id, DeletedAt = System.DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") });
            return affectedRows > 0;
        }
    }
}
