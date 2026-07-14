import yt_dlp
import pandas as pd
import json
import os

def scrape_channel(channel_url):
    print(f"Memulai proses scraping dari channel: {channel_url}")
    print("Mohon tunggu, ini mungkin membutuhkan waktu beberapa saat...\n")
    
    # Konfigurasi yt-dlp untuk hanya mengambil metadata (tanpa mengunduh video)
    ydl_opts = {
        'extract_flat': 'in_playlist', # Hanya ekstrak list video
        'quiet': True,
        'ignoreerrors': True,
        'no_warnings': True
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(channel_url, download=False)
            
        if 'entries' not in info:
            print("❌ Tidak ada video yang ditemukan atau URL tidak valid.")
            return
        
        entries = info['entries']
        
        data = []
        for entry in entries:
            # Lewati jika entry kosong atau error
            if not entry:
                continue
                
            # Ambil thumbnail resolusi tertinggi (biasanya elemen terakhir di array)
            thumbnail_url = None
            if entry.get('thumbnails'):
                thumbnail_url = entry['thumbnails'][-1].get('url')
                
            # Membuat format duration_string jika yang tersedia hanya hitungan detik (duration)
            duration_str = entry.get('duration_string')
            if not duration_str and entry.get('duration'):
                mins, secs = divmod(entry.get('duration'), 60)
                duration_str = f"{int(mins)}:{int(secs):02d}"

            # Menyimpan hanya 9 kolom yang kita butuhkan
            video_data = {
                'id': entry.get('id'),
                'title': entry.get('title'),
                'thumbnail': thumbnail_url,
                'channel': entry.get('channel') or entry.get('uploader') or "Departemen Statistika Unhas",
                'view_count': entry.get('view_count') or 0,
                'like_count': entry.get('like_count') or 0,
                'upload_date': entry.get('upload_date') or entry.get('release_timestamp'),
                'duration_string': duration_str or "0:00",
                'webpage_url': entry.get('url') or f"https://www.youtube.com/watch?v={entry.get('id')}"
            }
            data.append(video_data)
            
        # Ubah ke bentuk Pandas DataFrame
        df = pd.DataFrame(data)
        
        # Simpan output sebagai file JSON agar nantinya sangat mudah dimasukkan ke database TiDB
        output_dir = os.path.dirname(os.path.abspath(__file__))
        output_file = os.path.join(output_dir, 'youtube_data.json')
        
        # Simpan ke file
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
            
        print(f"✅ Scraping Selesai!")
        print(f"Total video yang berhasil diekstrak: {len(df)} video.")
        print(f"Data telah difilter ke 9 kolom dan disimpan di: {output_file}")
        
    except Exception as e:
        print(f"❌ Terjadi kesalahan saat scraping: {str(e)}")

if __name__ == "__main__":
    # URL channel YouTube yang diminta
    target_url = "https://www.youtube.com/@departemenstatistikaunhas6327/videos"
    scrape_channel(target_url)
