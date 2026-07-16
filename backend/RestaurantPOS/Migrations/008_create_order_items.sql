CREATE TABLE IF NOT EXISTS OrderItems (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    OrderId INTEGER NOT NULL,
    MenuItemId INTEGER NOT NULL,
    Quantity INTEGER NOT NULL,
    UnitPrice REAL NOT NULL,
    Notes TEXT,
    Total REAL NOT NULL,
    FOREIGN KEY (OrderId) REFERENCES Orders(Id),
    FOREIGN KEY (MenuItemId) REFERENCES MenuItems(Id)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON OrderItems(OrderId);
CREATE INDEX IF NOT EXISTS idx_order_items_menu_item_id ON OrderItems(MenuItemId);
