// ============================================================
//  stats.types.ts
//  Based on views: v_summary, v_stats_per_wilayah,
//  v_stats_per_jenis, v_stats_per_kecamatan,
//  v_density_score, v_blank_spot
// ============================================================

// ── v_summary ─────────────────────────────────────────────────
export interface SummaryRow {
	total_fasilitas: number;
	total_wilayah: number;
	total_kecamatan: number;
	total_kelurahan: number;
	total_jenis_sarana: number;
	periode_awal: number;
	periode_akhir: number;
}

// ── v_stats_per_wilayah ───────────────────────────────────────
export interface StatsPerWilayahRow {
	wilayah_id: string;
	nama_wilayah: string;
	total_fasilitas: number;
	persentase_distribusi: number;
	layanan_dasar: number;
	layanan_rujukan: number;
	rasio_dasar_per_rs: number | null; // NULL jika tidak ada RS sama sekali
}

// ── v_stats_per_jenis ─────────────────────────────────────────
export interface StatsPerJenisRow {
	jenis_sarana_id: string;
	jenis_sarana_kesehatan: string;
	jumlah: number;
	persentase: number;
}

// ── v_stats_per_kecamatan ─────────────────────────────────────
export interface StatsPerKecamatanRow {
	nama_wilayah: string;
	kecamatan_id: string;
	nama_kecamatan: string;
	total_fasilitas: number;
	kelurahan_terlayani: number;
	total_kelurahan: number;
	pct_kelurahan_terlayani: number;
}

// ── v_density_score ───────────────────────────────────────────
export interface DensityScoreRow {
	nama_wilayah: string;
	nama_kecamatan: string;
	total_kelurahan: number;
	total_fasilitas: number;
	faskes_per_kelurahan: number;
}

// ── v_blank_spot ─────────────────────────────────────────────
export interface BlankSpotRow {
	nama_wilayah: string;
	nama_kecamatan: string;
	kelurahan_id: string;
	nama_kelurahan: string;
	jenis_sarana_id: string;
	jenis_sarana_kesehatan: string;
}
