CREATE TABLE IF NOT EXISTS Customers (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Phone TEXT UNIQUE,
    Address TEXT,
    Notes TEXT,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT,
    DeletedAt TEXT
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON Customers(Phone);
CREATE INDEX IF NOT EXISTS idx_customers_name ON Customers(Name);
