ALTER TABLE Settings ADD COLUMN ShiftStart TEXT DEFAULT '11:00';
ALTER TABLE Settings ADD COLUMN ShiftEnd TEXT DEFAULT '03:00';
UPDATE Settings SET ShiftStart = '11:00', ShiftEnd = '03:00' WHERE Id = 1;

UPDATE Orders SET BusinessDate = date(CreatedAt) WHERE time(CreatedAt) >= '11:00';
UPDATE Orders SET BusinessDate = date(CreatedAt, '-1 day') WHERE time(CreatedAt) < '11:00';

UPDATE Expenses SET BusinessDate = date(CreatedAt) WHERE time(CreatedAt) >= '11:00';
UPDATE Expenses SET BusinessDate = date(CreatedAt, '-1 day') WHERE time(CreatedAt) < '11:00';
