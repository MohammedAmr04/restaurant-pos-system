CREATE TABLE IF NOT EXISTS MenuItems (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    CategoryId INTEGER NOT NULL,
    Name TEXT NOT NULL,
    Price REAL NOT NULL,
    Image TEXT,
    Notes TEXT,
    DisplayOrder INTEGER NOT NULL DEFAULT 0,
    IsAvailable INTEGER NOT NULL DEFAULT 1,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT,
    DeletedAt TEXT,
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
);

CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON MenuItems(CategoryId);
CREATE INDEX IF NOT EXISTS idx_menu_items_name ON MenuItems(Name);
CREATE INDEX IF NOT EXISTS idx_menu_items_is_available ON MenuItems(IsAvailable);
