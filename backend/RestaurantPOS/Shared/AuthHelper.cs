using System;
using System.Data;
using System.Data.SQLite;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Web;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace RestaurantPOS.Shared
{
    public static class AuthHelper
    {
        private const string SecretKey = "RestaurantPOSSecretKey2024!@#$%^&*()_+ThisIsAVeryLongSecretKeyForJWT";
        private const string Issuer = "RestaurantPOS";
        private const string Audience = "RestaurantPOS";
        private const int ExpirationMinutes = 480;

        public static string GetSecretKey() => SecretKey;
        public static string GetIssuer() => Issuer;
        public static string GetAudience() => Audience;

        public static string GenerateToken(int userId, string username)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Name, username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: Issuer,
                audience: Audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(ExpirationMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public static int GetCurrentUserId()
        {
            var identity = Thread.CurrentPrincipal?.Identity as ClaimsIdentity;
            if (identity == null) return 0;

            var claim = identity.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null) return 0;

            return int.Parse(claim.Value);
        }

        public static string GetCurrentUsername()
        {
            var identity = Thread.CurrentPrincipal?.Identity as ClaimsIdentity;
            if (identity == null) return string.Empty;

            var claim = identity.FindFirst(ClaimTypes.Name);
            return claim?.Value ?? string.Empty;
        }
    }
}
