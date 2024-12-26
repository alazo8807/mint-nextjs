import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export function PlaidConnectionBanner() {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            Your account is not connected to Plaid. Some features may be limited.
            <Link href="/connect-plaid" className="font-medium underline text-yellow-700 hover:text-yellow-600 ml-1">
              Reconnect your account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
