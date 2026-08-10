'use client';

import { ReactNode } from 'react';
import { ConvexProvider as ConvexReactProvider, ConvexReactClient } from 'convex/react';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) throw new Error('Missing NEXT_PUBLIC_CONVEX_URL');

// One client per browser tab. It holds the websocket, so it is created once at
// module scope and never inside a component.
const convexClient = new ConvexReactClient(convexUrl);

export default function ConvexProvider({ children }: { children: ReactNode }) {
  return <ConvexReactProvider client={convexClient}>{children}</ConvexReactProvider>;
}
