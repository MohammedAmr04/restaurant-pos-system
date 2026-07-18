using System.Data;
using System.Threading.Tasks;
using System.Web.Http;
using FluentValidation;
using RestaurantPOS.Features.Authentication.Services;
using RestaurantPOS.Shared;

namespace RestaurantPOS.Features.Authentication.Controllers
{
    [RoutePrefix("api/v1/auth")]
    public class AuthController : ApiController
    {
        private readonly IAuthService _authService;
        private readonly AuditLogService _auditLogService;

        public AuthController(IAuthService authService, AuditLogService auditLogService)
        {
            _authService = authService;
            _auditLogService = auditLogService;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IHttpActionResult> Login([FromBody] LoginRequest request)
        {
            if (request == null)
            {
                return BadRequest("طلب تسجيل الدخول مطلوب");
            }

            var validator = new LoginValidator();
            var validationResult = await validator.ValidateAsync(request);

            if (!validationResult.IsValid)
            {
                var errors = new System.Collections.Generic.List<string>();
                foreach (var error in validationResult.Errors)
                {
                    errors.Add(error.ErrorMessage);
                }
                return Ok(ApiResponse.Fail("Validation failed", errors));
            }

            var result = await _authService.LoginAsync(request);

            if (result == null)
            {
                return Ok(ApiResponse.Fail("اسم المستخدم أو كلمة المرور غير صحيحة"));
            }

            await _auditLogService.LogAsync(result.User.Id, "Login", "User", result.User.Id, $"User {result.User.Username} logged in");

            return Ok(ApiResponse<LoginResponse>.Ok(result, "Login successful"));
        }

        [HttpPost]
        [Route("logout")]
        public async Task<IHttpActionResult> Logout()
        {
            var userId = AuthHelper.GetCurrentUserId();
            if (userId > 0)
            {
                await _auditLogService.LogAsync(userId, "Logout", "User", userId, "User logged out");
            }

            return Ok(ApiResponse.Ok("Logout successful"));
        }
    }
}
