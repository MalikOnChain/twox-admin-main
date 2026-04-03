import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
])

function backendBaseUrl(): string | null {
  const fromEnv = process.env.ADMIN_BACKEND_INTERNAL_URL?.trim().replace(/\/$/, '')
  if (fromEnv) return fromEnv
  if (process.env.NODE_ENV !== 'production') {
    return 'http://127.0.0.1:5000/api'
  }
  return null
}

function buildTargetUrl(req: NextRequest, pathSegments: string[]): string | null {
  const base = backendBaseUrl()
  if (!base) return null
  const path = pathSegments.filter(Boolean).join('/')
  const search = req.nextUrl.search || ''
  return path ? `${base}/${path}${search}` : `${base}${search}`
}

async function proxy(req: NextRequest, pathSegments: string[]) {
  const target = buildTargetUrl(req, pathSegments)
  if (!target) {
    return NextResponse.json(
      {
        success: false,
        error:
          'ADMIN_BACKEND_INTERNAL_URL is not set. On Vercel add it under Project → Environment Variables (your API base including /api, e.g. https://api.example.com/api).',
      },
      { status: 503 }
    )
  }

  const outHeaders = new Headers()
  req.headers.forEach((value, key) => {
    const k = key.toLowerCase()
    if (HOP_BY_HOP.has(k) || k === 'host') return
    outHeaders.set(key, value)
  })

  const init: RequestInit = {
    method: req.method,
    headers: outHeaders,
    redirect: 'manual',
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = await req.arrayBuffer()
  }

  let upstream: Response
  try {
    upstream = await fetch(target, init)
  } catch {
    return NextResponse.json(
      {
        success: false,
        error:
          'Proxy could not reach the backend. Check ADMIN_BACKEND_INTERNAL_URL, firewall, and that the API is running.',
      },
      { status: 502 }
    )
  }

  const resHeaders = new Headers()
  upstream.headers.forEach((value, key) => {
    const k = key.toLowerCase()
    if (HOP_BY_HOP.has(k) || k === 'set-cookie') return
    resHeaders.append(key, value)
  })

  const setCookieFn = (
    upstream.headers as Headers & { getSetCookie?: () => string[] }
  ).getSetCookie
  const cookies =
    typeof setCookieFn === 'function'
      ? setCookieFn.call(upstream.headers)
      : []

  const res = new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: resHeaders,
  })

  for (const c of cookies) {
    res.headers.append('Set-Cookie', c)
  }

  return res
}

type RouteCtx = { params: Promise<{ path?: string[] }> }

export async function GET(req: NextRequest, ctx: RouteCtx) {
  const { path = [] } = await ctx.params
  return proxy(req, path)
}

export async function POST(req: NextRequest, ctx: RouteCtx) {
  const { path = [] } = await ctx.params
  return proxy(req, path)
}

export async function PUT(req: NextRequest, ctx: RouteCtx) {
  const { path = [] } = await ctx.params
  return proxy(req, path)
}

export async function PATCH(req: NextRequest, ctx: RouteCtx) {
  const { path = [] } = await ctx.params
  return proxy(req, path)
}

export async function DELETE(req: NextRequest, ctx: RouteCtx) {
  const { path = [] } = await ctx.params
  return proxy(req, path)
}

export async function OPTIONS(req: NextRequest, ctx: RouteCtx) {
  const { path = [] } = await ctx.params
  return proxy(req, path)
}
