using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;

namespace RestaurantPOS.Features.DailyClosing
{
    public class DailyClosingRepository : IDailyClosingRepository
    {
        private readonly IDbConnection _connection;

        public DailyClosingRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<DailyClosing> GetByDateAsync(DateTime date)
        {
            var dateStr = date.ToString("yyyy-MM-dd");
            var sql = "SELECT * FROM DailyClosings WHERE BusinessDate = @Date AND DeletedAt IS NULL";
            return await _connection.QueryFirstOrDefaultAsync<DailyClosing>(sql, new { Date = dateStr });
        }

        public async Task<int> CreateAsync(DailyClosing closing)
        {
            var sql = @"INSERT INTO DailyClosings (UserId, BusinessDate, TotalSales, TotalExpenses, TotalReturns, 
                       CashCollected, ExpectedCash, ActualCash, Difference, Notes, CreatedAt) 
                       VALUES (@UserId, @BusinessDate, @TotalSales, @TotalExpenses, @TotalReturns, 
                       @CashCollected, @ExpectedCash, @ActualCash, @Difference, @Notes, @CreatedAt);
                       SELECT last_insert_rowid();";
            return await _connection.ExecuteScalarAsync<int>(sql, closing);
        }

        public async Task<IEnumerable<DailyClosing>> GetAllAsync()
        {
            var sql = "SELECT * FROM DailyClosings WHERE DeletedAt IS NULL ORDER BY BusinessDate DESC";
            return await _connection.QueryAsync<DailyClosing>(sql);
        }
    }
}
