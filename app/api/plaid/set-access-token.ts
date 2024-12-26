import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({ error: 'Access token is required' });
    }

    // Set the access_token as a secure, HTTP-only cookie
    res.setHeader('Set-Cookie', serialize('access_token', access_token, {
      httpOnly: true,  // Prevents client-side JS access
      secure: process.env.NODE_ENV === 'production', // Ensures it's only sent over HTTPS in production
      maxAge: 60 * 60 * 24 * 1, // 1 week
      path: '/', // Cookie will be available across all 
    }));

    res.status(200).json({ message: 'Access token saved to cookie' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
