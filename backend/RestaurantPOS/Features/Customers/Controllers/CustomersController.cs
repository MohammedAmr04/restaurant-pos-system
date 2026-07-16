using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using FluentValidation;
using RestaurantPOS.Features.Authentication.Services;
using RestaurantPOS.Shared;

namespace RestaurantPOS.Features.Customers.Controllers
{
    [RoutePrefix("api/v1/customers")]
    public class CustomersController : ApiController
    {
        private readonly ICustomerService _customerService;
        private readonly AuditLogService _auditLogService;

        public CustomersController(ICustomerService customerService, AuditLogService auditLogService)
        {
            _customerService = customerService;
            _auditLogService = auditLogService;
        }

        [HttpGet]
        [Route("")]
        public async Task<IHttpActionResult> GetAll()
        {
            var customers = await _customerService.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<CustomerDto>>.Ok(customers));
        }

        [HttpGet]
        [Route("search")]
        public async Task<IHttpActionResult> Search([FromUri] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
            {
                return Ok(ApiResponse<IEnumerable<CustomerDto>>.Ok(new List<CustomerDto>()));
            }
            var customers = await _customerService.SearchAsync(q.Trim());
            return Ok(ApiResponse<IEnumerable<CustomerDto>>.Ok(customers));
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IHttpActionResult> GetById(int id)
        {
            var customer = await _customerService.GetByIdAsync(id);
            if (customer == null)
            {
                return Ok(ApiResponse.Fail("Customer not found"));
            }
            return Ok(ApiResponse<CustomerDto>.Ok(customer));
        }

        [HttpGet]
        [Route("phone/{phone}")]
        public async Task<IHttpActionResult> GetByPhone(string phone)
        {
            var customer = await _customerService.GetByPhoneAsync(phone);
            if (customer == null)
            {
                return Ok(ApiResponse.Fail("Customer not found"));
            }
            return Ok(ApiResponse<CustomerDto>.Ok(customer));
        }

        [HttpPost]
        [Route("")]
        public async Task<IHttpActionResult> Create([FromBody] CreateCustomerDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Request body is required");
            }

            var validator = new CreateCustomerValidator();
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
                var customer = await _customerService.CreateAsync(dto);
                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Create", "Customer", customer.Id, $"Created customer: {customer.Name}");
                return Ok(ApiResponse<CustomerDto>.Ok(customer, "Customer created successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IHttpActionResult> Update(int id, [FromBody] UpdateCustomerDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Request body is required");
            }

            var validator = new UpdateCustomerValidator();
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
                var customer = await _customerService.UpdateAsync(id, dto);
                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Update", "Customer", customer.Id, $"Updated customer: {customer.Name}");
                return Ok(ApiResponse<CustomerDto>.Ok(customer, "Customer updated successfully"));
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
                var result = await _customerService.DeleteAsync(id);
                if (!result)
                {
                    return Ok(ApiResponse.Fail("Customer not found"));
                }
                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Delete", "Customer", id, "Deleted customer");
                return Ok(ApiResponse.Ok("Customer deleted successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }
    }
}
