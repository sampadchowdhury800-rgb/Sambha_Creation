/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Tags API
   GET all tags / POST create new tag
   ══════════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { generateSlug } from '@/lib/utils';

// GET /api/tags — return all tags (for autocomplete)
export async function GET() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(tags);
}

// POST /api/tags — create a new tag (admin only)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ message: 'Name required' }, { status: 400 });

  const trimmedName = name.trim();
  const slug = generateSlug(trimmedName);

  // Use upsert so it doesn't error if tag already exists
  const tag = await prisma.tag.upsert({
    where: { slug },
    update: {},
    create: { name: trimmedName, slug },
  });

  return NextResponse.json(tag, { status: 201 });
}
