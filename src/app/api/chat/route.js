import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { messages, contextData } = await req.json();
    const latestMessage = messages[messages.length - 1].content;

    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `Anda adalah asisten AI akademik yang membantu mahasiswa mencari ide dan topik skripsi. 
Anda memiliki akses ke database judul skripsi sebagai referensi. 
Gunakan pengetahuan Anda yang luas tentang berbagai bidang studi untuk memberikan ide, topik, atau saran yang relevan dengan pertanyaan pengguna.

Konteks data dari database skripsi (beberapa sampel judul terbaru):
${contextData}

Pertanyaan Pengguna:
${latestMessage}

Berikan jawaban yang membantu, informatif, dan menginspirasi untuk mahasiswa yang sedang mencari ide skripsi.`;

    const result = await model.generateContentStream(prompt);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            controller.enqueue(new TextEncoder().encode(chunkText));
          }
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      }
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return new Response('Failed to generate response', { status: 500 });
  }
}
