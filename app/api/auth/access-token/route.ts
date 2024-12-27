import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('access_token');

  if (accessToken) {
    return NextResponse.json({ message: 'Token is present' }, { status: 200 });
  } else {
    return NextResponse.json({ message: 'Token not found' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse the JSON body
    const { access_token } = body;

    if (!access_token) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
    }

    // TODO: save the identifier with the proper env. e.g access_token_sandbox, access_token_production
    // Serialize the cookie
    const cookie = serialize('access_token', access_token, {
      httpOnly: true, // Prevents client-side JS access
      secure: process.env.NODE_ENV === 'production', // Ensures it's only sent over HTTPS in production
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/', // Cookie will be available across all routes
    });

    // Set the cookie in the response headers
    const response = NextResponse.json({ message: 'Access token saved to cookie' });
    response.headers.set('Set-Cookie', cookie);

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}