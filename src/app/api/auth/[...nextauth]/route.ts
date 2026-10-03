import { handlers } from '@/lib/auth';
import { NextRequest } from 'next/server';

// Wrap the Auth.js handlers to satisfy Next.js 15 TypeScript requirements
export async function GET(req: NextRequest) {
  return handlers.GET(req);
}

export async function POST(req: NextRequest) {
  return handlers.POST(req);
}
