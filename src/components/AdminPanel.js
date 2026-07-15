'use client';
import { useState, useRef } from 'react';
import { addThesis, addYoutubeVideo, updateYoutubeVideo, logoutAdmin } from '@/app/actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPanel({ initialTheses = [] }) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('manage'); // 'thesis', 'video', 'manage'
  const [editingThesis, setEditingThesis] = useState(null);
  
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    const formData = new FormData(e.target);
    const result = await updateYoutubeVideo(formData);
    
    if (result.success) {
      setSuccess('Data berhasil diperbarui!');
      setEditingThesis(null);
      router.refresh(); // Refresh data dari server
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--text-primary)' }}>Panel Manajemen</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/">
            <button className="btn-primary" style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1' }}>Ke Beranda</button>
          </Link>
          <button onClick={handleLogout} className="btn-primary" style={{ background: '#ef4444' }}>Keluar</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => { setActiveTab('manage'); setEditingThesis(null); setError(''); setSuccess(''); }}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'manage' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontWeight: activeTab === 'manage' ? '600' : '400',
            color: activeTab === 'manage' ? 'var(--accent-primary)' : 'var(--text-secondary)'
          }}
        >
          📋 Kelola Data
        </button>
        <button 
          onClick={() => { setActiveTab('thesis'); setEditingThesis(null); setError(''); setSuccess(''); }}
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
          📄 Tambah Skripsi
        </button>
        <button 
          onClick={() => { setActiveTab('video'); setEditingThesis(null); setError(''); setSuccess(''); }}
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
          ▶️ Tambah Video
        </button>
      </div>
      
      {error && <div className="error-msg">{error}</div>}
      {success && <div style={{ background: '#ecfdf5', color: '#059669', padding: '0.75rem', borderRadius: '6px', border: '1px solid #10b981', marginBottom: '1rem', fontSize: '0.9rem' }}>{success}</div>}
      
      {/* MANAGE TAB */}
      {activeTab === 'manage' && !editingThesis && (
        <div>
          <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Klik tombol Edit pada baris skripsi yang ingin Anda ubah datanya (Nama Penulis, Tahun Lulus, dll).</p>
          <div className="table-container" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.9rem' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <tr>
                  <th width="40%">Judul</th>
                  <th width="20%">Penulis</th>
                  <th width="10%">Tahun</th>
                  <th width="15%">Jenis</th>
                  <th width="15%">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {initialTheses.map(thesis => (
                  <tr key={thesis.id}>
                    <td>
                      <div style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {thesis.title}
                      </div>
                    </td>
                    <td>{thesis.author || '-'}</td>
                    <td>{thesis.academic_year || '-'}</td>
                    <td>{thesis.thesis_type || '-'}</td>
                    <td>
                      <button 
                        onClick={() => setEditingThesis(thesis)}
                        style={{ padding: '0.25rem 0.75rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        ✏️ Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT FORM (Muncul ketika klik Edit) */}
      {editingThesis && (
        <div>
          <button 
            onClick={() => setEditingThesis(null)}
            style={{ marginBottom: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            ← Kembali ke Daftar
          </button>
          <h4 style={{ marginBottom: '1.5rem' }}>Edit Data: {editingThesis.id}</h4>
          <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <input type="hidden" name="id" value={editingThesis.id} />
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Judul Lengkap</label>
              <textarea name="title" defaultValue={editingThesis.title} className="input-field" rows="3" required style={{ resize: 'vertical' }}></textarea>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Penulis (Author)</label>
                <input type="text" name="author" defaultValue={editingThesis.author || ''} placeholder="Contoh: Hendrikus Aldi" className="input-field" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>NIM</label>
                <input type="text" name="nim" defaultValue={editingThesis.nim || ''} placeholder="Contoh: H12116507" className="input-field" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Tahun Akademik</label>
                <input type="number" name="academic_year" defaultValue={editingThesis.academic_year || ''} placeholder="Contoh: 2024" className="input-field" />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Jenis Karya Tulis</label>
              <select name="thesis_type" defaultValue={editingThesis.thesis_type || ''} className="input-field">
                <option value="">(Kosongkan jika tidak diketahui)</option>
                <option value="Skripsi">Skripsi</option>
                <option value="Tesis">Tesis</option>
                <option value="Disertasi">Disertasi</option>
              </select>
            </div>
            
            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem', background: '#10b981' }}>
              {loading ? 'Menyimpan...' : '💾 Simpan Perubahan'}
            </button>
          </form>
        </div>
      )}

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
