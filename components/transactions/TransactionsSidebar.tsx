'use client'

import { ChevronDown, ChevronRight, CreditCard, Wallet, LineChart, Landmark, Building } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Transaction, Account } from "@/lib/types";

interface InstitutionAccounts {
  id: string
  name: string
  icon: React.ReactNode
  types: { [type: string]: string }[]
  accounts: Account[]
}

interface TransactionSidebarProps {
  selectedAccounts: string[]
  selectedTypes: string[]
  onAccountChange: (accountId: string) => void
  onTypeChange: (typeId: string) => void
}

export function TransactionSidebar({
  selectedAccounts,
  selectedTypes,
  onAccountChange,
  onTypeChange
}: TransactionSidebarProps) {
  const [isTypesOpen, setIsTypesOpen] = useState(true);
  const [isAccountsOpen, setIsAccountsOpen] = useState(true);
  const [accounts, setAccounts] = useState<InstitutionAccounts[]>([]);

//   const accountTypes: AccountType[] = [
//     {
//       id: 'cash-credit',
//       name: 'Cash & Credit',
//       icon: <CreditCard className="h-4 w-4" />,
//       accounts: [
//         { id: 'checking', name: 'Checking Account', type: 'cash-credit', bank: 'Bank of America' },
//         { id: 'savings', name: 'Savings Account', type: 'cash-credit', bank: 'Wells Fargo' },
//         { id: 'credit-card', name: 'Credit Card', type: 'cash-credit', bank: 'Chase' },
//       ]
//     },
//     {
//       id: 'investment',
//       name: 'Investment',
//       icon: <LineChart className="h-4 w-4" />,
//       accounts: [
//         { id: 'brokerage', name: 'Brokerage Account', type: 'investment', bank: 'Fidelity' },
//         { id: 'ira', name: '401(k)', type: 'investment', bank: 'Vanguard' },
//       ]
//     },
//     {
//       id: 'loan',
//       name: 'Loans',
//       icon: <Building className="h-4 w-4" />,
//       accounts: [
//         { id: 'mortgage', name: 'Mortgage', type: 'loan', bank: 'Quicken Loans' },
//         { id: 'student-loan', name: 'Student Loan', type: 'loan', bank: 'Sallie Mae' },
//       ]
//     },
//   ]


  // Fetch institutions and accounts data from the API
  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        
        // Fetch institutions
        const institutionResponse = await fetch('/api/institution');
        const institutions = await institutionResponse.json();

        // Map institutions to the account types structure
        const mappedAccount = await Promise.all(
          institutions.map(async (institution: any) => {
            const institutionId = institution.institutionId;

            // Fetch accounts for each institution
            const accountsResponse = await fetch(`/api/account?institutionId=${institutionId}`);
            const accounts = await accountsResponse.json();

            // Extract unique account types
            const uniqueTypes = Array.from(
                new Set(accounts.map((account: any) => account.subtype))
            );

            return {
              institutionId: institution.institutionId,
              name: institution.institutionName,
            //   icon: <Building className="h-4 w-4" />, // Placeholder icon
              types: uniqueTypes.map((type) => ({ type })),
              accounts: accounts.map((account: any) => ({
                id: account.accountId,
                name: account.name,
                type: account.subtype,
                bank: institution.institutionName,
              })),
            };
          })
        );

        setAccounts(mappedAccount);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      }
    };

    fetchTransactionData();
  }, []);

  return (
    <div className="w-full sm:w-64 bg-white shadow rounded-lg py-6 p-4 mb-4 sm:mb-0 sm:mr-4 text-gray-700">
      {/* Types Section */}
      <div className="mb-6">
        <button
          onClick={() => setIsTypesOpen(!isTypesOpen)}
          className="flex items-center justify-between w-full text-left mb-2"
        >
          <span className="text-sm font-semibold text-gray-900">Type</span>
          {isTypesOpen ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )}
        </button>
        {isTypesOpen && (
          <div className="space-y-2">
            {accounts.map((account) => 
                account.types.map((type) => (
                    <button
                key={type.type}
                onClick={() => onTypeChange(type.type)}
                className={`w-full text-left px-2 py-1 rounded-md transition-colors ${
                  selectedTypes.includes(type.type)
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center space-x-2 text-sm">
                  {/* {institution.icon} */}
                  <span>{type.type}</span>
                </span>
              </button>)
            ))}
          </div>
        )}
      </div>

      {/* Accounts Section */}
      <div>
        <button
          onClick={() => setIsAccountsOpen(!isAccountsOpen)}
          className="flex items-center justify-between w-full text-left mb-2"
        >
          <span className="text-sm font-semibold text-gray-900">Accounts</span>
          {isAccountsOpen ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )}
        </button>
        {isAccountsOpen && (
          <div className="space-y-2">
            {accounts.map((institution) =>
              institution.accounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => onAccountChange(account.id)}
                  className={`w-full text-left px-2 py-1 rounded-md transition-colors ${
                    selectedAccounts.includes(account.id)
                      ? 'bg-blue-100 text-blue-800'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{account.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{account.bank}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

