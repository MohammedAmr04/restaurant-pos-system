using FluentValidation;

namespace RestaurantPOS.Features.Tables
{
    public class UpdateTableValidator : AbstractValidator<UpdateTableDto>
    {
        public UpdateTableValidator()
        {
            RuleFor(x => x.Number)
                .GreaterThan(0).WithMessage("Table number must be greater than zero");
        }
    }
}
