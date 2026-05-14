# Infrastruktur Jakarta API

API untuk mengelola dan menyajikan data infrastruktur (khususnya fasilitas kesehatan), wilayah, dan metrik statistik di Jakarta. Dibangun dengan fokus pada kecepatan, keamanan, dan *clean architecture*.

## 🚀 Tech Stack

- **Framework**: [Hono](https://hono.dev/) (cepat, ringan, dan berjalan lancar di berbagai runtime Node.js/Edge).
- **Database / BaaS**: [Supabase](https://supabase.com/) & [Postgres](https://github.com/porsager/postgres)
- **Validation**: [Zod](https://zod.dev/) (untuk payload dan query validation)
- **Linter & Formatter**: [Biome](https://biomejs.dev/)
- **Language**: TypeScript

## 📂 Struktur & Arsitektur

Proyek ini menggunakan pemisahan tanggung jawab (*Separation of Concerns*) dengan pendekatan pola desain modular:

- `lib/core/` - Logika inti, *error classes* (AppError, NotFoundError), dan base classes (Singleton).
- `lib/shared/` - Modul umum seperti logger (Pino) dan pengelola response (Response Builder).
- `lib/middleware/` - Middleware global/kritis seperti Authentication (API Key), Admin Guard, Cache, CORS, Rate Limit, dan Request Logger.
- `lib/modules/` - Domain *business logic* API, dipisah berdasarkan fitur (`auth`, `facility`, `wilayah`, `stats`). Masing-masing memiliki *controller*, *service*, *routes*, *types*, dan *validation*.
- `src/` - Entry point aplikasi utama.

## 🛠️ Instalasi & Menjalankan Aplikasi

1. Clone repositori ini dan masuk ke foldernya.
2. Pastikan Anda menggunakan runtime Node.js (v18+).
3. Jalankan perintah instalasi dependensi (bisa menggunakan npm, yarn, atau pnpm):

```bash
npm install
```

4. Menjalankan server dalam mode development:

```bash
npm run dev
```

Cek terminal untuk melihat port yang digunakan (default: `http://localhost:3000`).

## 📜 Skrip NPM Tambahan

- `npm run build`: Melakukan compile TypeScript ke JavaScript.
- `npm run lint`: Memeriksa *linting* keseluruhan proyek menggunakan Biome.
- `npm run format`: Melakukan *formatting* kode secara otomatis.
- `npm run typecheck`: Memeriksa tipe data TypeScript tanpa melakukan kompilasi.

## 📄 Dokumentasi API

Untuk detail rute, header, dan parameter URL yang diterima, silakan merujuk ke [API-SPEC.md](./docs/API-SPEC.md).
