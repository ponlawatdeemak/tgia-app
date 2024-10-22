import { Polygon } from 'geojson'
import * as turf from '@turf/union'

export function toPolygon(geom: any): Polygon {
	let coordinates: any = null
	if (geom.type === 'MultiPolygon') {
		for (var i = 0; i < geom.coordinates.length; i++) {
			coordinates = i != 0 ? turf.union(coordinates, geom?.coordinates[i]) : geom.coordinates[i]
		}
	} else {
		coordinates = geom?.geometry?.coordinates
	}

	return {
		type: 'Polygon',
		coordinates: coordinates,
	} as Polygon
}
