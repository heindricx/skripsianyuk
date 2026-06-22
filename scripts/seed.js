const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({});

async function main() {
  console.log("Membaca file database-skripsi.txt...");
  const filePath = path.join(process.cwd(), 'database-skripsi.txt');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Pisahkan berdasarkan baris baru
  const lines = fileContent.split('\n');
  const theses = [];

  // Regex untuk mencocokkan pola: "Nama (Tahun) Judul. Jenis thesis, Universitas."
  // Contoh: Angelin, Indry (2021) PENGGUNAAN METODE... . Skripsi thesis, Universitas Hasanuddin.
  const regex = /^\s*(.*?)\s+\((\d{4})\)\s+(.*?)\.\s+(.*?)\s+thesis,\s+(.*?)\.\s*$/;

  for (const line of lines) {
    if (line.trim().length === 0) continue;

    const match = line.match(regex);
    if (match) {
      theses.push({
        author: match[1].trim(),
        year: parseInt(match[2]),
        title: match[3].trim(),
        type: match[4].trim(),
        university: match[5].trim()
      });
    } else {
      // Beberapa baris mungkin tidak memiliki kata "thesis" atau polanya sedikit berbeda
      // Kita coba fallback parsing sederhana
      const altRegex = /^\s*(.*?)\s+\((\d{4})\)\s+(.*?)\.\s*$/;
      const altMatch = line.match(altRegex);
      if (altMatch) {
         // Coba ekstrak type dan university dari title kalau menyatu
         const titleParts = altMatch[3].split('.');
         let title = altMatch[3];
         let type = "Skripsi";
         let university = "Universitas Hasanuddin";
         
         if (titleParts.length > 1) {
             const lastPart = titleParts[titleParts.length - 1].trim();
             if (lastPart.toLowerCase().includes('thesis') || lastPart.toLowerCase().includes('universitas')) {
                 title = titleParts.slice(0, -1).join('.').trim();
             }
         }
         
         theses.push({
            author: altMatch[1].trim(),
            year: parseInt(altMatch[2]),
            title: title.trim(),
            type: type,
            university: university
         });
      }
    }
  }

  console.log(`Berhasil mengekstrak ${theses.length} data skripsi.`);
  console.log("Memulai proses seeding ke database TiDB...");

  // Insert dalam bentuk batch
  const batchSize = 100;
  for (let i = 0; i < theses.length; i += batchSize) {
    const batch = theses.slice(i, i + batchSize);
    await prisma.thesis.createMany({
      data: batch,
      skipDuplicates: true,
    });
    console.log(`Telah memasukkan data ke-${i + batch.length} dari ${theses.length}...`);
  }

  console.log("Seeding selesai!");
}

main()
  .catch((e) => {
    console.error("Terjadi error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
