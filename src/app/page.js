import { PrismaClient } from '@prisma/client';
import ThesisTable from '@/components/ThesisTable';
import Chatbot from '@/components/Chatbot';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Fungsi untuk mengambil data dari TiDB
async function getTheses() {
  const theses = await prisma.thesis.findMany({
    orderBy: { year: 'desc' }
  });
  return theses;
}

export default async function Home() {
  const theses = await getTheses();

  return (
    <main className="container">
      <div className="header animate-fade-in">
        <h1>SkripsianYuk</h1>
        <p>Temukan Ide Skripsi Anda dan Diskusikan dengan AI</p>
      </div>
      
      <div className="main-grid">
        {/* Kolom Kiri: Tabel Data */}
        <ThesisTable initialData={theses} />
        
        {/* Kolom Kanan: Chatbot AI */}
        <Chatbot thesesContext={theses} />
      </div>
    </main>
  );
}
