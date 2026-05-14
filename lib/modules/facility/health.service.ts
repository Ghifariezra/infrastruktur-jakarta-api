import { BaseService } from "@core/base.service";
import type { HealthInfrastrukturView } from "@modules/facility/health.types";

export class HealthFacilityService extends BaseService {
	async getFacilities(
		limit = 50,
		offset = 0,
	): Promise<HealthInfrastrukturView[]> {
		return this.execute(
			async () => {
				return await this.sql<HealthInfrastrukturView[]>`
                    SELECT * FROM infrastruktur_jakarta.v_infrastruktur
                    ORDER BY nama_infrastruktur ASC
                    LIMIT ${limit} OFFSET ${offset}
                `;
			},
			"Failed to fetch data from database",
			"DB_FACILITY_FETCH_ERROR",
		);
	}

	async getFacilitiesNearby(
		lat: number,
		lon: number,
		radiusKm: number,
	): Promise<HealthInfrastrukturView[]> {
		return this.execute(
			async () => {
				return await this.sql<HealthInfrastrukturView[]>`
                    SELECT v.* FROM infrastruktur_jakarta.v_infrastruktur v
                    JOIN infrastruktur_jakarta.infrastruktur i ON v.id = i.id
                    WHERE ST_DWithin(
                        i.geom::geography, 
                        ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)::geography, 
                        ${radiusKm * 1000} -- konversi km ke meter
                    )
                `;
			},
			"Failed to perform spatial query",
			"DB_SPATIAL_ERROR",
		);
	}

	async getFacilitiesInBBox(
		minLat: number,
		minLon: number,
		maxLat: number,
		maxLon: number,
	): Promise<HealthInfrastrukturView[]> {
		return this.execute(
			async () => {
				return await this.sql`
                SELECT v.* FROM infrastruktur_jakarta.v_infrastruktur v
                JOIN infrastruktur_jakarta.infrastruktur i ON v.id = i.id
                WHERE ST_Within(
                    i.geom, 
                    ST_MakeEnvelope(${minLon}, ${minLat}, ${maxLon}, ${maxLat}, 4326)
                )
            `;
			},
			"Failed to fetch BBox",
			"DB_BBOX_ERROR",
		);
	}
}
