import { BaseService } from "@core/base.service";
import { NotFoundError } from "@core/error";
import type {
	KecamatanResponse,
	KelurahanResponse,
	WilayahRow,
} from "./wilayah.types";

export class WilayahService extends BaseService {
	async getAll(search?: string): Promise<WilayahRow[]> {
		return this.execute(
			async () => {
				if (search) {
					return await this.sql<WilayahRow[]>`
                        SELECT id, nama_wilayah, created_at
                        FROM infrastruktur_jakarta.wilayah
                        WHERE nama_wilayah ILIKE ${`%${search}%`}
                        ORDER BY nama_wilayah ASC
                    `;
				}
				return await this.sql<WilayahRow[]>`
                    SELECT id, nama_wilayah, created_at
                    FROM infrastruktur_jakarta.wilayah
                    ORDER BY nama_wilayah ASC
                `;
			},
			"Failed to fetch wilayah",
			"DB_WILAYAH_ERROR",
		);
	}

	async getById(id: string): Promise<WilayahRow> {
		return this.execute(
			async () => {
				const rows = await this.sql<WilayahRow[]>`
                    SELECT id, nama_wilayah, created_at
                    FROM infrastruktur_jakarta.wilayah
                    WHERE id = ${id}
                    LIMIT 1
                `;
				if (rows.length === 0) {
					throw new NotFoundError(`Wilayah with id "${id}"`);
				}
				return rows[0];
			},
			"Failed to fetch wilayah by id",
			"DB_WILAYAH_ERROR",
		);
	}

	async getKecamatanByWilayah(
		wilayahId: string,
		search?: string,
	): Promise<KecamatanResponse[]> {
		return this.execute(
			async () => {
				const wilayah = await this.sql<{ id: string; nama_wilayah: string }[]>`
                    SELECT id, nama_wilayah
                    FROM infrastruktur_jakarta.wilayah
                    WHERE id = ${wilayahId}
                    LIMIT 1
                `;
				if (wilayah.length === 0) {
					throw new NotFoundError(`Wilayah with id "${wilayahId}"`);
				}

				if (search) {
					return await this.sql<KecamatanResponse[]>`
                        SELECT
                            kec.id,
                            kec.wilayah_id,
                            w.nama_wilayah,
                            kec.nama_kecamatan
                        FROM infrastruktur_jakarta.kecamatan kec
                        JOIN infrastruktur_jakarta.wilayah w ON kec.wilayah_id = w.id
                        WHERE kec.wilayah_id = ${wilayahId}
                          AND kec.nama_kecamatan ILIKE ${`%${search}%`}
                        ORDER BY kec.nama_kecamatan ASC
                    `;
				}

				return await this.sql<KecamatanResponse[]>`
                    SELECT
                        kec.id,
                        kec.wilayah_id,
                        w.nama_wilayah,
                        kec.nama_kecamatan
                    FROM infrastruktur_jakarta.kecamatan kec
                    JOIN infrastruktur_jakarta.wilayah w ON kec.wilayah_id = w.id
                    WHERE kec.wilayah_id = ${wilayahId}
                    ORDER BY kec.nama_kecamatan ASC
                `;
			},
			"Failed to fetch kecamatan",
			"DB_KECAMATAN_ERROR",
		);
	}

	async getKelurahanByWilayah(
		wilayahId: string,
		kecamatanId?: string,
		search?: string,
	): Promise<KelurahanResponse[]> {
		return this.execute(
			async () => {
				const wilayah = await this.sql<{ id: string }[]>`
                    SELECT id FROM infrastruktur_jakarta.wilayah
                    WHERE id = ${wilayahId}
                    LIMIT 1
                `;
				if (wilayah.length === 0) {
					throw new NotFoundError(`Wilayah with id "${wilayahId}"`);
				}

				if (kecamatanId && search) {
					return await this.sql<KelurahanResponse[]>`
                        SELECT
                            kel.id,
                            kel.kecamatan_id,
                            kec.nama_kecamatan,
                            w.nama_wilayah,
                            kel.nama_kelurahan
                        FROM infrastruktur_jakarta.kelurahan kel
                        JOIN infrastruktur_jakarta.kecamatan kec ON kel.kecamatan_id = kec.id
                        JOIN infrastruktur_jakarta.wilayah w     ON kec.wilayah_id = w.id
                        WHERE w.id = ${wilayahId}
                          AND kel.kecamatan_id = ${kecamatanId}
                          AND kel.nama_kelurahan ILIKE ${`%${search}%`}
                        ORDER BY kec.nama_kecamatan ASC, kel.nama_kelurahan ASC
                    `;
				}

				if (kecamatanId) {
					return await this.sql<KelurahanResponse[]>`
                        SELECT
                            kel.id,
                            kel.kecamatan_id,
                            kec.nama_kecamatan,
                            w.nama_wilayah,
                            kel.nama_kelurahan
                        FROM infrastruktur_jakarta.kelurahan kel
                        JOIN infrastruktur_jakarta.kecamatan kec ON kel.kecamatan_id = kec.id
                        JOIN infrastruktur_jakarta.wilayah w     ON kec.wilayah_id = w.id
                        WHERE w.id = ${wilayahId}
                          AND kel.kecamatan_id = ${kecamatanId}
                        ORDER BY kec.nama_kecamatan ASC, kel.nama_kelurahan ASC
                    `;
				}

				if (search) {
					return await this.sql<KelurahanResponse[]>`
                        SELECT
                            kel.id,
                            kel.kecamatan_id,
                            kec.nama_kecamatan,
                            w.nama_wilayah,
                            kel.nama_kelurahan
                        FROM infrastruktur_jakarta.kelurahan kel
                        JOIN infrastruktur_jakarta.kecamatan kec ON kel.kecamatan_id = kec.id
                        JOIN infrastruktur_jakarta.wilayah w     ON kec.wilayah_id = w.id
                        WHERE w.id = ${wilayahId}
                          AND kel.nama_kelurahan ILIKE ${`%${search}%`}
                        ORDER BY kec.nama_kecamatan ASC, kel.nama_kelurahan ASC
                    `;
				}

				return await this.sql<KelurahanResponse[]>`
                    SELECT
                        kel.id,
                        kel.kecamatan_id,
                        kec.nama_kecamatan,
                        w.nama_wilayah,
                        kel.nama_kelurahan
                    FROM infrastruktur_jakarta.kelurahan kel
                    JOIN infrastruktur_jakarta.kecamatan kec ON kel.kecamatan_id = kec.id
                    JOIN infrastruktur_jakarta.wilayah w     ON kec.wilayah_id = w.id
                    WHERE w.id = ${wilayahId}
                    ORDER BY kec.nama_kecamatan ASC, kel.nama_kelurahan ASC
                `;
			},
			"Failed to fetch kelurahan",
			"DB_KELURAHAN_ERROR",
		);
	}
}
