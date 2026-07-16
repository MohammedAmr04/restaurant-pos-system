using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using RestaurantPOS.Features.Authentication.Services;
using RestaurantPOS.Shared;

namespace RestaurantPOS.Features.Returns.Controllers
{
    [RoutePrefix("api/v1/returns")]
    public class ReturnsController : ApiController
    {
        private readonly IReturnService _returnService;
        private readonly AuditLogService _auditLogService;

        public ReturnsController(IReturnService returnService, AuditLogService auditLogService)
        {
            _returnService = returnService;
            _auditLogService = auditLogService;
        }

        [HttpGet]
        [Route("")]
        public async Task<IHttpActionResult> GetAll()
        {
            var returns = await _returnService.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<ReturnDto>>.Ok(returns));
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IHttpActionResult> GetById(int id)
        {
            var returnEntity = await _returnService.GetByIdAsync(id);
            if (returnEntity == null) return Ok(ApiResponse.Fail("Return not found"));
            return Ok(ApiResponse<ReturnDto>.Ok(returnEntity));
        }

        [HttpPost]
        [Route("")]
        public async Task<IHttpActionResult> Create([FromBody] CreateReturnDto dto)
        {
            if (dto == null) return BadRequest("Request body is required");
            try
            {
                var returnEntity = await _returnService.CreateReturnAsync(dto);
                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Return", "Order", returnEntity.OrderId, $"Processed return for order: {returnEntity.InvoiceNumber}");
                return Ok(ApiResponse<ReturnDto>.Ok(returnEntity, "Return processed successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }
    }
}
