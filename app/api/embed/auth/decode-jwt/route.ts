// app/api/embed/auth/decode-jwt/route.js
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { jwtToken } = await request.json();

    if (!jwtToken) {
      return NextResponse.json({ error: 'JWT token is required' }, { status: 400 });
    }

    // Decode JWT (replace with your actual secret)
    const JWT_SECRET = process.env.HOOKLIFY_JWT_SECRET!;
    const decoded = jwt.verify(jwtToken, JWT_SECRET);

    // Extract the required fields from JWT payload
    const { siteApiKey, widgetApiKey, widgetId, siteId } = decoded;

    if (!siteApiKey || !widgetApiKey || !widgetId) {
      return NextResponse.json({ error: 'Invalid JWT payload - missing required fields' }, { status: 400 });
    }

    return NextResponse.json({
      siteApiKey,
      widgetApiKey,
      widgetId,
      siteId: siteId || null // Optional field
    });

  } catch (error) {
    console.error('JWT decode error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid JWT token' }, { status: 401 });
    }
    
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'JWT token expired' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}