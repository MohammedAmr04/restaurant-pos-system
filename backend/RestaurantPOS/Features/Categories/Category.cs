using System;

namespace RestaurantPOS.Features.Categories
{
    public class Category : Shared.BaseEntity
    {
        public string Name { get; set; }
        public string Image { get; set; }
        public int DisplayOrder { get; set; }
    }
}
