import { PrismaClient } from '@prisma/client';
import UnifiedGallery from '@/components/UnifiedGallery';
import SplashScreen from '@/components/SplashScreen';
import AngkatanChart from '@/components/AngkatanChart';
import Link from 'next/link';
import { UserCog } from 'lucide-react';

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
    <>
      <SplashScreen />
      <main className="container">
        <div className="header animate-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
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
                  fontSize: '1.2rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                title="Panel Admin"
              >
                <UserCog size={22} color="white" />
              </button>
            </Link>
          </div>
        </div>
        
        <div className="animate-fade-in" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          
          <div className="glass-card" style={{ padding: '1.5rem', flex: 1, minWidth: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Repositori Skripsi</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-primary)', lineHeight: '1.2' }}>{theses.length}</p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', flex: 2, minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Distribusi Angkatan</h3>
            <div style={{ flex: 1, minHeight: '150px' }}>
              <AngkatanChart data={theses} />
            </div>
          </div>
          
        </div>
        
        <div style={{ paddingBottom: '3rem' }}>
          <UnifiedGallery initialData={theses} />
        </div>
      </main>
    </>
  );
}
