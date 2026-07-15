const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const videos = await prisma.youtubeVideo.findMany({
    orderBy: { upload_date: 'desc' }
  });

  if (videos.length === 0) {
    console.log("Database kosong.");
    return;
  }

  // Get headers from the first object
  const headers = ['id', 'title', 'channel', 'author', 'academic_year', 'thesis_type', 'view_count', 'like_count', 'upload_date', 'duration_string', 'webpage_url', 'createdAt'];
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';

  // Helper to escape CSV fields (handling commas and quotes in titles)
  const escapeCSV = (field) => {
    if (field === null || field === undefined) return '';
    const str = String(field);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  for (const video of videos) {
    const row = headers.map(header => escapeCSV(video[header]));
    csvContent += row.join(',') + '\n';
  }

  const outputPath = path.join(__dirname, '..', 'database_skripsi_lengkap.csv');
  fs.writeFileSync(outputPath, csvContent, 'utf8');
  console.log(`Berhasil mengekspor ${videos.length} baris data ke: ${outputPath}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
