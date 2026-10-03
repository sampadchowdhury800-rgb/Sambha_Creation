/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Scheduled Publishing Endpoint
   Platform-agnostic: works with Cloudflare Workers Cron Triggers,
   external cron services, or any HTTP-based scheduler.
   
   Usage with Cloudflare Workers Cron Trigger:
   Create a Worker that calls this endpoint every 5 minutes.
   
   Usage with cron-job.org (free alternative):
   Set up a GET request to: https://yourdomain.com/api/cron/publish
   with Authorization header: Bearer <CRON_SECRET>
   ══════════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ArticleStatus } from '@prisma/client';

export const dynamic = 'force-dynamic'; // Never cache this route

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();

  const result = await prisma.article.updateMany({
    where: {
      status: ArticleStatus.SCHEDULED,
      scheduledAt: { lte: now },
    },
    data: {
      status: ArticleStatus.PUBLISHED,
      publishedAt: now,
    },
  });

  return NextResponse.json({
    message: `Published ${result.count} scheduled article(s)`,
    published: result.count,
    timestamp: now.toISOString(),
  });
}
