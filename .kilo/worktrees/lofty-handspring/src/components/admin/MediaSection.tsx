'use client';

/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Media Section Component
   Unified media panel: Featured Image, Gallery, Video, Instagram
   ══════════════════════════════════════════════════════════════ */

import { useState, useRef, useCallback } from 'react';
import type { GalleryImageItem } from '@/types';

interface MediaSectionProps {
  // Featured Image
  featuredImageUrl: string | null;
  featuredImageId: string | null;
  featuredImageAlt: string | null;
  onFeaturedChange: (url: string | null, id: string | null, alt: string | null) => void;

  // Gallery
  galleryImages: GalleryImageItem[];
  onGalleryChange: (images: GalleryImageItem[]) => void;

  // Video
  videoUrl: string | null;
  videoPublicId: string | null;
  onVideoChange: (url: string | null, publicId: string | null) => void;

  // Instagram
  instagramVideo: string;
  onInstagramChange: (url: string) => void;

  // YouTube
  youtubeVideo: string;
  onYoutubeChange: (url: string) => void;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface UploadState {
  status: UploadStatus;
  progress: number;
  error?: string;
}

function ProgressBar({ progress, status }: { progress: number; status: UploadStatus }) {
  if (status === 'idle') return null;
  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{
        height: '4px',
        background: 'var(--glass)',
        borderRadius: '4px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: status === 'error'
            ? 'var(--danger)'
            : status === 'success'
            ? 'var(--success)'
            : 'linear-gradient(90deg, var(--moss), var(--prairie))',
          borderRadius: '4px',
          transition: 'width 0.3s ease, background 0.3s',
        }} />
      </div>
      {status === 'error' && (
        <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '4px' }}>Upload failed. Please try again.</p>
      )}
      {status === 'success' && (
        <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '4px' }}>✓ Uploaded successfully</p>
      )}
      {status === 'uploading' && (
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Uploading… {progress}%</p>
      )}
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
      <span style={{ fontSize: '1rem' }}>{icon}</span>
      <h3 style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '0.03em' }}>{title}</h3>
    </div>
  );
}

// Simulate progress (XMLHttpRequest-based would be ideal, but fetch is simpler for now)
async function uploadFile(file: File, type: 'image' | 'video', onProgress: (p: number) => void) {
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 90));
      }
    };

    xhr.onload = () => {
      onProgress(100);
      if (xhr.status === 201) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve({ url: data.url, publicId: data.publicId });
        } catch {
          reject(new Error('Invalid response'));
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(new Error(err.message || 'Upload failed'));
        } catch {
          reject(new Error('Upload failed'));
        }
      }
    };

    xhr.onerror = () => reject(new Error('Network error'));
    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  });
}

