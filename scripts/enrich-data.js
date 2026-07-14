const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Fungsi untuk membersihkan dan menormalkan string (hapus tanda baca, jadikan lowercase)
function normalizeString(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
}

// Fungsi menghitung persentase kecocokan kata
function calculateMatchScore(str1, str2) {
  const words1 = str1.split(' ').filter(w => w.length > 2);
  const words2 = str2.split(' ').filter(w => w.length > 2);
  
  if (words1.length === 0 || words2.length === 0) return 0;
  
  let matchCount = 0;
  for (let w1 of words1) {
    if (words2.includes(w1)) matchCount++;
  }
  
  return (matchCount / Math.max(words1.length, words2.length)) * 100;
}

async function main() {
  console.log("Membaca database-skripsi.txt...");
  const filePath = path.join(__dirname, '..', 'database-skripsi.txt');
  
  if (!fs.existsSync(filePath)) {
    console.error("File database-skripsi.txt tidak ditemukan!");
    process.exit(1);
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');

  // Menyimpan struktur data dari TXT
  const parsedTheses = [];

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Regex parsing
    // Format: "Penulis (Tahun) Judul Indo = Judul Eng. Tipe thesis, Universitas."
    const match = line.match(/^(.*?)\s*\((\d{4})\)\s*(.*?)(?:\s*=\s*.*?)?\.\s*([A-Za-z]+)\s+thesis/);
    if (match) {
      parsedTheses.push({
        author: match[1].trim(),
        year: parseInt(match[2]),
        title: match[3].trim(),
        type: match[4].trim()
      });
    }
  }

  console.log(`Berhasil mengekstrak ${parsedTheses.length} data terstruktur dari TXT.`);

  // Ambil semua video dari database
  const videos = await prisma.youtubeVideo.findMany();
  console.log(`Terdapat ${videos.length} video di database TiDB untuk dicocokkan.`);

  let matchCount = 0;

  for (let video of videos) {
    const normVidTitle = normalizeString(video.title);
    
    // Cari skor kecocokan tertinggi
    let bestMatch = null;
    let highestScore = 0;

    for (let thesis of parsedTheses) {
      const normThesisTitle = normalizeString(thesis.title);
      const score = calculateMatchScore(normVidTitle, normThesisTitle);
      
      // Jika salah satu adalah substring dari yang lain atau skor kata > 60%
      if (normVidTitle.includes(normThesisTitle) || normThesisTitle.includes(normVidTitle) || score > 65) {
        if (score > highestScore) {
          highestScore = score;
          bestMatch = thesis;
        }
      }
    }

    // Jika ketemu match yang bagus
    if (bestMatch) {
      try {
        await prisma.youtubeVideo.update({
          where: { id: video.id },
          data: {
            author: bestMatch.author,
            academic_year: bestMatch.year,
            thesis_type: bestMatch.type
          }
        });
        matchCount++;
      } catch (err) {
        console.error(`Error update video ${video.id}: ${err.message}`);
      }
    }
  }

  console.log(`\nSelesai! Berhasil mencocokkan dan memperbarui ${matchCount} video dengan data tambahan.`);
}

main()
  .catch((e) => {
    console.error("Terjadi error saat enrichment:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
