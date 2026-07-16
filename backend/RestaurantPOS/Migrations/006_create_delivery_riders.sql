CREATE TABLE IF NOT EXISTS DeliveryRiders (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Phone TEXT NOT NULL,
    Notes TEXT,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT,
    DeletedAt TEXT
);

CREATE INDEX IF NOT EXISTS idx_delivery_riders_phone ON DeliveryRiders(Phone);
CREATE INDEX IF NOT EXISTS idx_delivery_riders_name ON DeliveryRiders(Name);
