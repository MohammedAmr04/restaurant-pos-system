using System;

namespace RestaurantPOS.Features.Tables
{
    public class RestaurantTable : Shared.BaseEntity
    {
        public int Number { get; set; }
        public bool IsOccupied { get; set; }
    }
}
