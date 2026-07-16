CREATE TABLE IF NOT EXISTS DailyClosings (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    UserId INTEGER NOT NULL,
    BusinessDate TEXT NOT NULL,
    TotalSales REAL NOT NULL DEFAULT 0,
    TotalExpenses REAL NOT NULL DEFAULT 0,
    TotalReturns REAL NOT NULL DEFAULT 0,
    CashCollected REAL NOT NULL DEFAULT 0,
    ExpectedCash REAL NOT NULL DEFAULT 0,
    ActualCash REAL NOT NULL DEFAULT 0,
    Difference REAL NOT NULL DEFAULT 0,
    Notes TEXT,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT,
    DeletedAt TEXT,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE INDEX IF NOT EXISTS idx_daily_closings_user_id ON DailyClosings(UserId);
CREATE INDEX IF NOT EXISTS idx_daily_closings_business_date ON DailyClosings(BusinessDate);
