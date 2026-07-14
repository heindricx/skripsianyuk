'use client';
import { useState, useRef } from 'react';
import { addThesis, addYoutubeVideo, logoutAdmin } from '@/app/actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPanel() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('thesis'); // 'thesis' or 'video'
  
  const formRef = useRef(null);
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAdmin();
    router.refresh();
  };

  const handleThesisSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    const formData = new FormData(e.target);
    const result = await addThesis(formData);
    
    if (result.success) {
      setSuccess('Data Skripsi berhasil ditambahkan ke database!');
      formRef.current.reset();
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    const formData = new FormData(e.target);
    const result = await addYoutubeVideo(formData);
    
    if (result.success) {
      setSuccess('Data Video berhasil ditambahkan ke database!');
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => { setActiveTab('thesis'); setError(''); setSuccess(''); }}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'thesis' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontWeight: activeTab === 'thesis' ? '600' : '400',
            color: activeTab === 'thesis' ? 'var(--accent-primary)' : 'var(--text-secondary)'
          }}
        >
          📄 Data Skripsi
        </button>
        <button 
          onClick={() => { setActiveTab('video'); setError(''); setSuccess(''); }}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'video' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontWeight: activeTab === 'video' ? '600' : '400',
            color: activeTab === 'video' ? 'var(--accent-primary)' : 'var(--text-secondary)'
          }}
        >
          ▶️ Video YouTube
        </button>
      </div>
      
      {error && <div className="error-msg">{error}</div>}
      {success && <div style={{ background: '#ecfdf5', color: '#059669', padding: '0.75rem', borderRadius: '6px', border: '1px solid #10b981', marginBottom: '1rem', fontSize: '0.9rem' }}>{success}</div>}
      
      {/* THESIS FORM */}
      {activeTab === 'thesis' && (
        <form ref={formRef} onSubmit={handleThesisSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
            {loading ? 'Menyimpan...' : 'Simpan Skripsi ke Database'}
          </button>
        </form>
      )}

      {/* VIDEO FORM */}
      {activeTab === 'video' && (
        <form ref={formRef} onSubmit={handleVideoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-secondary)' }}>ID Video YouTube</label>
            <input type="text" name="id" placeholder="Contoh: dQw4w9WgXcQ" className="input-field" required />
            <small style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '0.25rem' }}>ID adalah kode acak setelah v= pada URL YouTube.</small>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Judul Video</label>
            <input type="text" name="title" placeholder="Masukkan judul video..." className="input-field" required />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Nama Channel</label>
            <input type="text" name="channel" placeholder="Contoh: Departemen Statistika Unhas" className="input-field" />
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem', background: '#eab308' }}>
            {loading ? 'Menyimpan...' : 'Simpan Video ke Database'}
          </button>
        </form>
      )}
    </div>
  );
}
