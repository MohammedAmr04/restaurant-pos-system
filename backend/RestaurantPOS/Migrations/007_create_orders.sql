CREATE TABLE IF NOT EXISTS Orders (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    InvoiceNumber TEXT NOT NULL,
    OrderType TEXT NOT NULL,
    Status TEXT NOT NULL DEFAULT 'Hold',
    UserId INTEGER NOT NULL,
    CustomerId INTEGER,
    TableId INTEGER,
    DeliveryRiderId INTEGER,
    Subtotal REAL NOT NULL DEFAULT 0,
    DiscountType TEXT,
    DiscountValue REAL DEFAULT 0,
    ServiceCharge REAL DEFAULT 0,
    Tax REAL DEFAULT 0,
    GrandTotal REAL NOT NULL DEFAULT 0,
    PaymentMethod TEXT,
    PaidAmount REAL DEFAULT 0,
    BusinessDate TEXT NOT NULL,
    CompletedAt TEXT,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT,
    DeletedAt TEXT,
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (CustomerId) REFERENCES Customers(Id),
    FOREIGN KEY (TableId) REFERENCES RestaurantTables(Id),
    FOREIGN KEY (DeliveryRiderId) REFERENCES DeliveryRiders(Id)
);

CREATE INDEX IF NOT EXISTS idx_orders_invoice_number ON Orders(InvoiceNumber);
CREATE INDEX IF NOT EXISTS idx_orders_status ON Orders(Status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON Orders(UserId);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON Orders(CustomerId);
CREATE INDEX IF NOT EXISTS idx_orders_table_id ON Orders(TableId);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_rider_id ON Orders(DeliveryRiderId);
CREATE INDEX IF NOT EXISTS idx_orders_business_date ON Orders(BusinessDate);
CREATE INDEX IF NOT EXISTS idx_orders_order_type ON Orders(OrderType);
