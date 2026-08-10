const isDev = process.env.NODE_ENV === 'development';

// The browser talks to the backend directly (auth, token refresh, live queries),
// so its origin has to be reachable from connect-src. Whichever variant is
// installed sets one of these; the other stays undefined and drops out.
// Convex keeps an open websocket, hence the wss: twin of its origin.
function backendOrigins() {
  const origins = [];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (supabaseUrl) origins.push(new URL(supabaseUrl).origin);
  if (convexUrl) {
    const origin = new URL(convexUrl).origin;
    origins.push(origin, origin.replace(/^https/, 'wss'));
  }
  return origins.join(' ');
}

// Next inlines its bootstrap and flight payload as <script> tags. Emitting a
// per-request nonce needs middleware, which would opt every page out of static
// rendering, so 'unsafe-inline' stays for scripts. next-themes writes an inline
// style attribute, hence the same allowance for styles. Everything that is not
// needed is denied outright.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' ${backendOrigins()} ${isDev ? 'ws: http://localhost:*' : ''}`.trim(),
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  // HSTS is only meaningful over TLS and would poison localhost, so it is
  // production-only.
  ...(isDev
    ? []
    : [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
