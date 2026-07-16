using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;

namespace RestaurantPOS.Features.Returns
{
    public class ReturnRepository : IReturnRepository
    {
        private readonly IDbConnection _connection;

        public ReturnRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<IEnumerable<Return>> GetAllAsync()
        {
            var sql = "SELECT * FROM Returns ORDER BY CreatedAt DESC";
            return await _connection.QueryAsync<Return>(sql);
        }

        public async Task<Return> GetByIdAsync(int id)
        {
            var sql = "SELECT * FROM Returns WHERE Id = @Id";
            return await _connection.QueryFirstOrDefaultAsync<Return>(sql, new { Id = id });
        }

        public async Task<int> CreateAsync(Return returnEntity)
        {
            var sql = @"INSERT INTO Returns (OrderId, UserId, TotalRefund, Reason, CreatedAt) 
                       VALUES (@OrderId, @UserId, @TotalRefund, @Reason, @CreatedAt);
                       SELECT last_insert_rowid();";
            return await _connection.ExecuteScalarAsync<int>(sql, returnEntity);
        }
    }
}
