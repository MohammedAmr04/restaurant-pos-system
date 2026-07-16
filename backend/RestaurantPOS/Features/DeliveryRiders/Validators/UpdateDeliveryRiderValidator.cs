using FluentValidation;

namespace RestaurantPOS.Features.DeliveryRiders
{
    public class UpdateDeliveryRiderValidator : AbstractValidator<UpdateDeliveryRiderDto>
    {
        public UpdateDeliveryRiderValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Rider name is required")
                .MaximumLength(100).WithMessage("Rider name must not exceed 100 characters");

            RuleFor(x => x.Phone)
                .NotEmpty().WithMessage("Phone number is required")
                .MaximumLength(20).WithMessage("Phone number must not exceed 20 characters");
        }
    }
}
