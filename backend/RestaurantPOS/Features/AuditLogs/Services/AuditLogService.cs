using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RestaurantPOS.Features.AuditLogs
{
    public class AuditLogService : IAuditLogService
    {
        private readonly AuditLogRepository _auditLogRepository;

        public AuditLogService(AuditLogRepository auditLogRepository)
        {
            _auditLogRepository = auditLogRepository;
        }

        public async Task<IEnumerable<AuditLogDto>> GetAllAsync()
        {
            var logs = await _auditLogRepository.GetAllAsync();
            return logs.Select(MapToDto);
        }

        public async Task<AuditLogDto> GetByIdAsync(int id)
        {
            var log = await _auditLogRepository.GetByIdAsync(id);
            if (log == null) return null;
            return MapToDto(log);
        }

        private AuditLogDto MapToDto(AuditLog log)
        {
            return new AuditLogDto
            {
                Id = log.Id,
                UserId = log.UserId,
                Action = log.Action,
                Entity = log.Entity,
                EntityId = log.EntityId,
                Details = log.Details,
                CreatedAt = log.CreatedAt
            };
        }
    }
}
