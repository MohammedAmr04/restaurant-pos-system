using System;
using System.IO;
using System.Data.SQLite;
using Dapper;
using Serilog;

namespace RestaurantPOS.Shared
{
    public static class DatabaseMigration
    {
        private static readonly string[] Migrations = new[]
        {
            "Migrations/001_create_users.sql",
            "Migrations/002_create_categories.sql",
            "Migrations/003_create_menu_items.sql",
            "Migrations/004_create_restaurant_tables.sql",
            "Migrations/005_create_customers.sql",
            "Migrations/006_create_delivery_riders.sql",
            "Migrations/007_create_orders.sql",
            "Migrations/008_create_order_items.sql",
            "Migrations/009_create_returns.sql",
            "Migrations/010_create_return_items.sql",
            "Migrations/011_create_expenses.sql",
            "Migrations/012_create_audit_logs.sql",
            "Migrations/013_create_settings.sql",
            "Migrations/014_seed_data.sql",
            "Migrations/015_create_daily_closings.sql",
            "Migrations/016_add_printer_settings.sql",
            "Migrations/017_add_category_image.sql",
            "Migrations/018_update_default_printer.sql",
            "Migrations/019_add_phone2.sql",
            "Migrations/020_update_admin_password.sql",
        };

        public static void RunMigrations()
        {
            var connectionString = "Data Source=restaurant-pos.db;Version=3;";

            using (var connection = new SQLiteConnection(connectionString))
            {
                connection.Open();

                RunSqlFile(connection, "Migrations/000_create_migration_history.sql");
                SeedExistingMigrations(connection);

                foreach (var migration in Migrations)
                {
                    if (!IsApplied(connection, migration))
                    {
                        RunSqlFile(connection, migration);
                        RecordApplied(connection, migration);
                    }
                }

                Log.Information("Database migrations completed successfully");
            }
        }

        private static void SeedExistingMigrations(SQLiteConnection connection)
        {
            var count = connection.ExecuteScalar<int>("SELECT COUNT(*) FROM __MigrationHistory");
            if (count > 0) return;

            var tablesExist = connection.ExecuteScalar<int>(
                "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='Users'") > 0;
            if (!tablesExist)
            {
                Log.Information("Fresh database detected — will run all migrations");
                return;
            }

            var now = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            foreach (var migration in Migrations)
            {
                connection.Execute(
                    "INSERT OR IGNORE INTO __MigrationHistory (MigrationName, AppliedAt) VALUES (@Name, @AppliedAt)",
                    new { Name = migration, AppliedAt = now });
            }
            Log.Information("Seeded migration history for {Count} existing migrations (pre-existing database)", Migrations.Length);
        }

        private static bool IsApplied(SQLiteConnection connection, string migrationName)
        {
            return connection.ExecuteScalar<int>(
                "SELECT COUNT(*) FROM __MigrationHistory WHERE MigrationName = @Name",
                new { Name = migrationName }) > 0;
        }

        private static void RecordApplied(SQLiteConnection connection, string migrationName)
        {
            connection.Execute(
                "INSERT INTO __MigrationHistory (MigrationName, AppliedAt) VALUES (@Name, @AppliedAt)",
                new { Name = migrationName, AppliedAt = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") });
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

            Log.Information("Migration executed: {FilePath}", filePath);
        }
    }
}
