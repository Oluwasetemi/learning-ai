import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Only run for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log(`[API Middleware] ${request.method} ${request.nextUrl.pathname}`);

    // You can add headers that your routes can read
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-request-sample', Date.now().toString());

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      }
    });
  }
}

export const config = {
  matcher: '/api/:path*',
};
