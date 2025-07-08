import jwt from 'jsonwebtoken'
import type { NextRequest } from 'next/server'

const HOOKLIFY_JWT_SECRET = process.env.HOOKLIFY_JWT_SECRET!

export interface WidgetToken {
  siteId: string
  widgetId: string
  iat: number
  exp: number
}

export function verifyWidgetToken(req: NextRequest): WidgetToken {
  const auth = req.headers.get('authorization') || ''
  if (!auth.startsWith('Bearer ')) {
    throw new Error('No token provided')
  }
  const token = auth.slice(7)
  return jwt.verify(token, HOOKLIFY_JWT_SECRET) as WidgetToken
}
