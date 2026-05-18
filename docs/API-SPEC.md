# Spesifikasi API: Infrastruktur Jakarta

Semua endpoint dilayani di bawah *Base URL*:  
**`http://localhost:3000/api/v1`**

## 🛡️ Keamanan & Middleware Global
- **Authentication**: Mayoritas endpoint data dilindungi dan membutuhkan API Key. Anda bisa mengirimkannya via:
  - Header: `x-api-key: <api_key>`
  - Header: `Authorization: Bearer <api_key>`
- **CORS**: Diaktifkan untuk semua origin `*`.
- **Security Headers**: Dilindungi oleh *Secure Headers* bawaan Hono.
- **Cache**: Caching publik diaktifkan untuk `/facility`, `/wilayah`, dan `/stats` guna meningkatkan kecepatan baca data.
- **Rate Limiter**: Mencegah *spam/abuse* (dikonfigurasi via ENV).
- **Request Logger**: Pencatatan rincian aktivitas HTTP ke *console* via Pino logger.
- **Role-Based Access**: Rute `/stats` dilindungi dan di-reserve khusus untuk kredensial berlevel `admin` (EzDev Internal).

---

## 1. Auth Routes (`/auth`)

Mengelola kunci API (API Keys).

### `POST /auth/keys`
Membuat kredensial API Key baru dan mengirimkannya via Email menggunakan layanan Resend.
- **Body (JSON):**
  - `developer_name` (String, max: 255) **[Required]** - Nama Anda atau pengembang.
  - `project_name` (String, max: 255) **[Required]** - Nama proyek yang menggunakan API ini.
  - `email` (String, format email) **[Required]** - Alamat email tujuan untuk mengirimkan API Key.
  - `use_case` (String, min: 20, max: 1000) **[Required]** - Penjelasan singkat mengenai tujuan penggunaan API (contoh: "Untuk integrasi pada dashboard website peta saya...").
  - `tier` (Enum: `free` | `pro` | `enterprise`, default: `free`) - Tingkat akses.
  - `lifespan_days` (Number, default: `30`) - Lama berlakunya token sebelum kedaluwarsa.
- **Example Response:**
```json
{
  "success": true,
  "message": "API Key successfully created.",
  "data": {
    "id": "abc-1234-xyz...",
    "api_key": "ezdev_1234abcd5678efgh..."
  }
}
```

### `POST /auth/keys/revoke`
Menonaktifkan kunci API secara instan.
- **Body (JSON):**
  - `key_id` (UUID) **[Required]** - ID dari database untuk API Key yang ingin dicabut.
- **Example Response:**
```json
{
  "success": true,
  "message": "API Key successfully revoked."
}
```

---

## 2. Facility Routes (`/facility`)

Mengelola fasilitas kesehatan dan titik lokasi.

### `GET /facility/`
Mendapatkan semua data infrastruktur/fasilitas kesehatan dengan *pagination*.
- **Query Params:**
  - `limit` (Number, optimal: 1-100, default: `50`) - Batas data yang dikembalikan.
  - `offset` (Number, default: `0`) - Data yang dilewati.
- **Example Response:**
```json
{
  "success": true,
  "message": "Success fetching facilities",
  "data": [
    {
      "id": "e0b1c2a3-2222-3333-...",
      "periode_data": 2024,
      "wilayah_id": "w111-...",
      "nama_wilayah": "Jakarta Pusat",
      "kecamatan_id": "k222-...",
      "nama_kecamatan": "Gambir",
      "kelurahan_id": "kel333-...",
      "nama_kelurahan": "Cideng",
      "jenis_sarana_id": "js444-...",
      "jenis_sarana_kesehatan": "Rumah Sakit Umum",
      "nama_infrastruktur": "RSUD Tarakan",
      "alamat": "Jl. Kyai Caringin No.7",
      "lat": -6.1706,
      "lon": 106.8093,
      "created_at": "2024-05-14T10:00:00.000Z",
      "updated_at": "2024-05-14T10:00:00.000Z"
    }
  ]
}
```

