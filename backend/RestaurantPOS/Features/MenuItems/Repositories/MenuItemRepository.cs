using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;

namespace RestaurantPOS.Features.MenuItems
{
    public class MenuItemRepository : IMenuItemRepository
    {
        private readonly IDbConnection _connection;

        public MenuItemRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<IEnumerable<MenuItem>> GetAllAsync()
        {
            var sql = "SELECT * FROM MenuItems WHERE DeletedAt IS NULL ORDER BY DisplayOrder, Name";
            return await _connection.QueryAsync<MenuItem>(sql);
        }

        public async Task<MenuItem> GetByIdAsync(int id)
        {
            var sql = "SELECT * FROM MenuItems WHERE Id = @Id AND DeletedAt IS NULL";
            return await _connection.QueryFirstOrDefaultAsync<MenuItem>(sql, new { Id = id });
        }

        public async Task<MenuItem> GetByNameAndCategoryAsync(string name, int categoryId)
        {
            var sql = "SELECT * FROM MenuItems WHERE Name = @Name AND CategoryId = @CategoryId AND DeletedAt IS NULL";
            return await _connection.QueryFirstOrDefaultAsync<MenuItem>(sql, new { Name = name, CategoryId = categoryId });
        }

        public async Task<int> CreateAsync(MenuItem menuItem)
        {
            var sql = @"INSERT INTO MenuItems (CategoryId, Name, Price, Image, Notes, DisplayOrder, IsAvailable, CreatedAt) 
                       VALUES (@CategoryId, @Name, @Price, @Image, @Notes, @DisplayOrder, @IsAvailable, @CreatedAt);
                       SELECT last_insert_rowid();";
            return await _connection.ExecuteScalarAsync<int>(sql, menuItem);
        }

        public async Task<bool> UpdateAsync(MenuItem menuItem)
        {
            var sql = @"UPDATE MenuItems 
                       SET CategoryId = @CategoryId, Name = @Name, Price = @Price, Image = @Image, 
                           Notes = @Notes, DisplayOrder = @DisplayOrder, IsAvailable = @IsAvailable, UpdatedAt = @UpdatedAt 
                       WHERE Id = @Id";
            var affectedRows = await _connection.ExecuteAsync(sql, menuItem);
            return affectedRows > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var sql = "UPDATE MenuItems SET DeletedAt = @DeletedAt WHERE Id = @Id";
            var affectedRows = await _connection.ExecuteAsync(sql, new { Id = id, DeletedAt = System.DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") });
            return affectedRows > 0;
        }
    }
}
