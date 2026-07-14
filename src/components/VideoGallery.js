'use client';
import { useState } from 'react';

export default function VideoGallery({ initialData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' atau 'list'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'most_viewed'

  // Filter data berdasarkan pencarian
  let filteredData = initialData.filter((video) => {
    return video.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           video.channel.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Sorting
  filteredData = filteredData.sort((a, b) => {
    if (sortBy === 'newest') {
      return (b.upload_date || '') > (a.upload_date || '') ? 1 : -1;
    } else if (sortBy === 'oldest') {
      return (a.upload_date || '') > (b.upload_date || '') ? 1 : -1;
    } else if (sortBy === 'most_viewed') {
      return b.view_count - a.view_count;
    }
    return 0;
  });

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', minHeight: '600px' }}>
      
      {/* Toolbar / Search & Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        
        <div style={{ display: 'flex', gap: '1rem', flex: 2, minWidth: '300px' }}>
          <input 
            type="text" 
            placeholder="Cari judul video atau channel..." 
            className="input-field"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select 
            className="input-field" 
            style={{ maxWidth: '180px' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="most_viewed">Paling Banyak Ditonton</option>
          </select>
        </div>

        {/* View Mode Toggles */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--card-border)', padding: '0.25rem', borderRadius: '8px' }}>
          <button 
            onClick={() => setViewMode('grid')}
            style={{ 
              background: viewMode === 'grid' ? 'white' : 'transparent',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: viewMode === 'grid' ? '600' : '400',
              boxShadow: viewMode === 'grid' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            🖼️ Grid
          </button>
          <button 
            onClick={() => setViewMode('list')}
            style={{ 
              background: viewMode === 'list' ? 'white' : 'transparent',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: viewMode === 'list' ? '600' : '400',
              boxShadow: viewMode === 'list' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            📄 List
          </button>
        </div>
      </div>

      {/* Konten Galeri */}
      {filteredData.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '4rem 0' }}>
          Tidak ada video yang ditemukan.
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            /* ================= GRID VIEW ================= */
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {filteredData.map((video) => (
                <a key={video.id} href={video.webpage_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ 
                    border: '1px solid var(--card-border)', 
                    borderRadius: '12px', 
                    overflow: 'hidden',
                    background: 'white',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {/* Thumbnail */}
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#e2e8f0' }}>
                      {video.thumbnail ? (
                        <img src={video.thumbnail} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>No Image</div>
                      )}
                      
                      {/* Duration Badge */}
                      {video.duration_string && (
                        <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.8)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '500' }}>
                          {video.duration_string}
                        </div>
                      )}
                    </div>

                    {/* Meta & Title */}
                    <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                        {video.title}
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        {video.channel}
                      </p>
                      
                      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', paddingTop: '0.5rem', borderTop: '1px solid var(--card-border)' }}>
                        <span>👁️ {formatNumber(video.view_count)} views</span>
                        <span>{formatDate(video.upload_date)}</span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            /* ================= LIST VIEW ================= */
            <div className="table-container">
              <table>
                <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                  <tr>
                    <th width="15%">Thumbnail</th>
                    <th width="45%">Judul Video</th>
                    <th width="20%">Channel</th>
                    <th width="10%">Views</th>
                    <th width="10%">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((video) => (
                    <tr key={video.id}>
                      <td style={{ padding: '0.5rem 1rem' }}>
                        <div style={{ width: '120px', aspectRatio: '16/9', borderRadius: '6px', overflow: 'hidden', background: '#e2e8f0' }}>
                          {video.thumbnail && <img src={video.thumbnail} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        </div>
                      </td>
                      <td>
                        <a href={video.webpage_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--accent-primary)', fontWeight: '500' }}>
                          {video.title}
                        </a>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                          ⏱️ {video.duration_string}
                        </div>
                      </td>
                      <td>{video.channel}</td>
                      <td>{formatNumber(video.view_count)}</td>
                      <td>{formatDate(video.upload_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <div style={{ marginTop: '1.5rem', textAlign: 'right', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
        Menampilkan {filteredData.length} dari {initialData.length} video
      </div>
    </div>
  );
}
