# ValidQR — NusaPay Mobile Web (Next.js Fullstack)

> **Event:** HackNusa 2026 — Telkom University × Kaspersky · Top 30 Finalist  
> **Team:** NusaPay (Rahmatul Akbar Alim & Ryan Maulana)  
> **Tech Stack:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Lucide React, Framer Motion, Cloud PostgreSQL (Supabase / Neon) with Zero-Docker In-Memory Fallback.

---

## 📌 Ringkasan Eksekutif

**ValidQR** adalah SDK anti-fraud adaptif yang diintegrasikan ke dalam ekosistem pembayaran e-wallet **NusaPay**. Aplikasi ini melindungi pengguna dari pemalsuan stiker QRIS fisik dan penipuan *overlay attack* secara *real-time* sebelum saldo terpotong, melalui **3 lapisan keamanan sekuensial**:

1. **Layer 1 — NMID Cross-Validation:** Memvalidasi National Merchant ID terhadap database otoritas Bank Indonesia.
2. **Layer 2 — Hybrid Fuzzy Name Matching:** Menggabungkan Levenshtein (40%) + Token Overlap (60%) untuk mendeteksi penipuan perubahan nama/rebranding.
3. **Layer 3 — GPS Geofencing (15m):** Menghitung jarak Haversine antara lokasi fisik pemindai dan koordinat merchant terdaftar untuk mencegah *Overlay Attack*.

Web app ini dirancang **khusus untuk pengalaman mobile** (*mobile-first*), dengan tampilan presisi yang identik dengan aplikasi Flutter mobile aslinya, serta dilengkapi *frame mockup* interaktif pada layar desktop.

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Masuk ke Direktori Proyek
```bash
cd "c:\Users\Ryan Maulana\lomba\hacknusa-web"
```

### 2. Jalankan Server Dev
```bash
npm run dev
```
Buka browser di **`http://localhost:3000`**.

---

## 🗄️ Konfigurasi Database (Tanpa Docker!)

Aplikasi ini mendukung **Cloud PostgreSQL (Supabase / Neon)** tanpa perlu menjalankan Docker:

1. Buat database gratis di [Supabase](https://supabase.com/) atau [Neon.tech](https://neon.tech/).
2. Salin *Connection String* PostgreSQL Anda ke file `.env.local`:
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
GEOFENCE_RADIUS_METERS=15
FUZZY_WARNING_THRESHOLD=50
```
3. **Zero-Setup Fallback:** Jika `DATABASE_URL` dikosongkan, aplikasi **tetap berjalan 100% secara instan** menggunakan in-memory database mock yang sudah terisi data demo (Warung Bakso Pak Budi & Toko Aksesoris Penipu).

---

## 📱 Skenario Demo Pengujian HackNusa

Pada pemindai kamera web app, telah disediakan tombol **Preset Demo Cepat** untuk kemudahan pengujian juri:

| Skenario | Target Merchant | Lokasi Scan | Hasil Engine | Keterangan |
|---|---|---|---|---|
| **Stiker A** | Warung Bakso Pak Budi (`ID10293847561`) | Gedung Selaru Telkom Univ | 🟢 **VERIFIED** | Merchant resmi, nama cocok 100%, lokasi cocok. Lanjut bayar. |
| **Stiker B** | Toko Aksesoris Penipu (`ID99999999980`) | Gedung Selaru (Merchant di Jakarta) | 🔴 **BLOCKED** | Jarak ~122 km melebihi radius 15m (Overlay Attack). Saldo aman, WA alert terkirim! |
| **Stiker C** | Bakso Budi Dipatiukur (`ID10293847561`) | Gedung Selaru Telkom Univ | 🟡 **WARNING** | NMID sama, lokasi cocok, namun nama berbeda (Fuzzy score ~45%). Tampil dialog peringatan rebrand. |

---

## 🌐 Endpoint API

- `GET  /api/health` — Status kesehatan API & engine ValidQR
- `POST /api/v1/verify/scan` — 3-Layer Sequential Scan Verification Engine
- `GET  /api/v1/merchants` — Daftar seluruh merchant terdaftar
- `POST /api/v1/merchants` — Pendaftaran merchant baru
- `POST /api/v1/merchants/generate-sticker` — Pembuatan stiker QRIS fisik + QR Data URL
- `DELETE /api/v1/merchants/:id` — Hapus merchant
- `POST /api/v1/notify` — Pengiriman WhatsApp Fraud Alert
- `GET  /api/v1/incidents` — Riwayat log audit insiden anti-fraud
- `GET  /api/db-init` — Inisialisasi tabel schema otomatis

---

## 🖥️ Halaman Tersedia

1. **`http://localhost:3000`** — Aplikasi NusaPay Mobile Web (Home, Dompet, Scanner WebRTC & Galeri, Verifikasi Pop-up 3-Layer, Input Nominal, PIN Keypad, dan Struk Digital).
2. **`http://localhost:3000/merchant-portal`** — Portal Admin Merchant (Registrasi, Generator Stiker QRIS, Deteksi Konflik Rebrand).
3. **`http://localhost:3000/history`** — Halaman Audit Log & Riwayat Scan real-time.
