using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RestaurantPOS.Features.Tables
{
    public class TableService : ITableService
    {
        private readonly ITableRepository _tableRepository;
        private readonly Orders.IOrderRepository _orderRepository;

        public TableService(ITableRepository tableRepository, Orders.IOrderRepository orderRepository)
        {
            _tableRepository = tableRepository;
            _orderRepository = orderRepository;
        }

        public async Task<IEnumerable<TableDto>> GetAllAsync()
        {
            var tables = await _tableRepository.GetAllAsync();
            return tables.Select(MapToDto);
        }

        public async Task<TableDto> GetByIdAsync(int id)
        {
            var table = await _tableRepository.GetByIdAsync(id);
            if (table == null) return null;
            return MapToDto(table);
        }

        public async Task<TableDto> CreateTableAsync(CreateTableDto dto)
        {
            var existingTable = await _tableRepository.GetByNumberAsync(dto.Number);
            if (existingTable != null)
            {
                throw new Exception("Table number already exists");
            }

            var table = new RestaurantTable
            {
                Number = dto.Number,
                IsOccupied = false,
                CreatedAt = DateTime.Now
            };

            var id = await _tableRepository.CreateAsync(table);
            table.Id = id;

            return MapToDto(table);
        }

        public async Task<TableDto> UpdateTableAsync(int id, UpdateTableDto dto)
        {
            var existingTable = await _tableRepository.GetByIdAsync(id);
            if (existingTable == null)
            {
                throw new Exception("Table not found");
            }

            var duplicateTable = await _tableRepository.GetByNumberAsync(dto.Number);
            if (duplicateTable != null && duplicateTable.Id != id)
            {
                throw new Exception("Table number already exists");
            }

            existingTable.Number = dto.Number;
            existingTable.UpdatedAt = DateTime.Now;

            await _tableRepository.UpdateAsync(existingTable);

            return MapToDto(existingTable);
        }

        public async Task<bool> DeleteTableAsync(int id)
        {
            var table = await _tableRepository.GetByIdAsync(id);
            if (table == null)
            {
                throw new Exception("Table not found");
            }

            var hasActiveOrder = await _tableRepository.HasActiveOrderAsync(id);
            if (hasActiveOrder)
            {
                throw new Exception("Cannot delete table with active order");
            }

            return await _tableRepository.DeleteAsync(id);
        }

        public async Task<bool> MoveOrderAsync(int sourceTableId, int targetTableId)
        {
            var sourceTable = await _tableRepository.GetByIdAsync(sourceTableId);
            if (sourceTable == null)
            {
                throw new Exception("Source table not found");
            }

            var targetTable = await _tableRepository.GetByIdAsync(targetTableId);
            if (targetTable == null)
            {
                throw new Exception("Target table not found");
            }

            var hasActiveOrder = await _tableRepository.HasActiveOrderAsync(targetTableId);
            if (hasActiveOrder)
            {
                throw new Exception("Target table already has an active order");
            }

            var sourceOrders = await _orderRepository.GetAllAsync();
            var activeOrder = sourceOrders.FirstOrDefault(o => o.TableId == sourceTableId && o.Status == "Hold");
            if (activeOrder != null)
            {
                activeOrder.TableId = targetTableId;
                activeOrder.UpdatedAt = DateTime.Now;
                await _orderRepository.UpdateAsync(activeOrder);

                sourceTable.IsOccupied = false;
                sourceTable.UpdatedAt = DateTime.Now;
                await _tableRepository.UpdateAsync(sourceTable);

                targetTable.IsOccupied = true;
                targetTable.UpdatedAt = DateTime.Now;
                await _tableRepository.UpdateAsync(targetTable);
            }

            return true;
        }

        private TableDto MapToDto(RestaurantTable table)
        {
            return new TableDto
            {
                Id = table.Id,
                Number = table.Number,
                IsOccupied = table.IsOccupied
            };
        }
    }
}
