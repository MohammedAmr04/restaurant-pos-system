CREATE TABLE IF NOT EXISTS Settings (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    RestaurantName TEXT NOT NULL DEFAULT 'Restaurant',
    Phone TEXT,
    Address TEXT,
    Logo TEXT,
    TaxEnabled INTEGER NOT NULL DEFAULT 0,
    TaxPercentage REAL NOT NULL DEFAULT 0,
    ServiceChargeEnabled INTEGER NOT NULL DEFAULT 0,
    ServiceChargePercentage REAL NOT NULL DEFAULT 0,
    ReceiptHeader TEXT,
    ReceiptFooter TEXT,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT,
    DeletedAt TEXT
);
