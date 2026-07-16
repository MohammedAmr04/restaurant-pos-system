CREATE TABLE IF NOT EXISTS ReturnItems (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    ReturnId INTEGER NOT NULL,
    OrderItemId INTEGER NOT NULL,
    Quantity INTEGER NOT NULL,
    RefundAmount REAL NOT NULL,
    FOREIGN KEY (ReturnId) REFERENCES Returns(Id),
    FOREIGN KEY (OrderItemId) REFERENCES OrderItems(Id)
);

CREATE INDEX IF NOT EXISTS idx_return_items_return_id ON ReturnItems(ReturnId);
CREATE INDEX IF NOT EXISTS idx_return_items_order_item_id ON ReturnItems(OrderItemId);
