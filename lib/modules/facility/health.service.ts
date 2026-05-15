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

	async getFacilitiesInBBox(
		minLat: number, minLon: number,
		maxLat: number, maxLon: number,
	): Promise<HealthInfrastrukturView[]> {
		return this.execute(
			async () => {
				const { data, error } = await this.supabase.schema("infrastruktur_jakarta").rpc(
					"get_facilities_bbox",
					{ 
						p_min_lat: minLat, 
						p_min_lon: minLon, 
						p_max_lat: maxLat, 
						p_max_lon: maxLon
					 },
				);

				if (error) throw error;
				return data as HealthInfrastrukturView[];
			},
			"Failed to fetch BBox",
			"DB_BBOX_ERROR",
		);
	}
}