using System.Collections.Generic;

namespace RestaurantPOS.Features.Returns
{
    public class CreateReturnDto
    {
        public int OrderId { get; set; }
        public string Reason { get; set; }
        public List<ReturnItemDto> Items { get; set; }
    }
}
