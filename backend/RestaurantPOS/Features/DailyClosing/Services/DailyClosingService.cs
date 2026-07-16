using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RestaurantPOS.Features.DailyClosing
{
    public class DailyClosingService : IDailyClosingService
    {
        private readonly IDailyClosingRepository _closingRepository;
        private readonly Orders.IOrderRepository _orderRepository;
        private readonly Expenses.IExpenseRepository _expenseRepository;
        private readonly Returns.IReturnRepository _returnRepository;

        public DailyClosingService(
            IDailyClosingRepository closingRepository,
            Orders.IOrderRepository orderRepository,
            Expenses.IExpenseRepository expenseRepository,
            Returns.IReturnRepository returnRepository)
        {
            _closingRepository = closingRepository;
            _orderRepository = orderRepository;
            _expenseRepository = expenseRepository;
            _returnRepository = returnRepository;
        }

        public async Task<DailyClosingSummaryDto> GetTodaySummaryAsync()
        {
            return await GetSummaryByDateAsync(DateTime.Now.Date);
        }

        public async Task<DailyClosingSummaryDto> GetSummaryByDateAsync(DateTime date)
        {
            var orders = await _orderRepository.GetAllAsync();
            var expenses = await _expenseRepository.GetAllAsync();
            var returns = await _returnRepository.GetAllAsync();

            var dateStr = date.ToString("yyyy-MM-dd");
            var dayOrders = orders.Where(o => o.BusinessDate.ToString("yyyy-MM-dd") == dateStr && o.Status == "Completed");
            var dayExpenses = expenses.Where(e => e.BusinessDate.ToString("yyyy-MM-dd") == dateStr);
            var dayReturns = returns.Where(r => r.CreatedAt.ToString("yyyy-MM-dd") == dateStr);

            var totalSales = dayOrders.Sum(o => o.GrandTotal);
            var totalExpenses = dayExpenses.Sum(e => e.Amount);
            var totalReturns = dayReturns.Sum(r => r.TotalRefund);
            var cashCollected = dayOrders.Where(o => o.PaymentMethod == "Cash").Sum(o => o.PaidAmount);
            var expectedCash = cashCollected - totalExpenses - totalReturns;

            return new DailyClosingSummaryDto
            {
                BusinessDate = date,
                TotalSales = totalSales,
                TotalExpenses = totalExpenses,
                TotalReturns = totalReturns,
                CashCollected = cashCollected,
                ExpectedCash = expectedCash,
                TotalOrders = dayOrders.Count()
            };
        }

        public async Task<DailyClosingDto> CreateAsync(CreateDailyClosingDto dto)
        {
            var summary = await GetTodaySummaryAsync();
            var difference = dto.ActualCash - summary.ExpectedCash;

            var closing = new DailyClosing
            {
                UserId = Shared.AuthHelper.GetCurrentUserId(),
                BusinessDate = DateTime.Now.Date,
                TotalSales = summary.TotalSales,
                TotalExpenses = summary.TotalExpenses,
                TotalReturns = summary.TotalReturns,
                CashCollected = summary.CashCollected,
                ExpectedCash = summary.ExpectedCash,
                ActualCash = dto.ActualCash,
                Difference = difference,
                Notes = dto.Notes,
                CreatedAt = DateTime.Now
            };

            var id = await _closingRepository.CreateAsync(closing);
            closing.Id = id;

            return MapToDto(closing);
        }

        public async Task<DailyClosingDto> GetByDateAsync(DateTime date)
        {
            var closing = await _closingRepository.GetByDateAsync(date);
            if (closing == null) return null;
            return MapToDto(closing);
        }

        public async Task<IEnumerable<DailyClosingDto>> GetAllAsync()
        {
            var closings = await _closingRepository.GetAllAsync();
            return closings.Select(MapToDto);
        }

        private DailyClosingDto MapToDto(DailyClosing closing)
        {
            return new DailyClosingDto
            {
                Id = closing.Id,
                UserId = closing.UserId,
                BusinessDate = closing.BusinessDate,
                TotalSales = closing.TotalSales,
                TotalExpenses = closing.TotalExpenses,
                TotalReturns = closing.TotalReturns,
                CashCollected = closing.CashCollected,
                ExpectedCash = closing.ExpectedCash,
                ActualCash = closing.ActualCash,
                Difference = closing.Difference,
                Notes = closing.Notes,
                CreatedAt = closing.CreatedAt
            };
        }
    }
}
