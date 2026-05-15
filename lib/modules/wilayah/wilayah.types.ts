export interface WilayahRow {
	id: string;
	nama_wilayah: string;
	created_at: string;
}

export interface KecamatanRow {
	id: string;
	wilayah_id: string;
	nama_kecamatan: string;
	created_at: string;
}

export interface KelurahanRow {
	id: string;
	kecamatan_id: string;
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
	periode_data: number;
	kelurahan_id: string;
	jenis_sarana_id: string;
	nama_infrastruktur: string;
	alamat: string;
	lat: number;
	lon: number;
	geom: string;
	created_at: string;
	updated_at: string;
}

export interface WilayahResponse {
	id: string;
	nama_wilayah: string;
}

export interface KecamatanResponse {
	id: string;
	wilayah_id: string;
	nama_wilayah: string;
	nama_kecamatan: string;
}

export interface KelurahanResponse {
	id: string;
	kecamatan_id: string;
	nama_kecamatan: string;
	nama_wilayah: string;
	nama_kelurahan: string;
}

export interface JenisSaranaResponse {
	id: string;
	nama_jenis: string;
}

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

export interface InfrastrukturNearbyView extends InfrastrukturView {
	distance_km: number;
}

export type {
	KecamatanQueryParams,
	KelurahanQueryParams,
	WilayahQueryParams,
} from "./wilayah.validation";
