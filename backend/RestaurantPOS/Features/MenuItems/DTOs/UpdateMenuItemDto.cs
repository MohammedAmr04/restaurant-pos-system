namespace RestaurantPOS.Features.MenuItems
{
    public class UpdateMenuItemDto
    {
        public int CategoryId { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Image { get; set; }
        public string Notes { get; set; }
        public int DisplayOrder { get; set; }
    }
}
