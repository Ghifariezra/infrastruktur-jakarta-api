import { BaseService } from "@core/base.service";
import type { HealthInfrastrukturView } from "@modules/facility/health.types";

export class HealthFacilityService extends BaseService {
	async getFacilities(limit = 50, offset = 0): Promise<HealthInfrastrukturView[]> {
		return this.execute(
			async () => {
				const { data, error } = await this.supabase
					.schema("infrastruktur_jakarta")
					.from("v_infrastruktur")
					.select("*")
					.order("nama_infrastruktur", { ascending: true })
					.range(offset, offset + limit - 1);

				if (error) throw error;
				return data as HealthInfrastrukturView[];
			},
			"Failed to fetch data from database",
			"DB_FACILITY_FETCH_ERROR",
		);
	}

	// PostGIS query — wajib pakai RPC, tidak bisa lewat .from()
	// Buat function ini di Supabase SQL editor:
	//
	// CREATE OR REPLACE FUNCTION infrastruktur_jakarta.get_facilities_nearby(
	//   p_lat float, p_lon float, p_radius_m float
	// ) RETURNS SETOF infrastruktur_jakarta.v_infrastruktur AS $$
	//   SELECT v.* FROM infrastruktur_jakarta.v_infrastruktur v
	//   JOIN infrastruktur_jakarta.infrastruktur i ON v.id = i.id
	//   WHERE ST_DWithin(i.geom::geography,
	//     ST_SetSRID(ST_MakePoint(p_lon, p_lat), 4326)::geography, p_radius_m)
	// $$ LANGUAGE sql STABLE;
	async getFacilitiesNearby(lat: number, lon: number, radiusKm: number): Promise<HealthInfrastrukturView[]> {
		return this.execute(
			async () => {
				const { data, error } = await this.supabase.schema("infrastruktur_jakarta").rpc(
					"get_facilities_nearby",
					{ p_lat: lat, p_lon: lon, p_radius_m: radiusKm * 1000 },
				);

				if (error) throw error;
				return data as HealthInfrastrukturView[];
			},
			"Failed to perform spatial query",
			"DB_SPATIAL_ERROR",
		);
	}

	// PostGIS query — wajib pakai RPC
	//
	// CREATE OR REPLACE FUNCTION infrastruktur_jakarta.get_facilities_bbox(
	//   p_min_lat float, p_min_lon float, p_max_lat float, p_max_lon float
	// ) RETURNS SETOF infrastruktur_jakarta.v_infrastruktur AS $$
	//   SELECT v.* FROM infrastruktur_jakarta.v_infrastruktur v
	//   JOIN infrastruktur_jakarta.infrastruktur i ON v.id = i.id
	//   WHERE ST_Within(i.geom,
	//     ST_MakeEnvelope(p_min_lon, p_min_lat, p_max_lon, p_max_lat, 4326))
	// $$ LANGUAGE sql STABLE;
	async getFacilitiesInBBox(
		minLat: number, minLon: number,
		maxLat: number, maxLon: number,
	): Promise<HealthInfrastrukturView[]> {
		return this.execute(
			async () => {
				const { data, error } = await this.supabase.schema("infrastruktur_jakarta").rpc(
					"get_facilities_bbox",
					{ p_min_lat: minLat, p_min_lon: minLon, p_max_lat: maxLat, p_max_lon: maxLon },
				);

				if (error) throw error;
				return data as HealthInfrastrukturView[];
			},
			"Failed to fetch BBox",
			"DB_BBOX_ERROR",
		);
	}
}