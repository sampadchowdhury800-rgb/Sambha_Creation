/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Media Upload API
   Supports images (to Cloudinary) and videos (to Cloudinary)
   ══════════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { uploadImage, uploadVideo } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = (formData.get('type') as string) || 'image';

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    // ── Video upload ─────────────────────────────────────────
    if (type === 'video') {
      const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
      if (!allowedVideoTypes.includes(file.type)) {
        return NextResponse.json(
          { message: 'Only MP4, WebM, and MOV videos are allowed' },
          { status: 400 }
        );
      }

      // Max 200MB for video
      if (file.size > 200 * 1024 * 1024) {
        return NextResponse.json(
          { message: 'Video size must be under 200MB' },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadVideo(buffer);

      return NextResponse.json(result, { status: 201 });
    }

    // ── Image upload ─────────────────────────────────────────
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ message: 'Only image files are allowed' }, { status: 400 });
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ message: 'File size must be under 10MB' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImage(buffer);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
  }
}
