const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const titlesToDelete = [
  "Agen Pojok Statistik Unhas 2024 #shorts",
  "Agen Pojok Statistik Unhas 2023 #shorts",
  "Pojok Statistika Universitas Hasanuddin: Melihat Dunia dari Ruang Kecil",
  "Bachelor Program in Statistics Hasanuddin University",
  "Bachelor Program in Statistics Profile 2021",
  "PKM GFK 2021 UNHAS - TIME MACHINE: WISATA PERJALANAN KE MASA LAMPAU (SUBTITLE)",
  "PKM GFK 2021 UNHAS - TIME MACHINE: WISATA PERJALANAN KE MASA LAMPAU",
  "Persembahan Angkatan 2021 Pembinaan dan Pengembangan Karakter Mahasiswa Baru (P2KMB)",
  "Kewirausahaan Departemen Statistika: Nucifera’s Bonsai",
  "Kewirausahaan Departemen Statistika: MAJOOS “Manggo Juice Smoothies”",
  "Kewirausahaan Departemen Statistika: KelKrip (Kelapa Krispi) dengan Berbagai Varian Rasa",
  "Kewirausahaan Departemen Statistika: BOLANG “BOLA KENTANG”",
  "Kewirausahaan Departemen Statistika: HOCHIPS (Hydroponic Chips)",
  "Kewirausahaan Departemen Statistika: ES PISANG UNGU",
  "Kewirausahaan Departemen Statistika: Dalgona Milky",
  "Kewirausahaan Departemen Statistika: Scrunchie",
  "Kewirausahaan Departemen Statistika Unhas: Risoles Yummy",
  "PKM KC 2020 UNIVERSITAS HASANUDDIN (KEY-GPS : ALAT PELACAK KUNCI MOTOR ATAU MOBIL YANG HILANG)",
  "Selamat Hari Statistika Nasional 2020 Departemen Statistika FMIPA Unhas Angkatan 2020",
  "Persembahan Mahasiswa Statistika Angkatan 2018 Universitas Hasanuddin",
  "Persembahan Angkatan 2020 Pembinaan dan Pengembangan Karakter Mahasiswa Baru (P2KMB)",
  "Persembahan Angkatan 2019 Pembinaan dan Pengembangan Karakter Mahasiswa Baru (P2KMB)",
  "Pembelajaran Jarak Jauh Sensus Penduduk 2020",
  "Departemen Statistika Fakultas Matematika dan Ilmu Pengetahuan Alam Universitas Hasanuddin",
  "Persamaan Persepsi Pedoman PKM 5 Bidang Tahun 2020 Fakultas MIPA",
  "Cara Mencuci Tangan yang Baik dan Benar Menggunakan Sabun (KKN Tematik Unhas Gel. 104 Kec. Mariso)",
  "Statistika Untuk Masyarakat (STATMAT) \"Peduli Pandemi Covid 19\"",
  "Departemen Statistika Universitas Hasanuddin",
  "Yudisium Wisudawan Periode III Tahun 2020 Departemen Statistika Unhas",
  "Penandatanganan MoU UNHAS dengan BPS Provinsi Sulawesi Selatan",
  "Profil Departemen Statistika Universitas Hasanuddin",
  "Department of Statistics, Hasanuddin University"
];

async function main() {
  console.log('Menghapus 32 video yang tidak relevan...');

  let deletedCount = 0;
  for (let rawTitle of titlesToDelete) {
    const title = rawTitle.trim(); // Membersihkan spasi atau tab
    const res = await prisma.youtubeVideo.deleteMany({
      where: {
        title: {
          contains: title
        }
      }
    });
    
    if (res.count > 0) {
      console.log(`[Terhapus] ${title}`);
      deletedCount += res.count;
    } else {
      console.log(`[Tidak Ditemukan] ${title}`);
    }
  }

  console.log(`\nSelesai! Berhasil menghapus total ${deletedCount} video.`);
  
  const remaining = await prisma.youtubeVideo.count();
  console.log(`Total video tersisa di repositori: ${remaining}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