### `GET /facility/nearby`
Mencari fasilitas kesehatan terdekat dalam radius tertentu berdasarkan koordinat.
- **Query Params:**
  - `lat` (Number, min: -90, max: 90) **[Required]** - Garis lintang (Latitude).
  - `lon` (Number, min: -180, max: 180) **[Required]** - Garis bujur (Longitude).
  - `radius` (Number, max: 100, default: `5`) - Radius pencarian dalam kilometer.
- **Example Response:** *(Objek sama seperti `/facility` ditambah field jarak geometri jika tersedia, atau murni dari `HealthInfrastrukturView`)*
```json
{
  "success": true,
  "message": "Success finding nearby facilities",
  "data": [
    {
      "id": "e0b1c2a3-2222-3333-...",
      "periode_data": 2024,
      "nama_wilayah": "Jakarta Pusat",
      "nama_kecamatan": "Gambir",
      "nama_kelurahan": "Cideng",
      "jenis_sarana_kesehatan": "Puskesmas",
      "nama_infrastruktur": "Puskesmas Kecamatan Gambir",
      "alamat": "Jl. Tanah Abang I",
      "lat": -6.1685,
      "lon": 106.8152
      // ... field view lainnya
    }
  ]
}
```

---

## 3. Wilayah Routes (`/wilayah`)

Data master letak geografis (Wilayah, Kecamatan, Kelurahan).

### `GET /wilayah/`
Menampilkan data nama-nama wilayah (kabupaten/kota administratif).
- **Query Params:**
  - `search` (String, max: 100) - Filter berdasarkan nama wilayah.
- **Example Response:**
```json
{
  "success": true,
  "message": "Success fetching wilayah",
  "data": [
    { 
      "id": "1111-2222-...", 
      "nama_wilayah": "Jakarta Selatan" 
    }
  ]
}
```

### `GET /wilayah/:id`
Menampilkan rincian data suatu wilayah berdasarkan spesifik `id`.
- **Path Params:**
  - `id` (UUID format) **[Required]** - ID spesifik kota/kabupaten admin.
- **Example Response:**
```json
{
  "success": true,
  "message": "Success fetching wilayah details",
  "data": {
    "id": "1111-2222-...",
    "nama_wilayah": "Jakarta Selatan"
  }
}
```

### `GET /wilayah/:id/kecamatan`
Menampilkan daftar kecamatan dalam suatu wilayah.
- **Path Params:**
  - `id` (UUID format) **[Required]** - ID Wilayah induk.
- **Query Params:**
  - `search` (String) - Filter pencarian nama.
- **Example Response:**
```json
{
  "success": true,
  "message": "Success fetching kecamatan",
  "data": [
    { 
      "id": "aaaa-bbbb-...", 
      "wilayah_id": "1111-2222-...", 
      "nama_wilayah": "Jakarta Selatan",
      "nama_kecamatan": "Tebet" 
    }
  ]
}
```

### `GET /wilayah/:id/kelurahan`
Menampilkan daftar kelurahan berdasarkan ID kecamatan di suatu wilayah.
- **Path Params:**
  - `id` (UUID format) **[Required]** - ID Wilayah induk.
- **Query Params:**
  - `kecamatan_id` (UUID format) - Filter untuk memuat kelurahan khusus pada ID kecamatan tersebut.
  - `search` (String) - Pencarian nama kelurahan.
- **Example Response:**
```json
{
  "success": true,
  "message": "Success fetching kelurahan",
  "data": [
    { 
      "id": "eee-fff-...", 
      "kecamatan_id": "aaaa-bbbb-...", 
      "nama_kecamatan": "Tebet", 
      "nama_wilayah": "Jakarta Selatan", 
      "nama_kelurahan": "Menteng Dalam" 
    }
  ]
}
```

---

## 4. Stats Routes (`/stats`)

*⚠️ Memerlukan API Key dengan hak akses `admin` (EzDev Internal).*

Data statistik berdasarkan views gabungan (`v_summary`, `v_stats_per_wilayah`, `v_density_score`, dsb).