export default function MediaSection({
  featuredImageUrl,
  featuredImageId,
  featuredImageAlt,
  onFeaturedChange,
  galleryImages,
  onGalleryChange,
  videoUrl,
  videoPublicId,
  onVideoChange,
  instagramVideo,
  onInstagramChange,
  youtubeVideo,
  onYoutubeChange,
}: MediaSectionProps) {
  const [featuredUpload, setFeaturedUpload] = useState<UploadState>({ status: 'idle', progress: 0 });
  const [videoUpload, setVideoUpload] = useState<UploadState>({ status: 'idle', progress: 0 });
  const [galleryUploading, setGalleryUploading] = useState(false);

  // Drag-and-drop gallery reorder state
  const dragIndexRef = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  // Gallery drop zone state
  const [galleryDragActive, setGalleryDragActive] = useState(false);

  // ── Featured Image ────────────────────────────────────────
  const handleFeaturedUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setFeaturedUpload({ status: 'uploading', progress: 0 });
      try {
        const { url, publicId } = await uploadFile(file, 'image', (p) =>
          setFeaturedUpload({ status: 'uploading', progress: p })
        );
        onFeaturedChange(url, publicId, file.name.replace(/\.[^.]+$/, ''));
        setFeaturedUpload({ status: 'success', progress: 100 });
        setTimeout(() => setFeaturedUpload({ status: 'idle', progress: 0 }), 3000);
      } catch (err) {
        setFeaturedUpload({ status: 'error', progress: 0, error: String(err) });
      }
    };
    input.click();
  }, [onFeaturedChange]);

  // ── Gallery Images ────────────────────────────────────────
  const handleGalleryFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArr = Array.from(files).filter((f) => f.type.startsWith('image/'));
      if (!fileArr.length) return;
      setGalleryUploading(true);

      const newImages: GalleryImageItem[] = [];
      for (const file of fileArr) {
        try {
          const { url, publicId } = await uploadFile(file, 'image', () => {});
          newImages.push({
            url,
            publicId,
            alt: file.name.replace(/\.[^.]+$/, ''),
            sortOrder: galleryImages.length + newImages.length,
          });
        } catch {
          // skip failed files
        }
      }
      onGalleryChange([...galleryImages, ...newImages]);
      setGalleryUploading(false);
    },
    [galleryImages, onGalleryChange]
  );

  const handleGalleryInput = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = () => { if (input.files) handleGalleryFiles(input.files); };
    input.click();
  };

  const removeGalleryImage = (idx: number) => {
    const updated = galleryImages.filter((_, i) => i !== idx).map((img, i) => ({ ...img, sortOrder: i }));
    onGalleryChange(updated);
  };

  // ── Gallery drag-and-drop reorder ─────────────────────────
  const handleDragStart = (idx: number) => { dragIndexRef.current = idx; };
  const handleDragEnter = (idx: number) => { setDragOver(idx); };
  const handleDragEnd = () => {
    const from = dragIndexRef.current;
    const to = dragOver;
    if (from !== null && to !== null && from !== to) {
      const updated = [...galleryImages];
      const [item] = updated.splice(from, 1);
      updated.splice(to, 0, item);
      onGalleryChange(updated.map((img, i) => ({ ...img, sortOrder: i })));
    }
    dragIndexRef.current = null;
    setDragOver(null);
  };

  // ── Video ─────────────────────────────────────────────────
  const handleVideoUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/mp4,video/webm,video/quicktime';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setVideoUpload({ status: 'uploading', progress: 0 });
      try {
        const { url, publicId } = await uploadFile(file, 'video', (p) =>
          setVideoUpload({ status: 'uploading', progress: p })
        );
        onVideoChange(url, publicId);
        setVideoUpload({ status: 'success', progress: 100 });
        setTimeout(() => setVideoUpload({ status: 'idle', progress: 0 }), 3000);
      } catch {
        setVideoUpload({ status: 'error', progress: 0 });
      }
    };
    input.click();
  }, [onVideoChange]);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid var(--glass-border)',
    background: 'var(--glass)',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    outline: 'none',
  };

  const panelStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--glass-border)',
    borderRadius: '14px',
    padding: '18px',
    marginBottom: '16px',
  };

  const uploadBtnStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '10px',
    border: '1px solid var(--glass-border)',
    background: 'var(--glass)',
    color: 'var(--text-secondary)',
    fontSize: '0.82rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  return (
    <div>
      {/* ── 1. Featured Image ─────────────────────────────── */}
      <div style={panelStyle}>
        <SectionHeader icon="🖼️" title="Featured Image" />
        {featuredImageUrl ? (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ position: 'relative', display: 'inline-block', borderRadius: '10px', overflow: 'hidden', maxWidth: '100%' }}>
              <img
                src={featuredImageUrl}
                alt={featuredImageAlt || ''}
                style={{ display: 'block', maxWidth: '340px', width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px' }}
              />
              <button
                type="button"
                onClick={() => { onFeaturedChange(null, null, null); setFeaturedUpload({ status: 'idle', progress: 0 }); }}
                style={{
                  position: 'absolute', top: '8px', right: '8px',
                  background: 'rgba(0,0,0,0.75)', color: 'white', border: 'none',
                  borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer',
                  fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s',
                }}
                title="Remove image"
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(180,60,40,0.9)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.75)')}
              >
                ✕
              </button>
            </div>
            {/* Alt text */}
            <div style={{ marginTop: '8px' }}>
              <input
                type="text"
                value={featuredImageAlt || ''}
                onChange={(e) => onFeaturedChange(featuredImageUrl, featuredImageId, e.target.value)}
                placeholder="Image alt text (for SEO)…"
                style={{ ...inputStyle, fontSize: '0.8rem', padding: '7px 12px' }}
              />
            </div>
          </div>
        ) : (
          <div
            style={{
              border: '2px dashed var(--glass-border)',
              borderRadius: '12px',
              padding: '28px',
              textAlign: 'center',
              marginBottom: '12px',
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
            }}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>📷</div>
            <p style={{ marginBottom: '12px' }}>No featured image yet</p>
            <button type="button" onClick={handleFeaturedUpload} style={uploadBtnStyle}>
              Upload Image
            </button>
          </div>
        )}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" onClick={handleFeaturedUpload} style={uploadBtnStyle}>
            {featuredImageUrl ? '🔄 Replace' : '📤 Upload'}
          </button>
        </div>
        <ProgressBar progress={featuredUpload.progress} status={featuredUpload.status} />
      </div>

      {/* ── 2. Gallery Images ─────────────────────────────── */}
      <div style={panelStyle}>
        <SectionHeader icon="🗂️" title="Article Gallery" />

        {/* Gallery grid */}
        {galleryImages.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
              gap: '10px',
              marginBottom: '14px',
            }}
          >
            {galleryImages.map((img, idx) => (
              <div
                key={img.publicId + idx}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragEnter={() => handleDragEnter(idx)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                style={{
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  aspectRatio: '1',
                  border: dragOver === idx ? '2px solid var(--prairie)' : '2px solid transparent',
                  cursor: 'grab',
                  transition: 'border-color 0.15s, transform 0.15s',
                  transform: dragOver === idx ? 'scale(0.96)' : 'scale(1)',
                }}
              >
                <img
                  src={img.url}
                  alt={img.alt || ''}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
                />
                {/* Drag handle badge */}
                <div style={{
                  position: 'absolute', top: '4px', left: '4px',
                  background: 'rgba(0,0,0,0.6)',
                  borderRadius: '4px',
                  padding: '2px 5px',
                  fontSize: '0.65rem',
                  color: 'rgba(255,255,255,0.7)',
                }}>
                  ⠿ {idx + 1}
                </div>
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeGalleryImage(idx)}
                  style={{
                    position: 'absolute', top: '4px', right: '4px',
                    background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none',
                    borderRadius: '50%', width: '22px', height: '22px',
                    cursor: 'pointer', fontSize: '0.7rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setGalleryDragActive(true); }}
          onDragLeave={() => setGalleryDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setGalleryDragActive(false);
            handleGalleryFiles(e.dataTransfer.files);
          }}
          style={{
            border: `2px dashed ${galleryDragActive ? 'var(--prairie)' : 'var(--glass-border)'}`,
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center',
            transition: 'border-color 0.2s, background 0.2s',
            background: galleryDragActive ? 'rgba(122,140,94,0.05)' : 'transparent',
            marginBottom: '12px',
          }}
        >
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
            {galleryUploading ? '⏳ Uploading images…' : '📁 Drop images here or'}
          </p>
          <button type="button" onClick={handleGalleryInput} disabled={galleryUploading} style={{ ...uploadBtnStyle, opacity: galleryUploading ? 0.5 : 1 }}>
            Select Images
          </button>
        </div>

        <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
          Drag gallery thumbnails to reorder · Multiple files supported
        </p>
      </div>

      {/* ── 3. Video Upload ───────────────────────────────── */}
      <div style={panelStyle}>
        <SectionHeader icon="🎬" title="Video" />

        {/* Uploaded video preview */}
        {videoUrl && (
          <div style={{ marginBottom: '12px' }}>
            <video
              src={videoUrl}
              controls
              style={{ width: '100%', maxWidth: '480px', borderRadius: '10px', display: 'block', background: '#000' }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button type="button" onClick={handleVideoUpload} style={uploadBtnStyle}>🔄 Replace Video</button>
              <button
                type="button"
                onClick={() => { onVideoChange(null, null); setVideoUpload({ status: 'idle', progress: 0 }); }}
                style={{ ...uploadBtnStyle, color: 'var(--danger)', borderColor: 'rgba(196,106,74,0.3)' }}
              >
                🗑 Remove
              </button>
            </div>
          </div>
        )}

        {!videoUrl && (
          <div
            style={{
              border: '2px dashed var(--glass-border)',
              borderRadius: '12px',
              padding: '28px',
              textAlign: 'center',
              marginBottom: '12px',
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
            }}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🎬</div>
            <p style={{ marginBottom: '4px' }}>No video uploaded yet</p>
            <p style={{ fontSize: '0.72rem', marginBottom: '14px', opacity: 0.6 }}>MP4, WebM, MOV · Max 200MB</p>
            <button type="button" onClick={handleVideoUpload} style={uploadBtnStyle}>
              Upload Video
            </button>
          </div>
        )}
        <ProgressBar progress={videoUpload.progress} status={videoUpload.status} />

        {/* Instagram Reel URL */}
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem' }}>📸</span>
            <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Instagram Reel URL</label>
          </div>
          <input
            type="url"
            value={instagramVideo}
            onChange={(e) => onInstagramChange(e.target.value)}
            placeholder="https://www.instagram.com/reel/…"
            style={inputStyle}
          />
          <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '5px' }}>
            Paste an Instagram Reel or Post URL to embed it in the article
          </p>
        </div>

        {/* YouTube Video URL */}
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem' }}>▶️</span>
            <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)' }}>YouTube Video URL</label>
          </div>
          <input
            type="url"
            value={youtubeVideo}
            onChange={(e) => onYoutubeChange(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            style={inputStyle}
          />
          <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '5px' }}>
            Paste a YouTube URL to embed it in the article
          </p>
        </div>
      </div>
    </div>
  );
}
