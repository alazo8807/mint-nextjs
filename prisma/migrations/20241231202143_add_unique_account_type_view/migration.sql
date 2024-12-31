CREATE VIEW uniqueAccountTypes AS
SELECT DISTINCT subtype AS accountType
FROM Account;