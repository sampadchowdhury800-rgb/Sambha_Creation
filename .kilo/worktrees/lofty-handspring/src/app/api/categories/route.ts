/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Categories API
   GET all / POST create (with duplicate check)
   ══════════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { generateSlug } from '@/lib/utils';

// GET /api/categories — return all categories (for admin autocomplete)
export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(categories);
}

// POST /api/categories — admin only, create new category
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { name, emoji } = await req.json();
  if (!name?.trim()) return NextResponse.json({ message: 'Name required' }, { status: 400 });

  const trimmedName = name.trim();
  const slug = generateSlug(trimmedName);

  // Case-insensitive duplicate check
  const existing = await prisma.category.findFirst({
    where: { name: { equals: trimmedName, mode: 'insensitive' } },
  });
  if (existing) {
    // Return the existing category instead of erroring — client can select it
    return NextResponse.json(existing, { status: 200 });
  }

  try {
    const category = await prisma.category.create({
      data: { name: trimmedName, slug, emoji: emoji || null },
    });
    return NextResponse.json(category, { status: 201 });
  } catch {
    // Slug collision fallback
    const category = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name: trimmedName, slug: `${slug}-${Date.now().toString(36)}`, emoji: emoji || null },
    });
    return NextResponse.json(category, { status: 201 });
  }
}
