using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SQLite;
using System.Linq;
using System.Threading.Tasks;
using Dapper;

namespace RestaurantPOS.Shared
{
    public class GenericRepository<T> where T : BaseEntity
    {
        protected readonly DatabaseContext _context;
        protected readonly string _tableName;

        public GenericRepository(DatabaseContext context, string tableName)
        {
            _context = context;
            _tableName = tableName;
        }

        public virtual async Task<T> GetByIdAsync(int id)
        {
            var sql = $"SELECT * FROM {_tableName} WHERE Id = @Id AND DeletedAt IS NULL";
            return await _context.Connection.QueryFirstOrDefaultAsync<T>(sql, new { Id = id });
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            var sql = $"SELECT * FROM {_tableName} WHERE DeletedAt IS NULL";
            return await _context.Connection.QueryAsync<T>(sql);
        }

        public virtual async Task<int> CreateAsync(T entity)
        {
            entity.CreatedAt = DateTime.Now;
            var columns = GetColumnsForInsert();
            var values = GetValuesForInsert(entity);
            var sql = $"INSERT INTO {_tableName} ({columns}) VALUES ({values}); SELECT last_insert_rowid();";
            return await _context.Connection.ExecuteScalarAsync<int>(sql, entity);
        }

        public virtual async Task<bool> UpdateAsync(T entity)
        {
            entity.UpdatedAt = DateTime.Now;
            var setClause = GetSetClause(entity);
            var sql = $"UPDATE {_tableName} SET {setClause} WHERE Id = @Id";
            var affectedRows = await _context.Connection.ExecuteAsync(sql, entity);
            return affectedRows > 0;
        }

        public virtual async Task<bool> SoftDeleteAsync(int id)
        {
            var sql = $"UPDATE {_tableName} SET DeletedAt = @DeletedAt WHERE Id = @Id";
            var affectedRows = await _context.Connection.ExecuteAsync(sql, new { Id = id, DeletedAt = DateTime.Now });
            return affectedRows > 0;
        }

        protected virtual string GetColumnsForInsert()
        {
            return string.Join(", ", typeof(T).GetProperties()
                .Where(p => p.Name != "Id" && p.Name != "CreatedAt" && p.Name != "UpdatedAt" && p.Name != "DeletedAt")
                .Select(p => p.Name));
        }

        protected virtual string GetValuesForInsert(T entity)
        {
            return string.Join(", ", typeof(T).GetProperties()
                .Where(p => p.Name != "Id" && p.Name != "CreatedAt" && p.Name != "UpdatedAt" && p.Name != "DeletedAt")
                .Select(p => $"@{p.Name}"));
        }

        protected virtual string GetSetClause(T entity)
        {
            return string.Join(", ", typeof(T).GetProperties()
                .Where(p => p.Name != "Id" && p.Name != "CreatedAt")
                .Select(p => $"{p.Name} = @{p.Name}"));
        }
    }
}
