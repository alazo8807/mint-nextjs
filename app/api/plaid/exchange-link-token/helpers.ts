import { PrismaClient } from "@prisma/client/extension";
import { CountryCode, PlaidApi } from "plaid";

export const fetchInstitutionAndAccountInfo = async (accessToken: string, plaidClient: PlaidApi) => {
    try {
        // Get item info, including institution_id
        const itemResponse = await plaidClient.itemGet({ access_token: accessToken });
        const institutionId = itemResponse.data.item.institution_id || "";
        console.log('Institution ID:', institutionId);

        // Get institution metadata (name, etc.)
        const institutionResponse = await plaidClient.institutionsGetById({ 
        institution_id: institutionId, 
        country_codes: [CountryCode.Ca] 
        });
        
        const { name: institutionName } = institutionResponse.data.institution;
        console.log('Institution Name:', institutionName);

        // Get accounts info, including account_ids
        const accountsResponse = await plaidClient.accountsGet({ access_token: accessToken });
        const { accounts } = accountsResponse.data;

        // Return both institution and account info
        return { institutionId, institutionName: institutionName, accounts };
    } catch (error) {
        console.error('Error fetching institution or accounts:', error);
        throw error;
    }
};
  
// export const persistInstitutionAndAccountInfo = async (institutionId: string, institutionName: string, accounts: any[], prisma: PrismaClient) => {
//     try {
//         // Step 1: Persist the institution data in the database
//         const institution = await prisma..upsert({
//         where: { institutionId },
//         update: { institutionName },
//         create: { institutionId, institutionName },
//         });

//         // Step 2: Persist the account data in the database
//         const accountPromises = accounts.map(async (account) => {
//         const { account_id, name, subtype, balances } = account;
//         const currentBalance = balances.current;

//         // Save account info, linking it to the correct institution
//         await prisma.account.upsert({
//             where: { accountId: account_id },
//             update: { name, subtype, currentBalance, institutionId: institution.institutionId },
//             create: {
//             accountId: account_id,
//             name,
//             subtype,
//             currentBalance,
//             institutionId: institution.institutionId,
//             },
//         });
//         });

//         // Wait for all account inserts/updates to complete
//         await Promise.all(accountPromises);

//         console.log('Institution and accounts persisted successfully.');
//     } catch (error) {
//         console.error('Error persisting institution or accounts:', error);
//         throw error;
//     }
// };

// export const handleInstitutionAndAccountData = async (accessToken: string, plaidClient: PlaidApi, prisma: PrismaClient) => {
//     try {
//         // Fetch institution and account info from Plaid
//         const { institutionId, institutionName, accounts } = await fetchInstitutionAndAccountInfo(accessToken, plaidClient);
        
//         // Persist the fetched data in the database
//         await persistInstitutionAndAccountInfo(institutionId, institutionName, accounts, prisma);

//         console.log('Institution and account data processed successfully.');
//     } catch (error) {
//         console.error('Error handling institution and account data:', error);
//     }
// };