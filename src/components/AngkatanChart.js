'use client';
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

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

export default function AngkatanChart({ data }) {
  const chartData = useMemo(() => {
    const angkatanCounts = {};
    
    data.forEach(video => {
      const angkatan = getAngkatan(video.nim);
      if (angkatan) {
        if (!angkatanCounts[angkatan]) {
          angkatanCounts[angkatan] = 0;
        }
        angkatanCounts[angkatan]++;
      }
    });

    // Convert to array format for Recharts
    const result = Object.keys(angkatanCounts).map(key => ({
      name: key,
      Total: angkatanCounts[key]
    }));

    // Sort by angkatan ascending
    return result.sort((a, b) => parseInt(a.name) - parseInt(b.name));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        Belum ada data angkatan
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '150px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
            dy={5}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(37, 99, 235, 0.05)' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            formatter={(value) => [`${value} Skripsi`, 'Total']}
            labelFormatter={(label) => `Angkatan ${label}`}
          />
          <Bar dataKey="Total" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="var(--accent-primary)" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
