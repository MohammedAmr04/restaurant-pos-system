using FluentValidation;

namespace RestaurantPOS.Features.Authentication
{
    public class LoginValidator : AbstractValidator<LoginRequest>
    {
        public LoginValidator()
        {
            RuleFor(x => x.Username)
                .NotEmpty().WithMessage("اسم المستخدم مطلوب")
                .MaximumLength(50).WithMessage("اسم المستخدم يجب ألا يتجاوز 50 حرفاً");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("كلمة المرور مطلوبة")
                .MinimumLength(4).WithMessage("كلمة المرور يجب أن تكون 4 أحرف على الأقل");
        }
    }
}
