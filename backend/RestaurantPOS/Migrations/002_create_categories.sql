CREATE TABLE IF NOT EXISTS Categories (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL UNIQUE,
    DisplayOrder INTEGER NOT NULL DEFAULT 0,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT,
    DeletedAt TEXT
);

CREATE INDEX IF NOT EXISTS idx_categories_name ON Categories(Name);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON Categories(DisplayOrder);
