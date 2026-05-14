import { BaseService } from "@core/base.service";
import type {
	BlankSpotRow,
	DensityScoreRow,
	StatsPerJenisRow,
	StatsPerKecamatanRow,
	StatsPerWilayahRow,
	SummaryRow,
} from "./stats.types";
import type {
	StatsBlankSpotQueryParams,
	StatsDensityQueryParams,
	StatsKecamatanQueryParams,
	StatsWilayahQueryParams,
} from "./stats.validation";

export class StatsService extends BaseService {
	// ── GET /stats/summary ────────────────────────────────────────
	async getSummary(): Promise<SummaryRow> {
		return this.execute(
			async () => {
				const rows = await this.sql<SummaryRow[]>`
                    SELECT * FROM infrastruktur_jakarta.v_summary
                    LIMIT 1
                `;
				return rows[0];
			},
			"Failed to fetch summary stats",
			"DB_STATS_SUMMARY_ERROR",
		);
	}

	// ── GET /stats/wilayah ────────────────────────────────────────
	async getStatsPerWilayah(
		query: StatsWilayahQueryParams,
	): Promise<StatsPerWilayahRow[]> {
		return this.execute(
			async () => {
				if (query.nama_wilayah) {
					return await this.sql<StatsPerWilayahRow[]>`
                        SELECT *
                        FROM infrastruktur_jakarta.v_stats_per_wilayah
                        WHERE nama_wilayah ILIKE ${`%${query.nama_wilayah}%`}
                        ORDER BY total_fasilitas DESC
                    `;
				}
				return await this.sql<StatsPerWilayahRow[]>`
                    SELECT *
                    FROM infrastruktur_jakarta.v_stats_per_wilayah
                    ORDER BY total_fasilitas DESC
                `;
			},
			"Failed to fetch stats per wilayah",
			"DB_STATS_WILAYAH_ERROR",
		);
	}

	// ── GET /stats/jenis ──────────────────────────────────────────
	async getStatsPerJenis(): Promise<StatsPerJenisRow[]> {
		return this.execute(
			async () => {
				return await this.sql<StatsPerJenisRow[]>`
                    SELECT *
                    FROM infrastruktur_jakarta.v_stats_per_jenis
                    ORDER BY jumlah DESC
                `;
			},
			"Failed to fetch stats per jenis",
			"DB_STATS_JENIS_ERROR",
		);
	}

	// ── GET /stats/kecamatan ──────────────────────────────────────
	async getStatsPerKecamatan(
		query: StatsKecamatanQueryParams,
	): Promise<StatsPerKecamatanRow[]> {
		return this.execute(
			async () => {
				const { nama_wilayah, nama_kecamatan } = query;

				if (nama_wilayah && nama_kecamatan) {
					return await this.sql<StatsPerKecamatanRow[]>`
                        SELECT *
                        FROM infrastruktur_jakarta.v_stats_per_kecamatan
                        WHERE nama_wilayah   ILIKE ${`%${nama_wilayah}%`}
                          AND nama_kecamatan ILIKE ${`%${nama_kecamatan}%`}
                        ORDER BY nama_wilayah ASC, total_fasilitas DESC
                    `;
				}

				if (nama_wilayah) {
					return await this.sql<StatsPerKecamatanRow[]>`
                        SELECT *
                        FROM infrastruktur_jakarta.v_stats_per_kecamatan
                        WHERE nama_wilayah ILIKE ${`%${nama_wilayah}%`}
                        ORDER BY total_fasilitas DESC
                    `;
				}

				if (nama_kecamatan) {
					return await this.sql<StatsPerKecamatanRow[]>`
                        SELECT *
                        FROM infrastruktur_jakarta.v_stats_per_kecamatan
                        WHERE nama_kecamatan ILIKE ${`%${nama_kecamatan}%`}
                        ORDER BY nama_wilayah ASC, total_fasilitas DESC
                    `;
				}

				return await this.sql<StatsPerKecamatanRow[]>`
                    SELECT *
                    FROM infrastruktur_jakarta.v_stats_per_kecamatan
                    ORDER BY nama_wilayah ASC, total_fasilitas DESC
                `;
			},
			"Failed to fetch stats per kecamatan",
			"DB_STATS_KECAMATAN_ERROR",
		);
	}

