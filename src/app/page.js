import { PrismaClient } from '@prisma/client';
import UnifiedGallery from '@/components/UnifiedGallery';
import Link from 'next/link';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

async function getTheses() {
  const theses = await prisma.youtubeVideo.findMany({
    orderBy: { upload_date: 'desc' }
  });
  return theses;
}

export default async function Home() {
  const theses = await getTheses();

  return (
    <main className="container">
      <div className="header animate-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ textAlign: 'left' }}>
          <h1>SkripsianYuk</h1>
          <p>Repositori Skripsi & Edukasi Departemen Statistika</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/admin">
            <button 
              className="btn-primary" 
              style={{ 
                background: '#475569', 
                borderRadius: '50%', 
                width: '45px', 
                height: '45px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: 0,
                fontSize: '1.2rem'
              }}
              title="Panel Admin"
            >
              👤
            </button>
          </Link>
        </div>
      </div>
      
      <div className="animate-fade-in" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', flex: 1 }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Repositori Skripsi</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-primary)' }}>{theses.length}</p>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', flex: 1 }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Terbaru</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
            {theses.length > 0 && theses[0].upload_date ? theses[0].upload_date.substring(0, 4) : '-'}
          </p>
        </div>
      </div>
      
      <div style={{ paddingBottom: '3rem' }}>
        <UnifiedGallery initialData={theses} />
      </div>
    </main>
  );
}
