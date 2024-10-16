import MapView from '@/components/common/map/MapView'
import { Paper } from '@mui/material'
import React, { useEffect } from 'react'
import useLayerStore from '@/components/common/map/store/map'
import { MVTLayer } from '@deck.gl/geo-layers'
import { apiAccessToken } from '@/api/core'
import useSearchPlotMonitoring from '../../Main/context'
import { Feature, Geometry } from 'geojson'
import { BoundaryTileColor, LineWidthColor, LossTypeTileColor } from '@/config/color'

type BoundaryLayerType = {
	layerName: string
	activity_id: number
}

type DetailLayerType = BoundaryLayerType & {
	project_year: number
}

const API_URL_TILE = process.env.API_URL_TILE

const SelectedLineWidth = 2
const DefaultLineWidth = 0

interface MapDetailProps {
	activityId: number
	plotDetail: string
	lossType: string | undefined
}

const MapDetail: React.FC<MapDetailProps> = ({ activityId, plotDetail, lossType }) => {
	const { queryParams } = useSearchPlotMonitoring()
	const { layers, addLayer, setLayers } = useLayerStore()

	useEffect(() => {
		if (plotDetail === 'plantDetail') {
			setLayers([
				new MVTLayer({
					id: `boundary_$${queryParams.year}` + `-${new Date().getTime()}`,
					name: `boundary_$${queryParams.year}`,
					loadOptions: {
						fetch: {
							headers: {
								'content-type': 'application/json',
								Authorization: `Bearer ${apiAccessToken}`,
							},
						},
					},
					data: `${API_URL_TILE}/boundary_${queryParams.year}/tiles.json`,
					filled: true,
					getFillColor(d: Feature<Geometry, BoundaryLayerType>) {
						if (Number(d.properties.activity_id) === Number(activityId)) {
							return BoundaryTileColor.gray
						}
						return BoundaryTileColor.default
					},
					getLineColor(d: Feature<Geometry, BoundaryLayerType>) {
						return LineWidthColor.default
					},
					getLineWidth(d: Feature<Geometry, BoundaryLayerType>) {
						if (Number(d.properties.activity_id) === Number(activityId)) {
							return SelectedLineWidth
						}
						return DefaultLineWidth
					},
					pickable: true,
					updateTriggers: {
						getFillColor: plotDetail,
						getLineColor: plotDetail,
						getLineWidth: plotDetail,
					},
				}),
				new MVTLayer({
					id: `rnr_$${queryParams.year}` + `-${new Date().getTime()}`,
					name: `rnr_$${queryParams.year}`,
					loadOptions: {
						fetch: {
							headers: {
								'content-type': 'application/json',
								Authorization: `Bearer ${apiAccessToken}`,
							},
						},
					},
					data: `${API_URL_TILE}/rnr_${queryParams.year}/tiles.json`,
					filled: true,
					getFillColor(d: Feature<Geometry, DetailLayerType>) {
						if (Number(d.properties.activity_id) === Number(activityId)) {
							return LossTypeTileColor.rnr
						}
						return BoundaryTileColor.default
					},
					getLineColor(d: Feature<Geometry, DetailLayerType>) {
						return LineWidthColor.default
					},
					getLineWidth(d: Feature<Geometry, DetailLayerType>) {
						if (Number(d.properties.activity_id) === Number(activityId)) {
							return SelectedLineWidth
						}
						return DefaultLineWidth
					},
					pickable: true,
					updateTriggers: {
						getFillColor: plotDetail,
						getLineColor: plotDetail,
						getLineWidth: plotDetail,
					},
				}),
			])
		} else if (plotDetail === 'lossDetail') {
			setLayers([
				new MVTLayer({
					id: `boundary_$${queryParams.year}` + `-${new Date().getTime()}`,
					name: `boundary_$${queryParams.year}`,
					loadOptions: {
						fetch: {
							headers: {
								'content-type': 'application/json',
								Authorization: `Bearer ${apiAccessToken}`,
							},
						},
					},
					data: `${API_URL_TILE}/boundary_${queryParams.year}/tiles.json`,
					filled: true,
					getFillColor(d: Feature<Geometry, BoundaryLayerType>) {
						if (Number(d.properties.activity_id) === Number(activityId)) {
							return BoundaryTileColor.gray
						}
						return BoundaryTileColor.default
					},
					getLineColor(d: Feature<Geometry, BoundaryLayerType>) {
						return LineWidthColor.default
					},
					getLineWidth(d: Feature<Geometry, BoundaryLayerType>) {
						if (Number(d.properties.activity_id) === Number(activityId)) {
							return SelectedLineWidth
						}
						return DefaultLineWidth
					},
					pickable: true,
					updateTriggers: {
						getFillColor: plotDetail,
						getLineColor: plotDetail,
						getLineWidth: plotDetail,
					},
				}),
			])
			if (lossType && !['noData', 'noDamage'].includes(lossType || '')) {
				addLayer(
					new MVTLayer({
						id: `${lossType}_$${queryParams.year}` + `-${new Date().getTime()}`,
						name: `${lossType}_$${queryParams.year}`,
						loadOptions: {
							fetch: {
								headers: {
									'content-type': 'application/json',
									Authorization: `Bearer ${apiAccessToken}`,
								},
							},
						},
						data: `${API_URL_TILE}/${lossType}_${queryParams.year}/tiles.json`,
						filled: true,
						getFillColor(d: Feature<Geometry, DetailLayerType>) {
							if (Number(d.properties.activity_id) === Number(activityId)) {
								return LossTypeTileColor[`${lossType}`]
							}
							return BoundaryTileColor.default
						},
						getLineColor(d: Feature<Geometry, DetailLayerType>) {
							return LineWidthColor.default
						},
						getLineWidth(d: Feature<Geometry, DetailLayerType>) {
							if (Number(d.properties.activity_id) === Number(activityId)) {
								return SelectedLineWidth
							}
							return DefaultLineWidth
						},
						pickable: true,
						updateTriggers: {
							getFillColor: plotDetail,
							getLineColor: plotDetail,
							getLineWidth: plotDetail,
						},
					}),
				)
			}
		}
	}, [setLayers, activityId, plotDetail, lossType, queryParams.year])

	return (
		<Paper className='relative max-lg:bg-white max-lg:px-4 lg:block lg:flex-grow'>
			<div className='relative w-full max-lg:aspect-square max-lg:overflow-hidden max-lg:rounded lg:h-full'>
				<MapView />
			</div>
		</Paper>
	)
}

export default MapDetail
