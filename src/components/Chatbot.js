'use client';
import { useState, useRef, useEffect } from 'react';

export default function Chatbot({ thesesContext }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! Saya asisten AI. Ada yang bisa saya bantu terkait ide atau topik skripsi Anda?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Siapkan konteks dari tabel (maksimal 5 judul random untuk memberi konteks AI)
      const contextData = thesesContext
        .slice(0, 5)
        .map(t => `- ${t.title} (${t.year})`)
        .join('\n');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          contextData
        }),
      });

      if (!response.ok) {
        throw new Error('Network error');
      }

      setIsLoading(false); // Stop typing indicator because stream is starting
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let assistantMsg = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assistantMsg += chunk;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'assistant', content: assistantMsg };
          return newMessages;
        });
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Maaf, koneksi gagal atau terjadi kesalahan.' }]);
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card chat-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--card-border)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>🤖 Tanya AI (Gemini)</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Diskusikan ide skripsi Anda di sini</p>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            <div style={{ 
              padding: '0.75rem 1rem', 
              borderRadius: '12px', 
              background: msg.role === 'user' ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : 'rgba(255,255,255,0.1)',
              color: 'white',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', color: 'var(--text-secondary)' }}>
            <small>AI sedang mengetik...</small>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} style={{ padding: '1rem', borderTop: '1px solid var(--card-border)', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          className="input-field"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanya sesuatu tentang skripsi..."
          disabled={isLoading}
        />
        <button type="submit" className="btn-primary" disabled={isLoading}>
          Kirim
        </button>
      </form>
    </div>
  );
}
