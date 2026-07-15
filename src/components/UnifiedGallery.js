'use client';
import React, { useState, useMemo } from 'react';

export default function UnifiedGallery({ initialData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' atau 'list'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'most_viewed'
  
  // Year Filter State
  const [selectedYear, setSelectedYear] = useState('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Accordion State
  const [expandedId, setExpandedId] = useState(null);

  // Helper for year
  const getYear = (dateStr) => {
    return (dateStr && dateStr.length >= 4) ? dateStr.substring(0, 4) : 'Unknown';
  };

  // Get unique years for the filter dropdown
  const availableYears = useMemo(() => {
    const years = initialData.map(v => getYear(v.upload_date)).filter(y => y !== 'Unknown');
    const uniqueYears = [...new Set(years)];
    return uniqueYears.sort((a, b) => b - a); // descending
  }, [initialData]);

  // Filter data berdasarkan pencarian dan tahun
  let filteredData = initialData.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          video.channel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (video.author && video.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (video.nim && video.nim.toLowerCase().includes(searchTerm.toLowerCase()));
    const videoYear = getYear(video.upload_date);
    const matchesYear = selectedYear === 'all' || videoYear === selectedYear;
    return matchesSearch && matchesYear;
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

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Formatting Utilities
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

  const handleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', minHeight: '800px' }}>
      
      {/* Toolbar / Search & Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        
        <div style={{ display: 'flex', gap: '1rem', flex: 2, minWidth: '300px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Cari judul, penulis, atau NIM..." 
            className="input-field"
            value={searchTerm}
            style={{ flex: 1, minWidth: '200px' }}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          
          <select 
            className="input-field" 
            style={{ width: '130px' }}
            value={selectedYear}
            onChange={(e) => { setSelectedYear(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">Semua Tahun</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select 
            className="input-field" 
            style={{ width: '180px' }}
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
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '4rem 0', flex: 1 }}>
          Tidak ada skripsi yang ditemukan.
        </div>
      ) : (
        <div style={{ flex: 1 }}>
          {viewMode === 'grid' ? (
            /* ================= GRID VIEW (Teks Saja) ================= */
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {currentItems.map((video) => (
                <div key={video.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div 
                    onClick={() => handleExpand(video.id)}
                    style={{ 
                      border: expandedId === video.id ? '2px solid var(--accent-primary)' : '1px solid var(--card-border)', 
                      borderRadius: '12px', 
                      overflow: 'hidden',
                      background: 'white',
                      transition: 'all 0.2s ease-in-out',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: expandedId === video.id ? '0 10px 15px -3px rgba(37, 99, 235, 0.15)' : 'none'
                    }}
                    onMouseEnter={(e) => { if (expandedId !== video.id) e.currentTarget.style.transform = 'translateY(-4px)'; }}
                    onMouseLeave={(e) => { if (expandedId !== video.id) e.currentTarget.style.transform = 'none'; }}
                  >
                    {/* Meta & Title Only (No Thumbnail in Grid Default View) */}
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        {video.thesis_type && (
                          <span style={{ fontSize: '0.7rem', background: '#e2e8f0', color: '#475569', padding: '4px 8px', borderRadius: '4px', fontWeight: '600', textTransform: 'uppercase' }}>{video.thesis_type}</span>
                        )}
                        {video.academic_year && (
                          <span style={{ fontSize: '0.7rem', background: 'var(--accent-primary)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontWeight: '600', textTransform: 'uppercase' }}>Lulusan {video.academic_year}</span>
                        )}
                        {video.duration_string && (
                          <span style={{ fontSize: '0.7rem', background: '#f1f5f9', color: '#64748b', padding: '4px 8px', borderRadius: '4px', fontWeight: '600' }}>⏱️ {video.duration_string}</span>
                        )}
                      </div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>
                        {video.title}
                      </h4>
                      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: video.author ? '600' : '400' }}>
                          {video.author ? `👤 ${video.author}` : video.channel}
                        </p>
                        {video.nim && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>🆔 {video.nim}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Accordion for Grid (Thumbnail/Player ada di sini) */}
                  {expandedId === video.id && (
                    <div className="animate-fade-in" style={{ marginTop: '1rem', padding: '1.5rem', background: '#f8fafc', border: '1px solid var(--accent-primary)', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Video Presentasi</h4>
                        <span style={{ background: 'var(--accent-primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          Upload {getYear(video.upload_date)}
                        </span>
                      </div>
                      {/* Video Player / Thumbnail */}
                      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px', marginBottom: '1rem', background: '#e2e8f0' }}>
                        <iframe 
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                          src={`https://www.youtube.com/embed/${video.id}`} 
                          title="YouTube video player" 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      </div>
                      <a href={video.webpage_url} target="_blank" rel="noopener noreferrer">
                        <button className="btn-primary" style={{ width: '100%', background: '#ef4444' }}>Buka di YouTube</button>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* ================= LIST VIEW (Tanpa Kolom Thumbnail) ================= */
            <div className="table-container">
              <table>
                <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                  <tr>
                    <th width="45%">Judul Skripsi</th>
                    <th width="20%">Penulis & NIM</th>
                    <th width="15%">Info</th>
                    <th width="10%">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((video) => (
                    <React.Fragment key={video.id}>
                      <tr 
                        onClick={() => handleExpand(video.id)}
                        style={{ cursor: 'pointer', background: expandedId === video.id ? '#f1f5f9' : 'transparent' }}
                      >
                        <td style={{ padding: '1rem' }}>
                          <div style={{ color: expandedId === video.id ? 'var(--accent-primary)' : 'inherit', fontWeight: '600', fontSize: '1rem', lineHeight: '1.4' }}>
                            {video.title}
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: video.author ? '600' : '400', color: 'var(--text-primary)' }}>
                            {video.author || video.channel}
                          </div>
                          {video.nim && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                              {video.nim}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {video.thesis_type && <span style={{ fontSize: '0.75rem', background: '#e2e8f0', color: '#475569', padding: '2px 6px', borderRadius: '4px', width: 'fit-content' }}>{video.thesis_type}</span>}
                            {video.academic_year && <span style={{ fontSize: '0.75rem', background: 'var(--accent-primary)', color: 'white', padding: '2px 6px', borderRadius: '4px', width: 'fit-content' }}>Lulus {video.academic_year}</span>}
                          </div>
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                          {formatDate(video.upload_date)}
                        </td>
                      </tr>
                      {/* Accordion Row for List View (Thumbnail/Player ada di sini) */}
                      {expandedId === video.id && (
                        <tr className="animate-fade-in" style={{ background: '#f8fafc' }}>
                          <td colSpan="4" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                              {/* Video Player / Thumbnail */}
                              <div style={{ flex: 1, maxWidth: '500px' }}>
                                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px', marginBottom: '1rem', background: '#e2e8f0' }}>
                                  <iframe 
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                    src={`https://www.youtube.com/embed/${video.id}`} 
                                    title="YouTube video player" 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                  ></iframe>
                                </div>
                              </div>
                              <div style={{ flex: 1 }}>
                                <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', lineHeight: '1.4' }}>{video.title}</h3>
                                {video.author && <p style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: '600' }}>👤 Penulis: {video.author}</p>}
                                {video.nim && <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '1rem' }}>🆔 NIM: {video.nim}</p>}
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>📺 Channel: {video.channel}</p>
                                <a href={video.webpage_url} target="_blank" rel="noopener noreferrer">
                                  <button className="btn-primary" style={{ background: '#ef4444' }}>Tonton Langsung di YouTube</button>
                                </a>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--card-border)' }}>
          <button 
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', background: currentPage === 1 ? '#e2e8f0' : 'var(--accent-primary)', color: currentPage === 1 ? '#94a3b8' : 'white', border: 'none', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            Sebelumnya
          </button>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {/* Simple pagination logic for pages */}
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              // Show limited pages (first, last, current, adjacent)
              if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                return (
                  <button 
                    key={page} 
                    onClick={() => paginate(page)}
                    style={{ 
                      width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                      background: currentPage === page ? 'var(--accent-primary)' : 'transparent',
                      color: currentPage === page ? 'white' : 'var(--text-secondary)',
                      fontWeight: currentPage === page ? '700' : '500',
                      cursor: 'pointer'
                    }}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} style={{ color: 'var(--text-secondary)', alignSelf: 'center' }}>...</span>;
              }
              return null;
            })}
          </div>

          <button 
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', background: currentPage === totalPages ? '#e2e8f0' : 'var(--accent-primary)', color: currentPage === totalPages ? '#94a3b8' : 'white', border: 'none', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Selanjutnya
          </button>
        </div>
      )}
      
      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
        Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredData.length)} dari {filteredData.length} skripsi
      </div>
    </div>
  );
}
