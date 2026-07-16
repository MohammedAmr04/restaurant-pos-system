using System.Data;
using System.Data.SQLite;
using Unity;
using Unity.Injection;
using Unity.Lifetime;

namespace RestaurantPOS.Shared
{
    public static class DependencyConfig
    {
        public static void RegisterDependencies(IUnityContainer container)
        {
            container.RegisterType<DatabaseContext>(new PerResolveLifetimeManager());
            container.RegisterType<IDbConnection>(new PerResolveLifetimeManager(),
                new InjectionFactory(c => new SQLiteConnection("Data Source=restaurant-pos.db;Version=3;")));

            container.RegisterType<Features.Authentication.IUserRepository, Features.Authentication.UserRepository>();
            container.RegisterType<Features.Authentication.IAuthService, Features.Authentication.AuthService>();
            container.RegisterType<Features.Authentication.Services.AuditLogService>();

            container.RegisterType<Features.Categories.ICategoryRepository, Features.Categories.CategoryRepository>();
            container.RegisterType<Features.Categories.ICategoryService, Features.Categories.CategoryService>();

            container.RegisterType<Features.MenuItems.IMenuItemRepository, Features.MenuItems.MenuItemRepository>();
            container.RegisterType<Features.MenuItems.IMenuItemService, Features.MenuItems.MenuItemService>();

            container.RegisterType<Features.Tables.ITableRepository, Features.Tables.TableRepository>();
            container.RegisterType<Features.Tables.ITableService, Features.Tables.TableService>();

            container.RegisterType<Features.Customers.ICustomerRepository, Features.Customers.CustomerRepository>();
            container.RegisterType<Features.Customers.ICustomerService, Features.Customers.CustomerService>();

            container.RegisterType<Features.DeliveryRiders.IDeliveryRiderRepository, Features.DeliveryRiders.DeliveryRiderRepository>();
            container.RegisterType<Features.DeliveryRiders.IDeliveryRiderService, Features.DeliveryRiders.DeliveryRiderService>();

            container.RegisterType<Features.Orders.IOrderRepository, Features.Orders.OrderRepository>();
            container.RegisterType<Features.Orders.IOrderItemRepository, Features.Orders.OrderItemRepository>();
            container.RegisterType<Features.Orders.IOrderService, Features.Orders.OrderService>();

            container.RegisterType<Features.Settings.ISettingsRepository, Features.Settings.SettingsRepository>();
            container.RegisterType<Features.Settings.ISettingsService, Features.Settings.SettingsService>();

            container.RegisterType<Features.Returns.IReturnRepository, Features.Returns.ReturnRepository>();
            container.RegisterType<Features.Returns.IReturnItemRepository, Features.Returns.ReturnItemRepository>();
            container.RegisterType<Features.Returns.IReturnService, Features.Returns.ReturnService>();

            container.RegisterType<Features.Expenses.IExpenseRepository, Features.Expenses.ExpenseRepository>();
            container.RegisterType<Features.Expenses.IExpenseService, Features.Expenses.ExpenseService>();

            container.RegisterType<Features.Reports.IReportsService, Features.Reports.ReportsService>();

            container.RegisterType<Features.AuditLogs.AuditLogRepository>();
            container.RegisterType<Features.AuditLogs.IAuditLogService, Features.AuditLogs.AuditLogService>();

            container.RegisterType<Features.DailyClosing.IDailyClosingRepository, Features.DailyClosing.DailyClosingRepository>();
            container.RegisterType<Features.DailyClosing.IDailyClosingService, Features.DailyClosing.DailyClosingService>();

            container.RegisterType<Features.Printing.IPrinterService, Features.Printing.PrinterService>();
        }
    }
}
