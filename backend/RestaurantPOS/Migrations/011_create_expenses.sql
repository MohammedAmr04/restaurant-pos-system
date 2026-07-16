CREATE TABLE IF NOT EXISTS Expenses (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    UserId INTEGER NOT NULL,
    Title TEXT NOT NULL,
    Amount REAL NOT NULL,
    Notes TEXT,
    BusinessDate TEXT NOT NULL,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT,
    DeletedAt TEXT,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON Expenses(UserId);
CREATE INDEX IF NOT EXISTS idx_expenses_business_date ON Expenses(BusinessDate);
CREATE INDEX IF NOT EXISTS idx_expenses_title ON Expenses(Title);
