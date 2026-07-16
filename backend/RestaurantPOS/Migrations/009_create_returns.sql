CREATE TABLE IF NOT EXISTS Returns (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    OrderId INTEGER NOT NULL,
    UserId INTEGER NOT NULL,
    TotalRefund REAL NOT NULL,
    Reason TEXT,
    CreatedAt TEXT NOT NULL,
    FOREIGN KEY (OrderId) REFERENCES Orders(Id),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE INDEX IF NOT EXISTS idx_returns_order_id ON Returns(OrderId);
CREATE INDEX IF NOT EXISTS idx_returns_user_id ON Returns(UserId);
CREATE INDEX IF NOT EXISTS idx_returns_created_at ON Returns(CreatedAt);
