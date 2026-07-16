CREATE TABLE IF NOT EXISTS AuditLogs (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    UserId INTEGER,
    Action TEXT NOT NULL,
    Entity TEXT NOT NULL,
    EntityId INTEGER,
    Details TEXT,
    CreatedAt TEXT NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON AuditLogs(UserId);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON AuditLogs(Action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON AuditLogs(Entity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON AuditLogs(CreatedAt);
