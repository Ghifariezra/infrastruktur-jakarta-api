// ============================================================
//  wilayah.types.ts
//  Based on DDL: infrastruktur_jakarta schema
// ============================================================

// ── Raw DB Rows ───────────────────────────────────────────────
// Shape 1:1 dari tabel — dipakai di service layer

export interface WilayahRow {
	id: string;
	nama_wilayah: string;
	created_at: string; // TIMESTAMPTZ → string saat di-serialize postgres.js
}

export interface KecamatanRow {
	id: string;
	wilayah_id: string; // UUID FK → infrastruktur_jakarta.wilayah.id
	nama_kecamatan: string;
	created_at: string;
}

export interface KelurahanRow {
	id: string;
	kecamatan_id: string; // UUID FK → infrastruktur_jakarta.kecamatan.id
	nama_kelurahan: string;
	created_at: string;
}

export interface JenisSaranaRow {
	id: string;
	nama_jenis: string;
	created_at: string;
}

export interface InfrastrukturRow {
	id: string;
	periode_data: number; // SMALLINT
	kelurahan_id: string; // UUID FK
	jenis_sarana_id: string; // UUID FK
	nama_infrastruktur: string;
	alamat: string;
	lat: number; // DOUBLE PRECISION
	lon: number; // DOUBLE PRECISION
	geom: string; // geometry(Point, 4326) — WKT/WKB string dari PostGIS
	created_at: string;
	updated_at: string;
}

// ── Response Shapes ───────────────────────────────────────────
// Shape yang dikirim ke client — include join columns

export interface WilayahResponse {
	id: string;
	nama_wilayah: string;
}

export interface KecamatanResponse {
	id: string;
	wilayah_id: string;
	nama_wilayah: string; // JOIN dari wilayah
	nama_kecamatan: string;
}

export interface KelurahanResponse {
	id: string;
	kecamatan_id: string;
	nama_kecamatan: string; // JOIN dari kecamatan
	nama_wilayah: string; // JOIN dari wilayah
	nama_kelurahan: string;
}

export interface JenisSaranaResponse {
	id: string;
	nama_jenis: string;
}

// ── View Shapes ───────────────────────────────────────────────
// Shape dari v_infrastruktur — hasil JOIN semua tabel

export interface InfrastrukturView {
	id: string;
	periode_data: number;

	// Hierarki wilayah
	wilayah_id: string;
	nama_wilayah: string;
	kecamatan_id: string;
	nama_kecamatan: string;
	kelurahan_id: string;
	nama_kelurahan: string;

	// Detail sarana
	jenis_sarana_id: string;
	jenis_sarana_kesehatan: string;
	nama_infrastruktur: string;
	alamat: string;
	lat: number;
	lon: number;

	created_at: string;
	updated_at: string;
}

// InfrastrukturView + distance_km untuk endpoint /nearby
export interface InfrastrukturNearbyView extends InfrastrukturView {
	distance_km: number;
}

// ── Query Params ──────────────────────────────────────────────
// Di-infer dari Zod schema, tidak ditulis manual di sini

export type {
	KecamatanQueryParams,
	KelurahanQueryParams,
	WilayahQueryParams,
} from "./wilayah.validation";