### `GET /stats/summary`
Mengembalikan rangkuman keseluruhan seluruh wilayah (merujuk ke view `v_summary`).
- **Example Response:**
```json
{
  "success": true,
  "message": "Success fetching stats summary",
  "data": {
    "total_fasilitas": 412,
    "total_wilayah": 6,
    "total_kecamatan": 44,
    "total_kelurahan": 267,
    "total_jenis_sarana": 12,
    "periode_awal": 2020,
    "periode_akhir": 2024
  }
}
```

### `GET /stats/wilayah`
Mengumpulkan statistik berdasarkan pengelompokan tingkat wilayah (`v_stats_per_wilayah`).
- **Query Params:**
  - `nama_wilayah` (String, max: 100) - Membatasi hasil pada wilayah tertentu.
- **Example Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "wilayah_id": "w111-222...",
      "nama_wilayah": "Jakarta Selatan",
      "total_fasilitas": 95,
      "persentase_distribusi": 23.05,
      "layanan_dasar": 70,
      "layanan_rujukan": 25,
      "rasio_dasar_per_rs": 2.8
    }
  ]
}
```

### `GET /stats/jenis`
Menyajikan statistik penyebaran tiap kategori layanan kesehatan (`v_stats_per_jenis`).
- **Example Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    { 
      "jenis_sarana_id": "js444-...", 
      "jenis_sarana_kesehatan": "Rumah Sakit Umum", 
      "jumlah": 60,
      "persentase": 14.56
    }
  ]
}
```

### `GET /stats/kecamatan`
Menampilkan tingkat keterisian fasilitas pada level kecamatan (`v_stats_per_kecamatan`).
- **Query Params:**
  - `nama_wilayah` (String) - Mengerucutkan daftar wilayah.
  - `nama_kecamatan` (String) - Spesifik pada nama kecamatan tersebut.
- **Example Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    { 
      "nama_wilayah": "Jakarta Selatan",
      "kecamatan_id": "k222-...", 
      "nama_kecamatan": "Tebet", 
      "total_fasilitas": 15,
      "kelurahan_terlayani": 7,
      "total_kelurahan": 7,
      "pct_kelurahan_terlayani": 100
    }
  ]
}
```

### `GET /stats/density`
Menghitung kepadatan/density fasilitas tiap area (`v_density_score`).
- **Query Params:**
  - `nama_wilayah` (String)
  - `order` (Enum: `asc` | `desc`, default: `desc`) - Urutan output.
- **Example Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    { 
      "nama_wilayah": "Jakarta Pusat", 
      "nama_kecamatan": "Gambir",
      "total_kelurahan": 6, 
      "total_fasilitas": 12,
      "faskes_per_kelurahan": 2.0
    }
  ]
}
```

### `GET /stats/blank-spot`
Analitik daerah dengan minim ases atau kelurahan yang sama sekali tidak ada sarana (`v_blank_spot`).
- **Query Params:**
  - `jenis` (String, max: 200) - Filter tipe kesehatan (Contoh: `Klinik Pratama`).
  - `nama_wilayah` (String) - Pembatasan pencarian blank spot pada kota.
- **Example Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    { 
      "nama_wilayah": "Jakarta Utara", 
      "nama_kecamatan": "Cilincing", 
      "kelurahan_id": "kel555-...",
      "nama_kelurahan": "Marunda",
      "jenis_sarana_id": "js999-...",
      "jenis_sarana_kesehatan": "Rumah Sakit Umum"
    }
  ]
}
```

---

## 🚫 Standard Error Response

Pada setiap validasi Zod yang gagal, rute yang tidak ditemukan (`404`), maupun kesalahan domain bisnis, API me-return format terpusat berbentuk JSON:

```json
{
  "success": false,
  "message": "Pesan deskripsi kesalahan utama yang ramah user",
  "code": "BAD_REQUEST",
  "details": {
    "lat": "Required",
    "lon": "Required"
  }
}
```

*Contoh jika gagal melewati pengecekan Auth Caching (401 Unauthorized):*
```json
{
  "success": false,
  "message": "API Key is missing. Please provide it via 'x-api-key' or 'Authorization: Bearer' header.",
  "code": "UNAUTHORIZED"
}
```

Format ini mematuhi standar integrasi dari `AppError` agar mudah diolah (*parsing*) oleh *frontend*.