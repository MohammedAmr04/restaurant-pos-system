using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;

namespace RestaurantPOS.Features.AuditLogs
{
    public class AuditLogRepository
    {
        private readonly IDbConnection _connection;

        public AuditLogRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<IEnumerable<AuditLog>> GetAllAsync()
        {
            var sql = "SELECT * FROM AuditLogs ORDER BY CreatedAt DESC";
            return await _connection.QueryAsync<AuditLog>(sql);
        }

        public async Task<AuditLog> GetByIdAsync(int id)
        {
            var sql = "SELECT * FROM AuditLogs WHERE Id = @Id";
            return await _connection.QueryFirstOrDefaultAsync<AuditLog>(sql, new { Id = id });
        }

        public async Task<int> CreateAsync(AuditLog auditLog)
        {
            var sql = @"INSERT INTO AuditLogs (UserId, Action, Entity, EntityId, Details, CreatedAt) 
                       VALUES (@UserId, @Action, @Entity, @EntityId, @Details, @CreatedAt);
                       SELECT last_insert_rowid();";
            return await _connection.ExecuteScalarAsync<int>(sql, auditLog);
        }
    }
}
