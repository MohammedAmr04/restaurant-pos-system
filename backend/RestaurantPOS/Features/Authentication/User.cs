using System;

namespace RestaurantPOS.Features.Authentication
{
    public class User : Shared.BaseEntity
    {
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string FullName { get; set; }
        public bool IsActive { get; set; }
    }
}
