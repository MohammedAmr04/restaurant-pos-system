using System.Threading.Tasks;
using RestaurantPOS.Shared;

namespace RestaurantPOS.Features.Authentication
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;

        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            var user = await _userRepository.GetByUsernameAsync(request.Username);

            if (user == null || !user.IsActive)
            {
                return null;
            }

            if (!PasswordHasher.VerifyPassword(request.Password, user.PasswordHash))
            {
                return null;
            }

            var token = AuthHelper.GenerateToken(user.Id, user.Username);

            return new LoginResponse
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    FullName = user.FullName
                }
            };
        }

        public async Task LogoutAsync(int userId)
        {
            await Task.CompletedTask;
        }
    }
}
