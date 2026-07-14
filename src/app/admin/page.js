import { cookies } from 'next/headers';
import AdminPanel from '@/components/AdminPanel';
import LoginForm from '@/components/LoginForm';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const token = (await cookies()).get('admin_token');
  const isAuthenticated = token?.value === 'authenticated';

  return (
    <main className="container animate-fade-in" style={{ maxWidth: '800px', padding: '3rem 2rem' }}>
      <div className="header" style={{ borderBottom: 'none', paddingBottom: '0', marginBottom: '1.5rem' }}>
        <h2>Panel Admin Khusus</h2>
        <p>Tambahkan repositori skripsi baru secara langsung</p>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        {isAuthenticated ? <AdminPanel /> : <LoginForm />}
      </div>
    </main>
  );
}
