'use client';
import { useState } from 'react';
import { loginAdmin } from '@/app/actions';
import { useRouter } from 'next/navigation';

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
    <div>
      <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Autentikasi Diperlukan</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Halaman ini hanya untuk pemilik repositori. Silakan masukkan password admin Anda.
      </p>
      
      {error && <div className="error-msg">{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="password" 
          name="password" 
          placeholder="Password Admin..." 
          className="input-field" 
          required 
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Memeriksa...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}
