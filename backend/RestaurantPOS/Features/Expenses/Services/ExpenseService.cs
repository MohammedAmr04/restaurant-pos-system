using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RestaurantPOS.Features.Expenses
{
    public class ExpenseService : IExpenseService
    {
        private readonly IExpenseRepository _expenseRepository;

        public ExpenseService(IExpenseRepository expenseRepository)
        {
            _expenseRepository = expenseRepository;
        }

        public async Task<IEnumerable<ExpenseDto>> GetAllAsync()
        {
            var expenses = await _expenseRepository.GetAllAsync();
            return expenses.Select(MapToDto);
        }

        public async Task<ExpenseDto> GetByIdAsync(int id)
        {
            var expense = await _expenseRepository.GetByIdAsync(id);
            if (expense == null) return null;
            return MapToDto(expense);
        }

        public async Task<ExpenseDto> CreateAsync(CreateExpenseDto dto)
        {
            var expense = new Expense
            {
                UserId = Shared.AuthHelper.GetCurrentUserId(),
                Title = dto.Title,
                Amount = dto.Amount,
                Notes = dto.Notes,
                BusinessDate = DateTime.Now.Date,
                CreatedAt = DateTime.Now
            };

            var id = await _expenseRepository.CreateAsync(expense);
            expense.Id = id;

            return MapToDto(expense);
        }

        public async Task<ExpenseDto> UpdateAsync(int id, UpdateExpenseDto dto)
        {
            var existingExpense = await _expenseRepository.GetByIdAsync(id);
            if (existingExpense == null)
            {
                throw new Exception("Expense not found");
            }

            existingExpense.Title = dto.Title;
            existingExpense.Amount = dto.Amount;
            existingExpense.Notes = dto.Notes;
            existingExpense.UpdatedAt = DateTime.Now;

            await _expenseRepository.UpdateAsync(existingExpense);

            return MapToDto(existingExpense);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var expense = await _expenseRepository.GetByIdAsync(id);
            if (expense == null)
            {
                throw new Exception("Expense not found");
            }

            return await _expenseRepository.DeleteAsync(id);
        }

        private ExpenseDto MapToDto(Expense expense)
        {
            return new ExpenseDto
            {
                Id = expense.Id,
                UserId = expense.UserId,
                Title = expense.Title,
                Amount = expense.Amount,
                Notes = expense.Notes,
                BusinessDate = expense.BusinessDate,
                CreatedAt = expense.CreatedAt
            };
        }
    }
}
