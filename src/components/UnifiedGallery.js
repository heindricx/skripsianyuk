'use client';
import React, { useState, useMemo } from 'react';
import { Search, LayoutGrid, List, User, IdCard, GraduationCap, Calendar, PlaySquare, ExternalLink, Filter, BookOpen } from 'lucide-react';

export default function UnifiedGallery({ initialData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' atau 'list'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'most_viewed'
  
  // Year & Angkatan Filter State
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedAngkatan, setSelectedAngkatan] = useState('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Accordion State
  const [expandedId, setExpandedId] = useState(null);

  // Helper untuk mendapatkan Angkatan dari NIM
  const getAngkatan = (nim) => {
    if (!nim) return null;
    const upperNim = nim.toUpperCase().trim();
    if (upperNim.startsWith('H051') || upperNim.startsWith('H121')) {
      const yearStr = upperNim.substring(4, 6);
      if (!isNaN(parseInt(yearStr))) {
        return '20' + yearStr;
      }
    }
    return null;
  };

  // Get unique years (academic_year) for the filter dropdown
  const availableYears = useMemo(() => {
    const years = initialData.map(v => v.academic_year).filter(y => y !== null && y !== undefined);
    const uniqueYears = [...new Set(years)];
    return uniqueYears.sort((a, b) => b - a); // descending
  }, [initialData]);

  // Get unique angkatan for the filter dropdown
  const availableAngkatan = useMemo(() => {
    const angkatan = initialData.map(v => getAngkatan(v.nim)).filter(a => a !== null);
    const uniqueAngkatan = [...new Set(angkatan)];
    return uniqueAngkatan.sort((a, b) => b - a); // descending
  }, [initialData]);

  // Filter data berdasarkan pencarian, tahun publish, dan angkatan
  let filteredData = initialData.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (video.author && video.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (video.nim && video.nim.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesYear = selectedYear === 'all' || video.academic_year === parseInt(selectedYear);
    
    const videoAngkatan = getAngkatan(video.nim);
    const matchesAngkatan = selectedAngkatan === 'all' || videoAngkatan === selectedAngkatan;
    
    return matchesSearch && matchesYear && matchesAngkatan;
  });

  // Sorting
  filteredData = filteredData.sort((a, b) => {
    if (sortBy === 'newest') {
      return (b.academic_year || 0) - (a.academic_year || 0);
    } else if (sortBy === 'oldest') {
      return (a.academic_year || 0) - (b.academic_year || 0);
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
          
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Cari judul, penulis, atau NIM..." 
              className="input-field"
              value={searchTerm}
              style={{ width: '100%', paddingLeft: '38px' }}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          
          {/* Filter Tahun Publish */}
          <div style={{ position: 'relative', width: '160px' }}>
            <Calendar size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <select 
              className="input-field" 
              style={{ width: '100%', paddingLeft: '32px' }}
              value={selectedYear}
              onChange={(e) => { setSelectedYear(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">Semua Tahun</option>
              {availableYears.map(year => (
                <option key={year} value={year}>Tahun {year}</option>
              ))}
            </select>
          </div>

          {/* Filter Angkatan */}
          <div style={{ position: 'relative', width: '160px' }}>
            <GraduationCap size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <select 
              className="input-field" 
              style={{ width: '100%', paddingLeft: '32px' }}
              value={selectedAngkatan}
              onChange={(e) => { setSelectedAngkatan(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">Semua Angkatan</option>
              {availableAngkatan.map(angkatan => (
                <option key={angkatan} value={angkatan}>Angkatan {angkatan}</option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div style={{ position: 'relative', width: '180px' }}>
            <Filter size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <select 
              className="input-field" 
              style={{ width: '100%', paddingLeft: '32px' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Terbaru (Tahun Publish)</option>
              <option value="oldest">Terlama (Tahun Publish)</option>
              <option value="most_viewed">Paling Banyak Ditonton</option>
            </select>
          </div>

        </div>

        {/* View Mode Toggles */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--card-border)', padding: '0.25rem', borderRadius: '8px' }}>
          <button 
            onClick={() => setViewMode('grid')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: viewMode === 'grid' ? 'white' : 'transparent',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              color: viewMode === 'grid' ? '#0f172a' : 'var(--text-secondary)',
              fontWeight: viewMode === 'grid' ? '600' : '400',
              boxShadow: viewMode === 'grid' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <LayoutGrid size={18} /> Grid
          </button>
          <button 
            onClick={() => setViewMode('list')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: viewMode === 'list' ? 'white' : 'transparent',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              color: viewMode === 'list' ? '#0f172a' : 'var(--text-secondary)',
              fontWeight: viewMode === 'list' ? '600' : '400',
              boxShadow: viewMode === 'list' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <List size={18} /> List
          </button>
        </div>
      </div>

      {/* Konten Galeri */}
      {filteredData.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '4rem 0', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <BookOpen size={48} style={{ color: '#cbd5e1' }} />
          <span>Tidak ada skripsi yang ditemukan.</span>
        </div>
      ) : (
        <div style={{ flex: 1 }}>
          {viewMode === 'grid' ? (
            /* ================= GRID VIEW ================= */
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
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
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      
                      {/* Badges */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        {video.thesis_type && (
                          <span style={{ fontSize: '0.7rem', background: '#e2e8f0', color: '#475569', padding: '4px 8px', borderRadius: '4px', fontWeight: '600', textTransform: 'uppercase' }}>{video.thesis_type}</span>
                        )}
                        {video.academic_year && (
                          <span style={{ fontSize: '0.7rem', background: 'var(--accent-primary)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontWeight: '600' }}>{video.academic_year}</span>
                        )}
                        {getAngkatan(video.nim) && (
                          <span style={{ fontSize: '0.7rem', background: '#fef08a', color: '#854d0e', padding: '4px 8px', borderRadius: '4px', fontWeight: '600' }}>ANGKATAN {getAngkatan(video.nim)}</span>
                        )}
                      </div>
                      
                      {/* Title */}
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>
                        {video.title}
                      </h4>
                      
                      {/* Meta */}
                      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {video.author && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                            <User size={14} /> <span>{video.author}</span>
                          </div>
                        )}
                        {video.nim && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <IdCard size={14} /> <span>{video.nim}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Accordion for Grid */}
                  {expandedId === video.id && (
                    <div className="animate-fade-in" style={{ marginTop: '1rem', padding: '1.5rem', background: '#f8fafc', border: '1px solid var(--accent-primary)', borderRadius: '12px' }}>
                      {/* Detailed Information in Dropdown */}
                      <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: '600' }}>
                          <User size={18} className="text-gray-500" /> Penulis: {video.author || '-'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                          <IdCard size={18} /> NIM: {video.nim || '-'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                          <GraduationCap size={18} /> Angkatan: {getAngkatan(video.nim) || '-'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                          <Calendar size={18} /> Tahun Publish: {video.academic_year || '-'}
                        </div>
                      </div>
                      
                      {/* Video Player */}
                      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px', marginBottom: '1rem', background: '#e2e8f0', border: '1px solid var(--card-border)' }}>
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
                        <button className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#ef4444' }}>
                          <PlaySquare size={18} /> Tonton Langsung di YouTube
                        </button>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* ================= LIST VIEW ================= */
            <div className="table-container">
              <table>
                <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                  <tr>
                    <th width="50%">Judul Skripsi</th>
                    <th width="30%">Penulis & NIM</th>
                    <th width="20%">Info</th>
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
                          {video.author && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                              <User size={14} /> {video.author}
                            </div>
                          )}
                          {video.nim && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                              <IdCard size={14} /> {video.nim}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                            {video.thesis_type && <span style={{ fontSize: '0.75rem', background: '#e2e8f0', color: '#475569', padding: '2px 6px', borderRadius: '4px' }}>{video.thesis_type}</span>}
                            {video.academic_year && <span style={{ fontSize: '0.75rem', background: 'var(--accent-primary)', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>{video.academic_year}</span>}
                            {getAngkatan(video.nim) && <span style={{ fontSize: '0.75rem', background: '#fef08a', color: '#854d0e', padding: '2px 6px', borderRadius: '4px' }}>Angkatan {getAngkatan(video.nim)}</span>}
                          </div>
                        </td>
                      </tr>
                      
                      {/* Accordion Row for List View */}
                      {expandedId === video.id && (
                        <tr className="animate-fade-in" style={{ background: '#f8fafc', borderBottom: '2px solid var(--accent-primary)' }}>
                          <td colSpan="3" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                              
                              <div style={{ flex: 1, minWidth: '300px' }}>
                                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', lineHeight: '1.4', color: 'var(--text-primary)' }}>{video.title}</h3>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: '600' }}>
                                    <div style={{ padding: '0.5rem', background: '#e2e8f0', borderRadius: '8px', color: '#475569' }}><User size={20} /></div>
                                    <span>Penulis: {video.author || '-'}</span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                    <div style={{ padding: '0.5rem', background: '#e2e8f0', borderRadius: '8px', color: '#475569' }}><IdCard size={20} /></div>
                                    <span>NIM: {video.nim || '-'}</span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                    <div style={{ padding: '0.5rem', background: '#fef08a', borderRadius: '8px', color: '#854d0e' }}><GraduationCap size={20} /></div>
                                    <span>Angkatan: {getAngkatan(video.nim) || '-'}</span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                    <div style={{ padding: '0.5rem', background: '#dbeafe', borderRadius: '8px', color: '#1e40af' }}><Calendar size={20} /></div>
                                    <span>Tahun Publish: {video.academic_year || '-'}</span>
                                  </div>
                                </div>
                                
                                <a href={video.webpage_url} target="_blank" rel="noopener noreferrer">
                                  <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#ef4444', width: 'fit-content', padding: '0.75rem 1.5rem' }}>
                                    <PlaySquare size={18} /> Tonton Langsung di YouTube
                                  </button>
                                </a>
                              </div>

                              {/* Video Player */}
                              <div style={{ flex: 1, minWidth: '350px', maxWidth: '500px' }}>
                                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', background: '#e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
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
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
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
