'use client';
import { useState } from 'react';
import { loginAdmin } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { Lock, LogIn, AlertCircle } from 'lucide-react';

export default function LoginForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.target);
    const result = await loginAdmin(formData);
    
    if (result.success) {
      router.refresh(); // Refresh the page to see the AdminPanel
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ background: '#e2e8f0', padding: '1rem', borderRadius: '50%', marginBottom: '1rem', color: '#475569' }}>
          <Lock size={32} />
        </div>
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: '700' }}>Akses Terbatas</h3>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '0.5rem', fontSize: '0.95rem' }}>
          Halaman ini hanya untuk pemilik repositori. Silakan masukkan password admin Anda.
        </p>
      </div>
      
      {error && (
        <div style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #f87171', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>Password Admin</label>
          <input 
            type="password" 
            name="password" 
            placeholder="••••••••" 
            className="input-field" 
            required 
            style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '1rem' }}
          />
        </div>
        <button 
          type="submit" 
          className="btn-primary" 
          disabled={loading}
          style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.85rem' }}
        >
          {loading ? 'Memeriksa...' : (
            <>
              <LogIn size={18} /> Masuk
            </>
          )}
        </button>
      </form>
    </div>
  );
}
