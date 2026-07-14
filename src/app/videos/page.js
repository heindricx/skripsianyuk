import { PrismaClient } from '@prisma/client';
import VideoGallery from '@/components/VideoGallery';
import Link from 'next/link';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

async function getVideos() {
  const videos = await prisma.youtubeVideo.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return videos;
}

export default async function VideosPage() {
  const videos = await getVideos();

  return (
    <main className="container">
      <div className="header animate-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ textAlign: 'left' }}>
          <h1>Galeri Video</h1>
          <p>Kumpulan Video Edukasi & Skripsi YouTube</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/">
            <button className="btn-primary" style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1' }}>Kembali ke Skripsi</button>
          </Link>
          <Link href="/admin">
            <button className="btn-primary" style={{ background: '#475569' }}>Panel Admin</button>
          </Link>
        </div>
      </div>
      
      <div style={{ paddingBottom: '3rem' }}>
        <VideoGallery initialData={videos} />
      </div>
    </main>
  );
}
