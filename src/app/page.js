import { PrismaClient } from '@prisma/client';
import ThesisTable from '@/components/ThesisTable';
import Link from 'next/link';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Fungsi untuk mengambil data dari TiDB
async function getTheses() {
  const theses = await prisma.thesis.findMany({
    orderBy: { year: 'desc' }
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
          <p>Repositori Skripsi & Tugas Akhir Terpadu</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/videos">
            <button className="btn-primary" style={{ background: '#2563eb' }}>Galeri Video</button>
          </Link>
          <Link href="/admin">
            <button className="btn-primary" style={{ background: '#475569' }}>Panel Admin</button>
          </Link>
        </div>
      </div>
      
      <div className="animate-fade-in" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', flex: 1 }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Repositori</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-primary)' }}>{theses.length}</p>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', flex: 1 }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Terbaru</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
            {theses.length > 0 ? theses[0].year : '-'}
          </p>
        </div>
      </div>
      
      <div style={{ paddingBottom: '3rem' }}>
        {/* Tabel Data Full Width */}
        <ThesisTable initialData={theses} />
      </div>
    </main>
  );
}
