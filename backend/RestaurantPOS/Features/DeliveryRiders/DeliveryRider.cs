using System;

namespace RestaurantPOS.Features.DeliveryRiders
{
    public class DeliveryRider : Shared.BaseEntity
    {
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Notes { get; set; }
    }
}
