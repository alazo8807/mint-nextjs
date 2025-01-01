-- Drop the old view (if it exists)
DROP VIEW IF EXISTS accountInformationView;

-- Create the modified view
CREATE VIEW accountInformationView AS
SELECT 
    Account.accountId,
    Account.name AS accountName,
    Account.institutionId,
    Institution.institutionName
FROM 
    Account
JOIN 
    Institution ON Account.institutionId = Institution.institutionId
INNER JOIN
    (SELECT DISTINCT "Transaction".accountId FROM "Transaction") AS transactionAccountIds 
    ON transactionAccountIds.accountId = Account.accountId;