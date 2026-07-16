using System;
using System.IO;
using System.Data.SQLite;
using Dapper;
using Serilog;

namespace RestaurantPOS.Shared
{
    public static class DatabaseMigration
    {
        public static void RunMigrations()
        {
            var connectionString = "Data Source=restaurant-pos.db;Version=3;";

            using (var connection = new SQLiteConnection(connectionString))
            {
                connection.Open();

                RunSqlFile(connection, "Migrations/001_create_users.sql");
                RunSqlFile(connection, "Migrations/002_create_categories.sql");
                RunSqlFile(connection, "Migrations/003_create_menu_items.sql");
                RunSqlFile(connection, "Migrations/004_create_restaurant_tables.sql");
                RunSqlFile(connection, "Migrations/005_create_customers.sql");
                RunSqlFile(connection, "Migrations/006_create_delivery_riders.sql");
                RunSqlFile(connection, "Migrations/007_create_orders.sql");
                RunSqlFile(connection, "Migrations/008_create_order_items.sql");
                RunSqlFile(connection, "Migrations/009_create_returns.sql");
                RunSqlFile(connection, "Migrations/010_create_return_items.sql");
                RunSqlFile(connection, "Migrations/011_create_expenses.sql");
                RunSqlFile(connection, "Migrations/012_create_audit_logs.sql");
                RunSqlFile(connection, "Migrations/013_create_settings.sql");
                RunSqlFile(connection, "Migrations/014_seed_data.sql");
                RunSqlFile(connection, "Migrations/015_create_daily_closings.sql");
                RunSqlFile(connection, "Migrations/016_add_printer_settings.sql");
                RunSqlFile(connection, "Migrations/017_add_category_image.sql");

                Log.Information("Database migrations completed successfully");
            }
        }

        private static void RunSqlFile(SQLiteConnection connection, string filePath)
        {
            if (!File.Exists(filePath))
            {
                Log.Warning("Migration file not found: {FilePath}", filePath);
                return;
            }

            var sql = File.ReadAllText(filePath);
            var commands = sql.Split(new[] { ";" }, StringSplitOptions.RemoveEmptyEntries);

            foreach (var command in commands)
            {
                var trimmedCommand = command.Trim();
                if (!string.IsNullOrEmpty(trimmedCommand))
                {
                    try
                    {
                        using (var cmd = new SQLiteCommand(trimmedCommand, connection))
                        {
                            cmd.ExecuteNonQuery();
                        }
                    }
                    catch (Exception ex)
                    {
                        Log.Warning("Migration command failed: {Error}", ex.Message);
                    }
                }
            }

            Log.Information("Migration completed: {FilePath}", filePath);
        }
    }
}
