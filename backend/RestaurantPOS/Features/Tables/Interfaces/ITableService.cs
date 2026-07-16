using System.Collections.Generic;
using System.Threading.Tasks;

namespace RestaurantPOS.Features.Tables
{
    public interface ITableService
    {
        Task<IEnumerable<TableDto>> GetAllAsync();
        Task<TableDto> GetByIdAsync(int id);
        Task<TableDto> CreateTableAsync(CreateTableDto dto);
        Task<TableDto> UpdateTableAsync(int id, UpdateTableDto dto);
        Task<bool> DeleteTableAsync(int id);
        Task<bool> MoveOrderAsync(int sourceTableId, int targetTableId);
    }
}
