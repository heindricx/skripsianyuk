'use client';
import { useState, useRef } from 'react';
import { addThesis, logoutAdmin } from '@/app/actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPanel() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAdmin();
    router.refresh();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    const formData = new FormData(e.target);
    const result = await addThesis(formData);
    
    if (result.success) {
      setSuccess('Data berhasil ditambahkan ke database!');
      formRef.current.reset();
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--text-primary)' }}>Tambah Data Baru</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/">
            <button className="btn-primary" style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1' }}>Kembali</button>
          </Link>
          <button onClick={handleLogout} className="btn-primary" style={{ background: '#ef4444' }}>Keluar</button>
        </div>
      </div>
      
      {error && <div className="error-msg">{error}</div>}
      {success && <div style={{ background: '#ecfdf5', color: '#059669', padding: '0.75rem', borderRadius: '6px', border: '1px solid #10b981', marginBottom: '1rem', fontSize: '0.9rem' }}>{success}</div>}
      
      <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Penulis</label>
          <input type="text" name="author" placeholder="Contoh: Hendrikus Aldi" className="input-field" required />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Judul Skripsi / Tesis</label>
          <textarea name="title" placeholder="Masukkan judul lengkap..." className="input-field" rows="3" required style={{ resize: 'vertical' }}></textarea>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Tahun</label>
            <input type="number" name="year" placeholder="Contoh: 2026" className="input-field" defaultValue={new Date().getFullYear()} required />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Jenis</label>
            <select name="type" className="input-field">
              <option value="Skripsi">Skripsi</option>
              <option value="Tesis">Tesis</option>
              <option value="Disertasi">Disertasi</option>
              <option value="Laporan PKL">Laporan PKL</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Universitas / Institusi</label>
          <input type="text" name="university" placeholder="Contoh: Universitas Indonesia" className="input-field" defaultValue="Universitas Hasanuddin" />
        </div>
        
        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Menyimpan...' : 'Simpan ke Database'}
        </button>
      </form>
    </div>
  );
}
