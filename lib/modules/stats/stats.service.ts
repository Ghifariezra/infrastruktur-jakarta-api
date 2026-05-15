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
	async getSummary(): Promise<SummaryRow> {
		return this.execute(
			async () => {
				const { data, error } = await this.supabase
					.schema("infrastruktur_jakarta")
					.from("v_summary")
					.select("*")
					.single();

				if (error) throw error;
				return data as SummaryRow;
			},
			"Failed to fetch summary stats",
			"DB_STATS_SUMMARY_ERROR",
		);
	}

	async getStatsPerWilayah(query: StatsWilayahQueryParams): Promise<StatsPerWilayahRow[]> {
		return this.execute(
			async () => {
				let q = this.supabase
					.schema("infrastruktur_jakarta")
					.from("v_stats_per_wilayah")
					.select("*")
					.order("total_fasilitas", { ascending: false });

				if (query.nama_wilayah) {
					q = q.ilike("nama_wilayah", `%${query.nama_wilayah}%`);
				}

				const { data, error } = await q;
				if (error) throw error;
				return data as StatsPerWilayahRow[];
			},
			"Failed to fetch stats per wilayah",
			"DB_STATS_WILAYAH_ERROR",
		);
	}

	async getStatsPerJenis(): Promise<StatsPerJenisRow[]> {
		return this.execute(
			async () => {
				const { data, error } = await this.supabase
					.schema("infrastruktur_jakarta")
					.from("v_stats_per_jenis")
					.select("*")
					.order("jumlah", { ascending: false });

				if (error) throw error;
				return data as StatsPerJenisRow[];
			},
			"Failed to fetch stats per jenis",
			"DB_STATS_JENIS_ERROR",
		);
	}

	async getStatsPerKecamatan(query: StatsKecamatanQueryParams): Promise<StatsPerKecamatanRow[]> {
		return this.execute(
			async () => {
				const { nama_wilayah, nama_kecamatan } = query;

				let q = this.supabase
					.schema("infrastruktur_jakarta")
					.from("v_stats_per_kecamatan")
					.select("*")
					.order("nama_wilayah", { ascending: true });

				if (nama_wilayah) q = q.ilike("nama_wilayah", `%${nama_wilayah}%`);
				if (nama_kecamatan) q = q.ilike("nama_kecamatan", `%${nama_kecamatan}%`);

				const { data, error } = await q;
				if (error) throw error;
				return data as StatsPerKecamatanRow[];
			},
			"Failed to fetch stats per kecamatan",
			"DB_STATS_KECAMATAN_ERROR",
		);
	}

	async getDensityScore(query: StatsDensityQueryParams): Promise<DensityScoreRow[]> {
		return this.execute(
			async () => {
				const { nama_wilayah, order } = query;

				let q = this.supabase
					.schema("infrastruktur_jakarta")
					.from("v_density_score")
					.select("*")
					.order("faskes_per_kelurahan", { ascending: order === "asc" });

				if (nama_wilayah) q = q.ilike("nama_wilayah", `%${nama_wilayah}%`);

				const { data, error } = await q;
				if (error) throw error;
				return data as DensityScoreRow[];
			},
			"Failed to fetch density score",
			"DB_STATS_DENSITY_ERROR",
		);
	}

	async getBlankSpot(query: StatsBlankSpotQueryParams): Promise<BlankSpotRow[]> {
		return this.execute(
			async () => {
				const { jenis, nama_wilayah, limit, offset } = query;

				let q = this.supabase
					.schema("infrastruktur_jakarta")
					.from("v_blank_spot")
					.select("*")
					.order("nama_wilayah", { ascending: true })
					.order("nama_kecamatan", { ascending: true })
					.order("nama_kelurahan", { ascending: true })
					.range(offset, offset + limit - 1);

				if (jenis) q = q.ilike("jenis_sarana_kesehatan", `%${jenis}%`);
				if (nama_wilayah) q = q.ilike("nama_wilayah", `%${nama_wilayah}%`);

				const { data, error } = await q;
				if (error) throw error;
				return data as BlankSpotRow[];
			},
			"Failed to fetch blank spot data",
			"DB_STATS_BLANKSPOT_ERROR",
		);
	}
}