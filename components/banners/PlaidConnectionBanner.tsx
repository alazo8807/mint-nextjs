"use client";

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
    const fetchLinkToken = async () => {
      try {
        const response = await fetch("/api/plaid/create-link-token");
        if (!response.ok) {
          throw new Error("Failed to fetch link token");
        }
        const data = await response.json();
        setLinkToken(data.link_token);
      } catch (error) {
        console.error("Error fetching link token:", error);
      }
    };
    fetchLinkToken();
  }, []);

  // exchangeLinkToken exchanges the public token for an access_token. The access_token
  // is persisted in the server side and will be used to communicate with plaid.
  const exchangeLinkToken = async (publicToken: string) => {
    try {
      const response = await fetch("/api/plaid/exchange-link-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ public_token: publicToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to exchange link token");
      }

      const respJson = await response.json();
      console.log({respJson})
      return respJson;
    } catch (error) {
      console.error("Error exchanging link token:", error);
    }
  }

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
