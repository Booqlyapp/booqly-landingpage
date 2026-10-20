import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl;

  // Get the subdomain from the hostname
  // Example: elite-hair-studio.booqlyapp.com -> elite-hair-studio
  // Example: elite-hair-studio.localhost:3001 -> elite-hair-studio
  const parts = hostname.split('.');
  const subdomain = parts[0];

  // Reserved subdomains that should not be treated as custom links
  const reservedSubdomains = ['www', 'api', 'admin', 'app', 'mail', 'staging', 'dev', 'booqlyapp'];

  // Check if this is a subdomain (not the main domain)
  // For localhost: subdomain.localhost:3001 has parts ['subdomain', 'localhost:3001']
  // For production: subdomain.booqlyapp.com has parts ['subdomain', 'booqlyapp', 'com']
  const isLocalhost = hostname.includes('localhost');
  const isSubdomain = isLocalhost 
    ? parts.length > 1 && !hostname.startsWith('localhost') // localhost: check if there's a prefix
    : parts.length > 2 && !hostname.startsWith('www.');     // production: check for subdomain.domain.tld
  const isReserved = reservedSubdomains.includes(subdomain);

  // If it's a valid custom subdomain (not reserved and not the main domain)
  if (isSubdomain && !isReserved && subdomain) {
    // Skip rewriting if the path already starts with /book/
    if (url.pathname.startsWith('/book/')) {
      return NextResponse.next();
    }
    
    // Skip rewriting for static assets (images, fonts, etc.)
    if (url.pathname.startsWith('/images/') || 
        url.pathname.startsWith('/fonts/') || 
        url.pathname.startsWith('/public/')) {
      return NextResponse.next();
    }
    
    // Rewrite to the booking page with the subdomain as a parameter
    url.pathname = `/book/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
