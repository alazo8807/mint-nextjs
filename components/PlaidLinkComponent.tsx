'use client'

import { usePlaidLink } from 'react-plaid-link';
import { useEffect, useState } from 'react';

const PlaidLinkComponent: React.FC<{ onAccessToken: (token: string) => void }> = ({ onAccessToken }) => {
  const [linkToken, setLinkToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinkToken = async () => {
      const response = await fetch('/api/plaid/create-link-token');
      const data = await response.json();
      setLinkToken(data.link_token);
    };
    fetchLinkToken();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSuccess = async (publicToken: string, _metadata: object) => {
    const response = await fetch('/api/plaid/exchange-link-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_token: publicToken, userId: "alazotest" }),
    });
    const data = await response.json();

    // // TODO: Save the access token and item ID
    // const { access_token, item_id } = response.data;
    // await plaidSyncCursorRepository.create(userId, item_id, access_token);

    
    console.log('Access Token:', data.access_token);
    onAccessToken(data.access_token)
  };

  const config = { token: linkToken!, onSuccess };
  const { open, ready } = usePlaidLink(config);

  return (
    <button className="btn btn-primary" onClick={() => open()} disabled={!ready}>
      Connect
    </button>
  );
};

export default PlaidLinkComponent;
