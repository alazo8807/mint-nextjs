"use client";

import Link from "next/link"
import { usePlaidLink } from "react-plaid-link";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { AudioWaveform, Command, LogOut, Settings, User } from 'lucide-react'
import { exchangeLinkToken, fetchLinkToken } from "@/lib/plaid/api";



export function Header() {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const router = useRouter()

  // Fetch the Plaid link token
  useEffect(() => {
    const getAndSetLinkToken = async () => {
      const linkToken = await fetchLinkToken();
      setLinkToken(linkToken);
    }
    getAndSetLinkToken();
  }, []);



  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    router.push('/login')
  }

  // Handle the onSuccess logic
  const onSuccess = async (publicToken: string, _metadata: object) => {
    const data = await exchangeLinkToken(publicToken);
    console.log({data})
  };

  // Plaid configuration
  const config = { token: linkToken!, onSuccess };
  const { open, ready } = usePlaidLink(config);

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-green-700">
            MintClone
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/transactions" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Transactions
            </Link>
            <Link href="/budgets" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Budgets
            </Link>
            <Link href="/goals" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Goals
            </Link>
            <Link href="/investments" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Investments
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => open()}
            disabled={!ready}>
            Add Account
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Settings
          </button>
          {isLoggedIn ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src="/placeholder.svg?height=32&width=32" alt="User avatar" />
                </div>
              </label>
              <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                <li><a onClick={() => router.push('/profile')}>Profile</a></li>
                <li><a onClick={() => router.push('/settings')}>Settings</a></li>
                <li><a onClick={handleLogout}>Logout</a></li>
              </ul>
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm">Log in</Link>
          )}
        </div>
      </div>
    </header>
  )
}
