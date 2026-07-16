using System;

namespace RestaurantPOS.Features.Customers
{
    public class Customer : Shared.BaseEntity
    {
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Notes { get; set; }
    }
}
