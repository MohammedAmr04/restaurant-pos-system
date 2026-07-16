using FluentValidation;

namespace RestaurantPOS.Features.Tables
{
    public class CreateTableValidator : AbstractValidator<CreateTableDto>
    {
        public CreateTableValidator()
        {
            RuleFor(x => x.Number)
                .GreaterThan(0).WithMessage("Table number must be greater than zero");
        }
    }
}
