import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import AdminPanel from '@/components/AdminPanel';
import LoginForm from '@/components/LoginForm';

export const dynamic = 'force-dynamic';
const prisma = new PrismaClient();

async function getTheses() {
  return await prisma.youtubeVideo.findMany({
    orderBy: { upload_date: 'desc' }
  });
}

export default async function AdminPage() {
  const token = (await cookies()).get('admin_token');
  const isAuthenticated = token?.value === 'authenticated';
  const theses = isAuthenticated ? await getTheses() : [];

  return (
    <main className="container animate-fade-in" style={{ maxWidth: '900px', padding: '3rem 2rem' }}>
      <div className="header" style={{ borderBottom: 'none', paddingBottom: '0', marginBottom: '1.5rem' }}>
        <h2>Panel Admin Khusus</h2>
        <p>Tambahkan dan edit repositori skripsi secara langsung</p>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        {isAuthenticated ? <AdminPanel initialTheses={theses} /> : <LoginForm />}
      </div>
    </main>
  );
}
