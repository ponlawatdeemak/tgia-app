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

// 	// const position: GeolocationPosition = await new Promise<GeolocationPosition>((resolve, reject) => {
// 	navigator.geolocation.getCurrentPosition(resolve, reject)
// })

export function getPermissionCoods(): Promise<PermissionStatus> {
	return new Promise((resolve, reject) =>
		navigator.permissions
			? // Permission API is implemented
				navigator.permissions
					.query({
						name: 'geolocation',
					})
					.then(
						(permission) => {
							resolve(permission)
						},
						// is geolocation granted?
					)
			: // Permission API was not implemented
				reject(new Error('Permission API is not supported')),
	)
}

export function getCoords(): Promise<GeolocationPosition | null> {
	return new Promise((resolve, reject) =>
		navigator.permissions
			? // Permission API is implemented
				navigator.permissions
					.query({
						name: 'geolocation',
					})
					.then(
						(permission) => {
							console.log('permission ', permission)
							permission.state === 'granted'
								? navigator.geolocation.getCurrentPosition((pos) => resolve(pos))
								: () => {
										return resolve(null)
									}
						},
						// is geolocation granted?
					)
			: // Permission API was not implemented
				reject(new Error('Permission API is not supported')),
	)
}
