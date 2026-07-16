using System.Threading.Tasks;

namespace RestaurantPOS.Features.Authentication
{
    public interface IAuthService
    {
        Task<LoginResponse> LoginAsync(LoginRequest request);
        Task LogoutAsync(int userId);
    }
}
