CREATE VIEW accountInformationView AS
SELECT 
    Account.accountId,
    Account.name AS accountName,
    Account.institutionId,
    Institution.institutionName
FROM 
    Account
JOIN 
    Institution ON Account.institutionId = Institution.institutionId;
