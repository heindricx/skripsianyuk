'use client';
import { useState, useRef } from 'react';
import { addThesis, addYoutubeVideo, updateYoutubeVideo, deleteYoutubeVideo, logoutAdmin } from '@/app/actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Database, FileText, Video, LogOut, ArrowLeft, Edit, Save, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';

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

  const handleDeleteSubmit = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus skripsi ini? Tindakan ini tidak dapat dibatalkan.')) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    const formData = new FormData();
    formData.append('id', id);
    const result = await deleteYoutubeVideo(formData);
    
    if (result.success) {
      setSuccess('Skripsi berhasil dihapus secara permanen!');
      router.refresh(); // Refresh data dari server
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Panel Manajemen</h3>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/">
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1' }}>
              <ArrowLeft size={16} /> Ke Beranda
            </button>
          </Link>
          <button onClick={handleLogout} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ef4444' }}>
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--card-border)', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => { setActiveTab('manage'); setEditingThesis(null); setError(''); setSuccess(''); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'manage' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            padding: '0.75rem 1rem',
            cursor: 'pointer',
            fontWeight: activeTab === 'manage' ? '600' : '500',
            color: activeTab === 'manage' ? 'var(--accent-primary)' : 'var(--text-secondary)'
          }}
        >
          <Database size={18} /> Kelola Data
        </button>
        <button 
          onClick={() => { setActiveTab('thesis'); setEditingThesis(null); setError(''); setSuccess(''); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'thesis' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            padding: '0.75rem 1rem',
            cursor: 'pointer',
            fontWeight: activeTab === 'thesis' ? '600' : '500',
            color: activeTab === 'thesis' ? 'var(--accent-primary)' : 'var(--text-secondary)'
          }}
        >
          <FileText size={18} /> Tambah Skripsi
        </button>
        <button 
          onClick={() => { setActiveTab('video'); setEditingThesis(null); setError(''); setSuccess(''); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'video' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            padding: '0.75rem 1rem',
            cursor: 'pointer',
            fontWeight: activeTab === 'video' ? '600' : '500',
            color: activeTab === 'video' ? 'var(--accent-primary)' : 'var(--text-secondary)'
          }}
        >
          <Video size={18} /> Tambah Video
        </button>
      </div>
      
      {error && (
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '6px', border: '1px solid #f87171', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}
      {success && (
        <div style={{ background: '#ecfdf5', color: '#059669', padding: '0.75rem', borderRadius: '6px', border: '1px solid #10b981', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <CheckCircle size={18} /> {success}
        </div>
      )}
      
      {/* MANAGE TAB */}
      {activeTab === 'manage' && !editingThesis && (
        <div>
          <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Klik tombol Edit pada baris skripsi yang ingin Anda ubah datanya (Nama Penulis, Tahun Lulus, dll).</p>
          <div className="table-container" style={{ maxHeight: '600px', overflowY: 'auto', border: '1px solid var(--card-border)', borderRadius: '8px' }}>
            <table style={{ width: '100%', fontSize: '0.9rem', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: '#f8fafc', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <tr>
                  <th width="40%" style={{ padding: '1rem' }}>Judul</th>
                  <th width="20%" style={{ padding: '1rem' }}>Penulis</th>
                  <th width="10%" style={{ padding: '1rem' }}>Tahun</th>
                  <th width="15%" style={{ padding: '1rem' }}>Jenis</th>
                  <th width="15%" style={{ padding: '1rem', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {initialTheses.map(thesis => (
                  <tr key={thesis.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: '500' }}>
                        {thesis.title}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{thesis.author || '-'}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{thesis.academic_year || '-'}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{thesis.thesis_type || '-'}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button 
                          onClick={() => setEditingThesis(thesis)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.4rem 0.75rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' }}
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteSubmit(thesis.id)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.4rem 0.75rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' }}
                          title="Hapus"
                          disabled={loading}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT FORM */}
      {editingThesis && (
        <div className="animate-fade-in">
          <button 
            onClick={() => setEditingThesis(null)}
            style={{ marginBottom: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}
          >
            <ArrowLeft size={16} /> Kembali ke Daftar
          </button>
          
          <div style={{ background: '#f8fafc', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '2rem' }}>
            <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem' }}>
              Edit Data: <span style={{ color: 'var(--text-secondary)', fontWeight: '400' }}>{editingThesis.id}</span>
            </h4>
            
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <input type="hidden" name="id" value={editingThesis.id} />
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>Judul Lengkap</label>
                <textarea name="title" defaultValue={editingThesis.title} className="input-field" rows="3" required style={{ resize: 'vertical' }}></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>Penulis (Author)</label>
                  <input type="text" name="author" defaultValue={editingThesis.author || ''} placeholder="Contoh: Hendrikus Aldi" className="input-field" />
                </div>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>NIM</label>
                  <input type="text" name="nim" defaultValue={editingThesis.nim || ''} placeholder="Contoh: H12116507" className="input-field" />
                </div>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>Tahun Akademik</label>
                  <input type="number" name="academic_year" defaultValue={editingThesis.academic_year || ''} placeholder="Contoh: 2024" className="input-field" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>Jenis Karya Tulis</label>
                <select name="thesis_type" defaultValue={editingThesis.thesis_type || ''} className="input-field">
                  <option value="">(Kosongkan jika tidak diketahui)</option>
                  <option value="Skripsi">Skripsi</option>
                  <option value="Tesis">Tesis</option>
                  <option value="Disertasi">Disertasi</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" disabled={loading} style={{ background: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Save size={18} /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* THESIS FORM */}
      {activeTab === 'thesis' && (
        <form ref={formRef} onSubmit={handleThesisSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: '#f8fafc', padding: '2rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>Penulis</label>
            <input type="text" name="author" placeholder="Contoh: Hendrikus Aldi" className="input-field" required />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>Judul Skripsi / Tesis</label>
            <textarea name="title" placeholder="Masukkan judul lengkap..." className="input-field" rows="3" required style={{ resize: 'vertical' }}></textarea>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>Tahun</label>
              <input type="number" name="year" placeholder="Contoh: 2026" className="input-field" defaultValue={new Date().getFullYear()} required />
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>Jenis</label>
              <select name="type" className="input-field">
                <option value="Skripsi">Skripsi</option>
                <option value="Tesis">Tesis</option>
                <option value="Disertasi">Disertasi</option>
                <option value="Laporan PKL">Laporan PKL</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>Universitas / Institusi</label>
            <input type="text" name="university" placeholder="Contoh: Universitas Indonesia" className="input-field" defaultValue="Universitas Hasanuddin" />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" className="btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={18} /> {loading ? 'Menyimpan...' : 'Simpan Skripsi'}
            </button>
          </div>
        </form>
      )}

      {/* VIDEO FORM */}
      {activeTab === 'video' && (
        <form ref={formRef} onSubmit={handleVideoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: '#f8fafc', padding: '2rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>ID Video YouTube</label>
            <input type="text" name="id" placeholder="Contoh: dQw4w9WgXcQ" className="input-field" required />
            <small style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '0.35rem', fontSize: '0.8rem' }}>ID adalah kode acak setelah v= pada URL YouTube.</small>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>Judul Video</label>
            <input type="text" name="title" placeholder="Masukkan judul video..." className="input-field" required />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>Nama Channel</label>
            <input type="text" name="channel" placeholder="Contoh: Departemen Statistika Unhas" className="input-field" />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" className="btn-primary" disabled={loading} style={{ background: '#eab308', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={18} /> {loading ? 'Menyimpan...' : 'Simpan Video'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
