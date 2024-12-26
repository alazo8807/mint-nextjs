import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get all users
  if (req.method === 'GET') {
    db.all('SELECT * FROM users', [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Database error' });
      } else {
        res.status(200).json(rows);
      }
    });
  }

  // Add a user
  if (req.method === 'POST') {
    const { name, email } = req.body;
    db.run(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email],
      function (err) {
        if (err) {
          res.status(500).json({ error: 'Database error' });
        } else {
          res.status(201).json({ id: this.lastID, name, email });
        }
      }
    );
  }
}
