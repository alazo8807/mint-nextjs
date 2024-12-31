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
  