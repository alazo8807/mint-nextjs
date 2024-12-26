import Link from "next/link"

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-blue-600">
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
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Add Account
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Settings
          </button>
        </div>
      </div>
    </header>
  )
}
