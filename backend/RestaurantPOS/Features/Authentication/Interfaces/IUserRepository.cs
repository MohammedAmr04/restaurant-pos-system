using System.Threading.Tasks;

namespace RestaurantPOS.Features.Authentication
{
    public interface IUserRepository
    {
        Task<User> GetByUsernameAsync(string username);
        Task<User> GetByIdAsync(int id);
    }
}
