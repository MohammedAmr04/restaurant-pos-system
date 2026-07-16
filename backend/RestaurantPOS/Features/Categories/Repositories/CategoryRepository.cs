using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;

namespace RestaurantPOS.Features.Categories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly IDbConnection _connection;

        public CategoryRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<IEnumerable<Category>> GetAllAsync()
        {
            var sql = "SELECT * FROM Categories WHERE DeletedAt IS NULL ORDER BY DisplayOrder, Name";
            return await _connection.QueryAsync<Category>(sql);
        }

        public async Task<Category> GetByIdAsync(int id)
        {
            var sql = "SELECT * FROM Categories WHERE Id = @Id AND DeletedAt IS NULL";
            return await _connection.QueryFirstOrDefaultAsync<Category>(sql, new { Id = id });
        }

        public async Task<Category> GetByNameAsync(string name)
        {
            var sql = "SELECT * FROM Categories WHERE Name = @Name AND DeletedAt IS NULL";
            return await _connection.QueryFirstOrDefaultAsync<Category>(sql, new { Name = name });
        }

        public async Task<int> CreateAsync(Category category)
        {
            var sql = @"INSERT INTO Categories (Name, Image, DisplayOrder, CreatedAt) 
                       VALUES (@Name, @Image, @DisplayOrder, @CreatedAt);
                       SELECT last_insert_rowid();";
            return await _connection.ExecuteScalarAsync<int>(sql, category);
        }

        public async Task<bool> UpdateAsync(Category category)
        {
            var sql = @"UPDATE Categories 
                       SET Name = @Name, Image = @Image, DisplayOrder = @DisplayOrder, UpdatedAt = @UpdatedAt 
                       WHERE Id = @Id";
            var affectedRows = await _connection.ExecuteAsync(sql, category);
            return affectedRows > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var sql = "UPDATE Categories SET DeletedAt = @DeletedAt WHERE Id = @Id";
            var affectedRows = await _connection.ExecuteAsync(sql, new { Id = id, DeletedAt = System.DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") });
            return affectedRows > 0;
        }

        public async Task<bool> HasMenuItemsAsync(int categoryId)
        {
            var sql = "SELECT COUNT(*) FROM MenuItems WHERE CategoryId = @CategoryId AND DeletedAt IS NULL";
            var count = await _connection.ExecuteScalarAsync<int>(sql, new { CategoryId = categoryId });
            return count > 0;
        }
    }
}
