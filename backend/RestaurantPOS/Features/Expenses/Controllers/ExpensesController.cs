using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using FluentValidation;
using RestaurantPOS.Features.Authentication.Services;
using RestaurantPOS.Shared;

namespace RestaurantPOS.Features.Expenses.Controllers
{
    [RoutePrefix("api/v1/expenses")]
    public class ExpensesController : ApiController
    {
        private readonly IExpenseService _expenseService;
        private readonly AuditLogService _auditLogService;

        public ExpensesController(IExpenseService expenseService, AuditLogService auditLogService)
        {
            _expenseService = expenseService;
            _auditLogService = auditLogService;
        }

        [HttpGet]
        [Route("")]
        public async Task<IHttpActionResult> GetAll()
        {
            var expenses = await _expenseService.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<ExpenseDto>>.Ok(expenses));
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IHttpActionResult> GetById(int id)
        {
            var expense = await _expenseService.GetByIdAsync(id);
            if (expense == null)
            {
                return Ok(ApiResponse.Fail("Expense not found"));
            }
            return Ok(ApiResponse<ExpenseDto>.Ok(expense));
        }

        [HttpPost]
        [Route("")]
        public async Task<IHttpActionResult> Create([FromBody] CreateExpenseDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Request body is required");
            }

            try
            {
                var expense = await _expenseService.CreateAsync(dto);
                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Create", "Expense", expense.Id, $"Created expense: {expense.Title}");
                return Ok(ApiResponse<ExpenseDto>.Ok(expense, "Expense created successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IHttpActionResult> Update(int id, [FromBody] UpdateExpenseDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Request body is required");
            }

            try
            {
                var expense = await _expenseService.UpdateAsync(id, dto);
                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Update", "Expense", expense.Id, $"Updated expense: {expense.Title}");
                return Ok(ApiResponse<ExpenseDto>.Ok(expense, "Expense updated successfully"));
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
                var result = await _expenseService.DeleteAsync(id);
                if (!result)
                {
                    return Ok(ApiResponse.Fail("Expense not found"));
                }
                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Delete", "Expense", id, "Deleted expense");
                return Ok(ApiResponse.Ok("Expense deleted successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }
    }
}
