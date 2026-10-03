/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Cloudinary Configuration
   Upload, optimize, and manage images
   ══════════════════════════════════════════════════════════════ */

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

// ── Upload image to Cloudinary ───────────────────────────────
export async function uploadImage(
  fileBuffer: Buffer,
  folder: string = 'sambha-creation/articles'
): Promise<{
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        quality: 'auto:good',
        fetch_format: 'auto',
        flags: 'progressive',
        transformation: [
          { width: 1920, crop: 'limit' }, // Max width 1920px
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
}

// ── Delete image from Cloudinary ─────────────────────────────
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

// ── Upload video to Cloudinary ───────────────────────────────
export async function uploadVideo(
  fileBuffer: Buffer,
  folder: string = 'sambha-creation/videos'
): Promise<{
  url: string;
  publicId: string;
  format: string;
  duration?: number;
}> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'video',
        quality: 'auto',
        chunk_size: 6000000, // 6MB chunks for large files
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Video upload failed'));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          duration: (result as unknown as { duration?: number }).duration,
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
}

// ── Delete video from Cloudinary ─────────────────────────────
export async function deleteVideo(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
}

// ── Get optimized image URL ──────────────────────────────────
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  } = {}
): string {
  const { width, height, quality = 'auto', format = 'auto' } = options;
  return cloudinary.url(publicId, {
    secure: true,
    quality,
    fetch_format: format,
    width,
    height,
    crop: width || height ? 'limit' : undefined,
  });
}
