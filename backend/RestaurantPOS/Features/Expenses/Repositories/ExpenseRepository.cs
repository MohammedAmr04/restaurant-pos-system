using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;

namespace RestaurantPOS.Features.Expenses
{
    public class ExpenseRepository : IExpenseRepository
    {
        private readonly IDbConnection _connection;

        public ExpenseRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<IEnumerable<Expense>> GetAllAsync()
        {
            var sql = "SELECT * FROM Expenses WHERE DeletedAt IS NULL ORDER BY CreatedAt DESC";
            return await _connection.QueryAsync<Expense>(sql);
        }

        public async Task<Expense> GetByIdAsync(int id)
        {
            var sql = "SELECT * FROM Expenses WHERE Id = @Id AND DeletedAt IS NULL";
            return await _connection.QueryFirstOrDefaultAsync<Expense>(sql, new { Id = id });
        }

        public async Task<int> CreateAsync(Expense expense)
        {
            var sql = @"INSERT INTO Expenses (UserId, Title, Amount, Notes, BusinessDate, CreatedAt) 
                       VALUES (@UserId, @Title, @Amount, @Notes, @BusinessDate, @CreatedAt);
                       SELECT last_insert_rowid();";
            return await _connection.ExecuteScalarAsync<int>(sql, expense);
        }

        public async Task<bool> UpdateAsync(Expense expense)
        {
            var sql = @"UPDATE Expenses 
                       SET Title = @Title, Amount = @Amount, Notes = @Notes, UpdatedAt = @UpdatedAt 
                       WHERE Id = @Id";
            var affectedRows = await _connection.ExecuteAsync(sql, expense);
            return affectedRows > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var sql = "UPDATE Expenses SET DeletedAt = @DeletedAt WHERE Id = @Id";
            var affectedRows = await _connection.ExecuteAsync(sql, new { Id = id, DeletedAt = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") });
            return affectedRows > 0;
        }
    }
}
