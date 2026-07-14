const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log("Membaca file youtube_data.json...");
  const filePath = path.join(__dirname, 'youtube_data.json');
  
  if (!fs.existsSync(filePath)) {
    console.error("File youtube_data.json tidak ditemukan. Jalankan scraper python terlebih dahulu.");
    process.exit(1);
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const videos = JSON.parse(fileContent);

  console.log(`Berhasil mengekstrak ${videos.length} data video YouTube.`);
  console.log("Memulai proses seeding ke database TiDB...");

  let successCount = 0;
  for (const video of videos) {
    if (!video.id) continue;
    
    try {
      await prisma.youtubeVideo.upsert({
        where: { id: video.id },
        update: {
          title: video.title,
          thumbnail: video.thumbnail,
          channel: video.channel,
          view_count: video.view_count || 0,
          like_count: video.like_count || 0,
          upload_date: video.upload_date ? String(video.upload_date) : null,
          duration_string: video.duration_string,
          webpage_url: video.webpage_url,
        },
        create: {
          id: video.id,
          title: video.title,
          thumbnail: video.thumbnail,
          channel: video.channel,
          view_count: video.view_count || 0,
          like_count: video.like_count || 0,
          upload_date: video.upload_date ? String(video.upload_date) : null,
          duration_string: video.duration_string,
          webpage_url: video.webpage_url,
        }
      });
      successCount++;
    } catch (err) {
      console.error(`Gagal menyimpan video ID ${video.id}: ${err.message}`);
    }
  }

  console.log(`Seeding selesai! Berhasil menyimpan/mengupdate ${successCount} video.`);
}

main()
  .catch((e) => {
    console.error("Terjadi error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
