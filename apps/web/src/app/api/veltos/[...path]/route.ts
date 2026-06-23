import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const VELTOS_API_ORIGIN = (
  process.env.VELTOS_API_ORIGIN ??
  process.env.NEXT_PUBLIC_VELTOS_API_ORIGIN ??
  'https://www.veltos.com.br'
).replace(/\/$/, '')

const SALON_ID = process.env.NEXT_PUBLIC_SALON_ID ?? process.env.SALON_ID ?? ''

type RouteContext = {
  params: Promise<{ path?: string[] }>
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Max-Age': '86400',
  }
}

function requestHeaders(request: NextRequest) {
  const headers = new Headers()
  const contentType = request.headers.get('content-type')
  const authorization = request.headers.get('authorization')
  const apikey = request.headers.get('apikey')

  if (contentType) headers.set('content-type', contentType)
  if (authorization) headers.set('authorization', authorization)
  if (apikey) headers.set('apikey', apikey)

  return headers
}

async function targetUrl(request: NextRequest, context: RouteContext) {
  const params = await context.params
  const path = params.path ?? []

  if (path.length === 0) return null

  const encodedPath = path.map((part) => encodeURIComponent(part)).join('/')
  const url = new URL(`/api/veltos/${encodedPath}`, VELTOS_API_ORIGIN)
  const incomingUrl = new URL(request.url)

  incomingUrl.searchParams.forEach((value, key) => {
    url.searchParams.append(key, value)
  })

  if (SALON_ID && !url.searchParams.has('salonId')) {
    url.searchParams.set('salonId', SALON_ID)
  }

  return url
}

async function forward(request: NextRequest, context: RouteContext, method: 'GET' | 'POST') {
  const url = await targetUrl(request, context)

  if (!url) {
    return NextResponse.json(
      { ok: false, error: 'Endpoint Veltos inválido.' },
      { status: 400, headers: corsHeaders() },
    )
  }

  try {
    const upstream = await fetch(url, {
      method,
      headers: requestHeaders(request),
      body: method === 'POST' ? await request.text() : undefined,
      cache: 'no-store',
    })
    const contentType = upstream.headers.get('content-type') ?? 'application/json'
    const payload = await upstream.text()

    return new NextResponse(payload, {
      status: upstream.status,
      headers: {
        ...corsHeaders(),
        'Cache-Control': 'no-store',
        'Content-Type': contentType,
      },
    })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Não foi possível conectar ao Veltos.' },
      { status: 502, headers: corsHeaders() },
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  })
}

export async function GET(request: NextRequest, context: RouteContext) {
  return forward(request, context, 'GET')
}

export async function POST(request: NextRequest, context: RouteContext) {
  return forward(request, context, 'POST')
}
