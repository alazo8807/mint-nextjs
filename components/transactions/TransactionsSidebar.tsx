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

type AccountType = {
  accountType: string;
}

interface AccountInfo {
  accountId: string;
  accountName: string;
  institutionId: string;
  institutionName: string;
}

export function TransactionSidebar({
  selectedAccounts,
  selectedTypes,
  onAccountChange,
  onTypeChange
}: TransactionSidebarProps) {
  const [isTypesOpen, setIsTypesOpen] = useState(true);
  const [isAccountsOpen, setIsAccountsOpen] = useState(true);
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);
  const [accountInfo, setAccountInfo] = useState<AccountInfo[]>([]);
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
        // Fetch account types
        const accountTypesResponse = await fetch('/api/account/types');
        const accountTypesData: AccountType[] = await accountTypesResponse.json();
        setAccountTypes(accountTypesData);

        // Fetch accounts info
        const accountInfoResponse = await fetch('/api/account/info');
        const accountInfoData: AccountInfo[] = await accountInfoResponse.json();
        setAccountInfo(accountInfoData);
        console.log({accountInfoData: accountInfoData});
      } catch (error) {
        console.error('Error fetching accounts data:', error);
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
            {accountTypes.length > 0 && accountTypes.map((type) => (
              <button
                key={type.accountType}
                onClick={() => onTypeChange(type.accountType)}
                className={`w-full text-left px-2 py-1 rounded-md transition-colors ${
                  selectedTypes.includes(type.accountType)
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100'
                }`}
              >
              <span className="flex items-center space-x-2 text-sm">
                {/* {institution.icon} */}
                <span>{type.accountType}</span>
              </span>
            </button>
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
            {accountInfo.map((account) =>
                <button
                key={account.accountId}
                onClick={() => onAccountChange(account.accountId)}
                  className={`w-full text-left px-2 py-1 rounded-md transition-colors ${
                    selectedAccounts.includes(account.accountId)
                      ? 'bg-blue-100 text-blue-800'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{account.accountName}</span>
                  </div>
                  <span className="text-xs text-gray-500">{account.institutionName}</span>
                </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

