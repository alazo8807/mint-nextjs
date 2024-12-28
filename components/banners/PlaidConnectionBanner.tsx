"use client";

import { exchangeLinkToken, fetchLinkToken } from "@/lib/plaid/api";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";

type BannerProps = {
  onConnected: () => void
};

export function PlaidConnectionBanner({ onConnected }: BannerProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);

  // Fetch the Plaid link token
  useEffect(() => {
    const getAndSetLinkToken = async () => {
      const linkToken = await fetchLinkToken();
      setLinkToken(linkToken);
    }
    getAndSetLinkToken();
  }, []);

  // Handle the onSuccess logic
  const onSuccess = async (publicToken: string, _metadata: object) => {
    const data = await exchangeLinkToken(publicToken);
    console.log({data})

    onConnected();
  };

  // Plaid configuration
  const config = { token: linkToken!, onSuccess };
  const { open, ready } = usePlaidLink(config);

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            Your account is not connected to Plaid. Some features may be limited and the data might not be up to date.
            <button
              onClick={() => open()}
              className="font-medium underline text-yellow-700 hover:text-yellow-600 ml-1"
              disabled={!ready}
            >
              Reconnect your account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
