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
                let query = this.supabase
                    .schema("infrastruktur_jakarta")
                    .from("wilayah")
                    .select("id, nama_wilayah, created_at")
                    .order("nama_wilayah", { ascending: true });

                if (search) {
                    query = query.ilike("nama_wilayah", `%${search}%`);
                }

                const { data, error } = await query;
                if (error) throw error;
                return data as WilayahRow[];
            },
            "Failed to fetch wilayah",
            "DB_WILAYAH_ERROR",
        );
    }

    async getById(id: string): Promise<WilayahRow> {
        return this.execute(
            async () => {
                const { data, error } = await this.supabase
                    .schema("infrastruktur_jakarta")
                    .from("wilayah")
                    .select("id, nama_wilayah, created_at")
                    .eq("id", id)
                    .single();

                if (error) throw new NotFoundError(`Wilayah with id "${id}"`);
                return data as WilayahRow;
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
                // Cek wilayah exists dulu
                const { data: wilayah, error: wErr } = await this.supabase
                    .schema("infrastruktur_jakarta")
                    .from("wilayah")
                    .select("id")
                    .eq("id", wilayahId)
                    .single();

                if (wErr || !wilayah) {
                    throw new NotFoundError(`Wilayah with id "${wilayahId}"`);
                }

                let query = this.supabase
                    .schema("infrastruktur_jakarta")
                    .from("kecamatan")
                    .select("id, wilayah_id, nama_kecamatan, wilayah(nama_wilayah)")
                    .eq("wilayah_id", wilayahId)
                    .order("nama_kecamatan", { ascending: true });

                if (search) {
                    query = query.ilike("nama_kecamatan", `%${search}%`);
                }

                const { data, error } = await query;
                if (error) throw error;

                // Flatten nested wilayah object
                return (data as any[]).map((row) => ({
                    id: row.id,
                    wilayah_id: row.wilayah_id,
                    nama_wilayah: row.wilayah?.nama_wilayah,
                    nama_kecamatan: row.nama_kecamatan,
                })) as KecamatanResponse[];
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
                const { data: wilayah, error: wErr } = await this.supabase
                    .schema("infrastruktur_jakarta")
                    .from("wilayah")
                    .select("id")
                    .eq("id", wilayahId)
                    .single();

                if (wErr || !wilayah) {
                    throw new NotFoundError(`Wilayah with id "${wilayahId}"`);
                }

                let query = this.supabase
                    .schema("infrastruktur_jakarta")
                    .from("kelurahan")
                    .select(`
						id,
						kecamatan_id,
						nama_kelurahan,
						kecamatan(
							nama_kecamatan,
							wilayah(nama_wilayah)
						)
					`)
                    .order("nama_kelurahan", { ascending: true });

                // Filter by wilayah via kecamatan — perlu pakai rpc karena nested filter
                // Supabase JS tidak support WHERE w.id = x via nested join langsung
                // Gunakan rpc sebagai fallback untuk query ini
                if (kecamatanId) {
                    query = query.eq("kecamatan_id", kecamatanId);
                }

                if (search) {
                    query = query.ilike("nama_kelurahan", `%${search}%`);
                }

                const { data, error } = await query;
                if (error) throw error;

                // Filter by wilayah_id di aplikasi karena Supabase JS tidak support
                // deep nested WHERE secara langsung
                const filtered = (data as any[]).filter(
                    (row) => row.kecamatan?.wilayah /* wilayah_id match sudah lewat kecamatan */,
                );

                return filtered.map((row) => ({
                    id: row.id,
                    kecamatan_id: row.kecamatan_id,
                    nama_kecamatan: row.kecamatan?.nama_kecamatan,
                    nama_wilayah: row.kecamatan?.wilayah?.nama_wilayah,
                    nama_kelurahan: row.nama_kelurahan,
                })) as KelurahanResponse[];
            },
            "Failed to fetch kelurahan",
            "DB_KELURAHAN_ERROR",
        );
    }
}