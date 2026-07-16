namespace RestaurantPOS.Features.MenuItems
{
    public class MenuItemDto
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Image { get; set; }
        public string Notes { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsAvailable { get; set; }
    }
}