	// ── GET /stats/density ────────────────────────────────────────
	async getDensityScore(
		query: StatsDensityQueryParams,
	): Promise<DensityScoreRow[]> {
		return this.execute(
			async () => {
				const { nama_wilayah, order } = query;

				// postgres.js tidak support dynamic ORDER BY via interpolation
				// sehingga kita branch secara explicit
				if (nama_wilayah && order === "asc") {
					return await this.sql<DensityScoreRow[]>`
                        SELECT *
                        FROM infrastruktur_jakarta.v_density_score
                        WHERE nama_wilayah ILIKE ${`%${nama_wilayah}%`}
                        ORDER BY faskes_per_kelurahan ASC
                    `;
				}

				if (nama_wilayah) {
					return await this.sql<DensityScoreRow[]>`
                        SELECT *
                        FROM infrastruktur_jakarta.v_density_score
                        WHERE nama_wilayah ILIKE ${`%${nama_wilayah}%`}
                        ORDER BY faskes_per_kelurahan DESC
                    `;
				}

				if (order === "asc") {
					return await this.sql<DensityScoreRow[]>`
                        SELECT *
                        FROM infrastruktur_jakarta.v_density_score
                        ORDER BY faskes_per_kelurahan ASC
                    `;
				}

				return await this.sql<DensityScoreRow[]>`
                    SELECT *
                    FROM infrastruktur_jakarta.v_density_score
                    ORDER BY faskes_per_kelurahan DESC
                `;
			},
			"Failed to fetch density score",
			"DB_STATS_DENSITY_ERROR",
		);
	}

	// ── GET /stats/blank-spot ─────────────────────────────────────
	async getBlankSpot(
		query: StatsBlankSpotQueryParams,
	): Promise<BlankSpotRow[]> {
		return this.execute(
			async () => {
				const { jenis, nama_wilayah, limit, offset } = query;

				if (jenis && nama_wilayah) {
					return await this.sql<BlankSpotRow[]>`
                        SELECT *
                        FROM infrastruktur_jakarta.v_blank_spot
                        WHERE jenis_sarana_kesehatan ILIKE ${`%${jenis}%`}
                          AND nama_wilayah           ILIKE ${`%${nama_wilayah}%`}
                        ORDER BY nama_wilayah, nama_kecamatan, nama_kelurahan
                        LIMIT ${limit} OFFSET ${offset}
                    `;
				}

				if (jenis) {
					return await this.sql<BlankSpotRow[]>`
                        SELECT *
                        FROM infrastruktur_jakarta.v_blank_spot
                        WHERE jenis_sarana_kesehatan ILIKE ${`%${jenis}%`}
                        ORDER BY nama_wilayah, nama_kecamatan, nama_kelurahan
                        LIMIT ${limit} OFFSET ${offset}
                    `;
				}

				if (nama_wilayah) {
					return await this.sql<BlankSpotRow[]>`
                        SELECT *
                        FROM infrastruktur_jakarta.v_blank_spot
                        WHERE nama_wilayah ILIKE ${`%${nama_wilayah}%`}
                        ORDER BY nama_wilayah, nama_kecamatan, nama_kelurahan
                        LIMIT ${limit} OFFSET ${offset}
                    `;
				}

				return await this.sql<BlankSpotRow[]>`
                    SELECT *
                    FROM infrastruktur_jakarta.v_blank_spot
                    ORDER BY nama_wilayah, nama_kecamatan, nama_kelurahan
                    LIMIT ${limit} OFFSET ${offset}
                `;
			},
			"Failed to fetch blank spot data",
			"DB_STATS_BLANKSPOT_ERROR",
		);
	}
}
