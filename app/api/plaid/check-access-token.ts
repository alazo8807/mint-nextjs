import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.cookies['access_token']) {
    res.status(200).json({ message: 'Token is present' });
  } else {
    // The cookie is not present
    res.status(401).json({ message: 'Token not found' });
  }
}