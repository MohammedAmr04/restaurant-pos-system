using FluentValidation;

namespace RestaurantPOS.Features.MenuItems
{
    public class UpdateMenuItemValidator : AbstractValidator<UpdateMenuItemDto>
    {
        public UpdateMenuItemValidator()
        {
            RuleFor(x => x.CategoryId)
                .GreaterThan(0).WithMessage("Category is required");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Menu item name is required")
                .MaximumLength(100).WithMessage("Menu item name must not exceed 100 characters");

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Price must be greater than zero");
        }
    }
}
