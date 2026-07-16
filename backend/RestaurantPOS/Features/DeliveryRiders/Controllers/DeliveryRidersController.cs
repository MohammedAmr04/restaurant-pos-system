using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using FluentValidation;
using RestaurantPOS.Features.Authentication.Services;
using RestaurantPOS.Shared;

namespace RestaurantPOS.Features.DeliveryRiders.Controllers
{
    [RoutePrefix("api/v1/delivery-riders")]
    public class DeliveryRidersController : ApiController
    {
        private readonly IDeliveryRiderService _riderService;
        private readonly AuditLogService _auditLogService;

        public DeliveryRidersController(IDeliveryRiderService riderService, AuditLogService auditLogService)
        {
            _riderService = riderService;
            _auditLogService = auditLogService;
        }

        [HttpGet]
        [Route("")]
        public async Task<IHttpActionResult> GetAll()
        {
            var riders = await _riderService.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<DeliveryRiderDto>>.Ok(riders));
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IHttpActionResult> GetById(int id)
        {
            var rider = await _riderService.GetByIdAsync(id);
            if (rider == null)
            {
                return Ok(ApiResponse.Fail("Delivery rider not found"));
            }
            return Ok(ApiResponse<DeliveryRiderDto>.Ok(rider));
        }

        [HttpPost]
        [Route("")]
        public async Task<IHttpActionResult> Create([FromBody] CreateDeliveryRiderDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Request body is required");
            }

            var validator = new CreateDeliveryRiderValidator();
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
                var rider = await _riderService.CreateAsync(dto);
                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Create", "DeliveryRider", rider.Id, $"Created delivery rider: {rider.Name}");
                return Ok(ApiResponse<DeliveryRiderDto>.Ok(rider, "Delivery rider created successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IHttpActionResult> Update(int id, [FromBody] UpdateDeliveryRiderDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Request body is required");
            }

            var validator = new UpdateDeliveryRiderValidator();
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
                var rider = await _riderService.UpdateAsync(id, dto);
                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Update", "DeliveryRider", rider.Id, $"Updated delivery rider: {rider.Name}");
                return Ok(ApiResponse<DeliveryRiderDto>.Ok(rider, "Delivery rider updated successfully"));
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
                var result = await _riderService.DeleteAsync(id);
                if (!result)
                {
                    return Ok(ApiResponse.Fail("Delivery rider not found"));
                }
                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Delete", "DeliveryRider", id, "Deleted delivery rider");
                return Ok(ApiResponse.Ok("Delivery rider deleted successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }
    }
}
