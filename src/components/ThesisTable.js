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
    <div className="glass-card animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: 'auto', minHeight: '600px' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Cari judul skripsi atau nama penulis..." 
          className="input-field"
          style={{ flex: 3, minWidth: '300px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="input-field" 
          style={{ flex: 1, minWidth: '150px' }}
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
        >
          <option value="">Semua Tahun</option>
          {uniqueYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="table-container" style={{ flex: 1 }}>
        <table>
          <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
            <tr>
              <th width="20%">Penulis</th>
              <th width="50%">Judul Skripsi</th>
              <th width="15%">Tahun</th>
              <th width="15%">Jenis</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((thesis) => (
                <tr key={thesis.id}>
                  <td><strong>{thesis.author}</strong></td>
                  <td style={{ lineHeight: '1.5' }}>{thesis.title}</td>
                  <td>{thesis.year}</td>
                  <td>
                    <span style={{ 
                      background: 'var(--bg-gradient)', 
                      color: 'var(--accent-secondary)', 
                      padding: '4px 10px', 
                      borderRadius: '16px', 
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      border: '1px solid var(--card-border)'
                    }}>
                      {thesis.type}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem' }}>
                  Tidak ada data yang sesuai dengan pencarian Anda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '1.5rem', textAlign: 'right', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
        Menampilkan {filteredData.length} dari {initialData.length} total repositori
      </div>
    </div>
  );
}
