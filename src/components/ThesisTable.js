'use client';
import { useState } from 'react';

export default function ThesisTable({ initialData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  
  // Ambil tahun-tahun unik dari data untuk dropdown filter
  const uniqueYears = [...new Set(initialData.map(t => t.year))].sort((a, b) => b - a);

  // Filter data berdasarkan pencarian dan tahun
  const filteredData = initialData.filter((thesis) => {
    const matchSearch = thesis.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        thesis.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchYear = yearFilter === '' || thesis.year.toString() === yearFilter;
    return matchSearch && matchYear;
  });

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '600px' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Cari judul atau penulis..." 
          className="input-field"
          style={{ flex: 2, minWidth: '200px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="input-field" 
          style={{ flex: 1, minWidth: '120px' }}
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
        >
          <option value="">Semua Tahun</option>
          {uniqueYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="table-container" style={{ flex: 1, overflowY: 'auto' }}>
        <table>
          <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
            <tr>
              <th width="20%">Penulis</th>
              <th width="50%">Judul</th>
              <th width="15%">Tahun</th>
              <th width="15%">Jenis</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((thesis) => (
                <tr key={thesis.id}>
                  <td>{thesis.author}</td>
                  <td><strong>{thesis.title}</strong></td>
                  <td>{thesis.year}</td>
                  <td><span style={{ 
                    background: 'rgba(59, 130, 246, 0.2)', 
                    color: 'var(--accent-primary)', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem' 
                  }}>{thesis.type}</span></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Tidak ada data ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '1rem', textAlign: 'right', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Menampilkan {filteredData.length} dari {initialData.length} skripsi
      </div>
    </div>
  );
}
