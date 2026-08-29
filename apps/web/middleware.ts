/**
 * P0-L-004 — protect /admin. Do not invent a custom session here;
 * implement with the chosen auth library during that ticket.
 */
export function middleware() {}

export const config = {
  matcher: ['/admin/:path*'],
}
