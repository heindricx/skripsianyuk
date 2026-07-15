const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function parseCSVRow(row) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

async function main() {
  console.log("Membaca database_skripsi_lengkap.csv...");
  const filePath = path.join(__dirname, '..', 'database_skripsi_lengkap.csv');
  
  if (!fs.existsSync(filePath)) {
    console.error("File database_skripsi_lengkap.csv tidak ditemukan!");
    process.exit(1);
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');

  if (lines.length < 2) {
    console.log("File CSV kosong.");
    return;
  }

  // Get headers
  const headers = parseCSVRow(lines[0]);
  const idIdx = headers.indexOf('id');
  const titleIdx = headers.indexOf('title');
  const authorIdx = headers.indexOf('author');
  const nimIdx = headers.indexOf('nim');
  const publishYearIdx = headers.indexOf('publish_year');
  const typeIdx = headers.indexOf('thesis_type');
  const urlIdx = headers.indexOf('webpage_url');

  let successCount = 0;
  let errorCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const row = parseCSVRow(line);
    if (row.length < headers.length) continue;

    let id = row[idIdx];
    const url = row[urlIdx];

    // FIX EXCEL CORRUPTION (#NAME?)
    if (id === '#NAME?' || !id) {
      if (url && url.includes('v=')) {
        id = url.split('v=')[1].split('&')[0];
      }
    }

    if (!id) continue;

    const author = row[authorIdx] || null;
    const nim = row[nimIdx] || null;
    const academic_year = parseInt(row[publishYearIdx]) || null;
    const thesis_type = row[typeIdx] || null;
    const title = row[titleIdx];

    try {
      await prisma.youtubeVideo.update({
        where: { id: id },
        data: {
          title: title ? title : undefined,
          author: author,
          nim: nim,
          academic_year: academic_year,
          thesis_type: thesis_type
        }
      });
      successCount++;
    } catch (err) {
      console.error(`Error update video ${id}: ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\nSelesai! Berhasil memperbarui ${successCount} video. Gagal: ${errorCount}`);
}

main()
  .catch((e) => {
    console.error("Terjadi error saat import:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
