using System;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using RestaurantPOS.Shared;

namespace RestaurantPOS.Features.Authentication.Services
{
    public class AuditLogService
    {
        private readonly IDbConnection _connection;

        public AuditLogService(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task LogAsync(int? userId, string action, string entity, int? entityId, string details)
        {
            var sql = @"INSERT INTO AuditLogs (UserId, Action, Entity, EntityId, Details, CreatedAt) 
                       VALUES (@UserId, @Action, @Entity, @EntityId, @Details, @CreatedAt)";
            
            await _connection.ExecuteAsync(sql, new
            {
                UserId = userId,
                Action = action,
                Entity = entity,
                EntityId = entityId,
                Details = details,
                CreatedAt = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")
            });
        }
    }
}
