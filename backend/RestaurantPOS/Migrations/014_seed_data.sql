INSERT OR IGNORE INTO Users (Username, PasswordHash, FullName, IsActive, CreatedAt)
VALUES ('admin', 'e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7', 'Administrator', 1, datetime('now'));

INSERT OR IGNORE INTO Settings (RestaurantName, Phone, Address, TaxEnabled, TaxPercentage, ServiceChargeEnabled, ServiceChargePercentage, ReceiptHeader, ReceiptFooter, CreatedAt)
SELECT 'My Restaurant', '0123456789', '123 Main Street', 0, 0, 0, 0, 'Thank you for dining with us', 'We appreciate your visit!', datetime('now')
WHERE NOT EXISTS (SELECT 1 FROM Settings);
