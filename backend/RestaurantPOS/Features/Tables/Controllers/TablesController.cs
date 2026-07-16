using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using FluentValidation;
using RestaurantPOS.Features.Authentication.Services;
using RestaurantPOS.Shared;

namespace RestaurantPOS.Features.Tables.Controllers
{
    [RoutePrefix("api/v1/tables")]
    public class TablesController : ApiController
    {
        private readonly ITableService _tableService;
        private readonly AuditLogService _auditLogService;

        public TablesController(ITableService tableService, AuditLogService auditLogService)
        {
            _tableService = tableService;
            _auditLogService = auditLogService;
        }

        [HttpGet]
        [Route("")]
        public async Task<IHttpActionResult> GetAll()
        {
            var tables = await _tableService.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<TableDto>>.Ok(tables));
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IHttpActionResult> GetById(int id)
        {
            var table = await _tableService.GetByIdAsync(id);
            if (table == null)
            {
                return Ok(ApiResponse.Fail("Table not found"));
            }
            return Ok(ApiResponse<TableDto>.Ok(table));
        }

        [HttpPost]
        [Route("")]
        public async Task<IHttpActionResult> Create([FromBody] CreateTableDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Request body is required");
            }

            var validator = new CreateTableValidator();
            var validationResult = await validator.ValidateAsync(dto);

            if (!validationResult.IsValid)
            {
                var errors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    errors.Add(error.ErrorMessage);
                }
                return Ok(ApiResponse.Fail("Validation failed", errors));
            }

            try
            {
                var table = await _tableService.CreateTableAsync(dto);
                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Create", "Table", table.Id, $"Created table number: {table.Number}");
                return Ok(ApiResponse<TableDto>.Ok(table, "Table created successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IHttpActionResult> Update(int id, [FromBody] UpdateTableDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Request body is required");
            }

            var validator = new UpdateTableValidator();
            var validationResult = await validator.ValidateAsync(dto);

            if (!validationResult.IsValid)
            {
                var errors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    errors.Add(error.ErrorMessage);
                }
                return Ok(ApiResponse.Fail("Validation failed", errors));
            }

            try
            {
                var table = await _tableService.UpdateTableAsync(id, dto);
                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Update", "Table", table.Id, $"Updated table number: {table.Number}");
                return Ok(ApiResponse<TableDto>.Ok(table, "Table updated successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IHttpActionResult> Delete(int id)
        {
            try
            {
                var result = await _tableService.DeleteTableAsync(id);
                if (!result)
                {
                    return Ok(ApiResponse.Fail("Table not found"));
                }
                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Delete", "Table", id, "Deleted table");
                return Ok(ApiResponse.Ok("Table deleted successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }

        [HttpPatch]
        [Route("{id:int}/move-order")]
        public async Task<IHttpActionResult> MoveOrder(int id, [FromBody] MoveOrderDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Request body is required");
            }

            try
            {
                var result = await _tableService.MoveOrderAsync(id, dto.TargetTableId);
                if (!result)
                {
                    return Ok(ApiResponse.Fail("Failed to move order"));
                }
                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Update", "Table", id, $"Moved order from table {id} to table {dto.TargetTableId}");
                return Ok(ApiResponse.Ok("Order moved successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }
    }
}
