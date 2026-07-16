using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using RestaurantPOS.Shared;

namespace RestaurantPOS.Features.AuditLogs.Controllers
{
    [RoutePrefix("api/v1/audit-logs")]
    public class AuditLogsController : ApiController
    {
        private readonly IAuditLogService _auditLogService;

        public AuditLogsController(IAuditLogService auditLogService)
        {
            _auditLogService = auditLogService;
        }

        [HttpGet]
        [Route("")]
        public async Task<IHttpActionResult> GetAll()
        {
            var logs = await _auditLogService.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<AuditLogDto>>.Ok(logs));
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IHttpActionResult> GetById(int id)
        {
            var log = await _auditLogService.GetByIdAsync(id);
            if (log == null)
            {
                return Ok(ApiResponse.Fail("Audit log not found"));
            }
            return Ok(ApiResponse<AuditLogDto>.Ok(log));
        }
    }
}
