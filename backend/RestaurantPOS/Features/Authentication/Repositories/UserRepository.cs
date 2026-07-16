using System.Data;
using System.Threading.Tasks;
using Dapper;

namespace RestaurantPOS.Features.Authentication
{
    public class UserRepository : IUserRepository
    {
        private readonly IDbConnection _connection;

        public UserRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<User> GetByUsernameAsync(string username)
        {
            var sql = "SELECT * FROM Users WHERE Username = @Username AND DeletedAt IS NULL";
            return await _connection.QueryFirstOrDefaultAsync<User>(sql, new { Username = username });
        }

        public async Task<User> GetByIdAsync(int id)
        {
            var sql = "SELECT * FROM Users WHERE Id = @Id AND DeletedAt IS NULL";
            return await _connection.QueryFirstOrDefaultAsync<User>(sql, new { Id = id });
        }
    }
}
