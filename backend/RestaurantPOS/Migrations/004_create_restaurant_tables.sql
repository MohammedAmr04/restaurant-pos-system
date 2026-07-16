CREATE TABLE IF NOT EXISTS RestaurantTables (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Number INTEGER NOT NULL UNIQUE,
    IsOccupied INTEGER NOT NULL DEFAULT 0,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT,
    DeletedAt TEXT
);

CREATE INDEX IF NOT EXISTS idx_restaurant_tables_number ON RestaurantTables(Number);
CREATE INDEX IF NOT EXISTS idx_restaurant_tables_is_occupied ON RestaurantTables(IsOccupied);
