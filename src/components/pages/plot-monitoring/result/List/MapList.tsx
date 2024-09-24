'use client'

import MapView from '@/components/common/map/MapView'
import classNames from 'classnames'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import useSearchPlotMonitoring from '../Main/context'
import { GetAreaSearchPlotDtoIn } from '@/api/plot-monitoring/dto-in.dto'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'
import useLayerStore from '@/components/common/map/store/map'
import { MVTLayer } from '@deck.gl/geo-layers'
import { Feature, Geometry } from 'geojson'
import { apiAccessToken } from '@/api/core'
import { BoundaryTileColor, LineWidthColor, LossTypeTileColor } from '@/config/color'
import InfoWindows from '../Map/InfoWindows'
import { GetPositionSearchPlotDtoOut } from '@/api/plot-monitoring/dto-out.dto'
import { IconLayer } from '@deck.gl/layers'
import useAreaType from '@/store/area-type'
import useMapPin from '../Map/context'
import InfoPinTitle from '../Map/InfoPinTitle'
import { getPin } from '@/utils/pin'

type BoundaryLayerType = {
	layerName: string
	activity_id: number
}

type PoisIconType = {
	coordinates: [longitude: number, latitude: number]
	createdAt: string
	lat: number
	lng: number
	poiId: string
	title: string
	updatedAt: string
	userId: string
}

type ClickLayerInfo = {
	x: number
	y: number
	area: GetPositionSearchPlotDtoOut
}

type ClickPinInfo = {
	x: number
	y: number
	area: PoisIconType
}

const API_URL_TILE = process.env.API_URL_TILE

const SelectedLineWidth = 2
const DefaultLineWidth = 0

interface MapListProps {
	areaDetail: string
	mapViewRef: any
}

const MapList: React.FC<MapListProps> = ({ areaDetail, mapViewRef }) => {
	const { queryParams } = useSearchPlotMonitoring()
	const { open } = useMapPin()
	const { areaType } = useAreaType()
	const [clickLayerInfo, setClickLayerInfo] = useState<ClickLayerInfo | null>(null)
	const [clickPinInfo, setClickPinInfo] = useState<ClickPinInfo | null>(null)
	const { layers, addLayer, setLayers } = useLayerStore()

	const filterAreaSearchPlot = useMemo(() => {
		const filter: GetAreaSearchPlotDtoIn = {
			activityId: queryParams.activityId || undefined,
			year: queryParams.year,
			registrationAreaType: areaType,
			provinceCode: queryParams.provinceCode || undefined,
			districtCode: queryParams.districtCode || undefined,
			subDistrictCode: queryParams.subDistrictCode || undefined,
			lossType: typeof queryParams.lossType === 'number' ? Number(queryParams.lossType) : undefined,
			insuredType: typeof queryParams.insuredType === 'number' ? Number(queryParams.insuredType) : undefined,
			publicStatus: typeof queryParams.publicStatus === 'number' ? Number(queryParams.publicStatus) : undefined,
			riskType: queryParams.riskType || undefined,
			riceType: queryParams.riceType || undefined,
			detailType: queryParams.detailType || undefined,
		}
		return filter
	}, [queryParams, areaType])

	const { data: areaSearchPlot, isLoading: isAreaSearchPlotLoading } = useQuery({
		queryKey: ['getAreaSearchPlot', filterAreaSearchPlot],
		queryFn: async () => {
			const data = await service.plotMonitoring.getAreaSearchPlot(filterAreaSearchPlot)
			setClickLayerInfo(null)
			return data
		},
	})

	const { data: poisData, isLoading: isPOISDataLoading } = useQuery({
		queryKey: ['getPOISMapPin'],
		queryFn: () => service.plotMonitoring.getPOIS(),
	})

	const poisDataWithCoordinates = useMemo(() => {
		return poisData?.data?.map((data) => ({ ...data, coordinates: [data.lng, data.lat] }))
	}, [poisData])

	const areaSearchPlotIds = useMemo(() => {
		return areaSearchPlot?.data?.map((item) => item.activityId) || []
	}, [areaSearchPlot])

	// const areaSearchPlotIds = useMemo(() => {
	// 	return [204092124, 204148174, 204513425, 204457339, 204091737] || []
	// }, [areaSearchPlot])

	const poisDataIds = useMemo(() => {
		return poisData?.data?.map((item) => item.poiId) || []
	}, [poisData])

	const handleLayerPositionClick = useCallback(
		async (x: number, y: number, coordinate: number[], year: number) => {
			try {
				const response = await service.plotMonitoring.getPositionSearchPlot({
					lat: coordinate[1],
					lon: coordinate[0],
					year: queryParams.year,
				})
				if (!response.data) {
					throw new Error('Access Position failed!!')
				}
				setClickLayerInfo({ x, y, area: response.data })
			} catch (error) {
				console.log('error: ', error)
			}
		},
		[queryParams.year],
	)

	useEffect(() => {
		setLayers([
			new MVTLayer({
				id: !queryParams.provinceCode
					? 'country'
					: !queryParams.districtCode
						? 'province'
						: !queryParams.subDistrictCode
							? 'district'
							: 'subDistrict',
				name: !queryParams.provinceCode
					? 'country'
					: !queryParams.districtCode
						? 'province'
						: !queryParams.subDistrictCode
							? 'district'
							: 'subDistrict',
				loadOptions: {
					fetch: {
						headers: {
							'content-type': 'application/json',
							Authorization: `Bearer ${apiAccessToken}`,
						},
					},
				},
				data: !queryParams.provinceCode
					? `${API_URL_TILE}/province/tiles.json`
					: !queryParams.districtCode
						? `${API_URL_TILE}/province/tiles.json`
						: !queryParams.subDistrictCode
							? `${API_URL_TILE}/district/tiles.json`
							: `${API_URL_TILE}/subdistrict/tiles.json`,
				filled: true,
				lineWidthUnits: 'pixels',
				getFillColor(d: any) {
					return BoundaryTileColor.default
				},
				getLineColor(d: any) {
					return LineWidthColor.default
				},
				getLineWidth(d: any) {
					if (!queryParams.provinceCode) {
						return DefaultLineWidth
					} else {
						if (!queryParams.districtCode) {
							if (queryParams.provinceCode === d.properties.provinceCode) {
								return SelectedLineWidth
							}
							return DefaultLineWidth
						} else {
							if (!queryParams.subDistrictCode) {
								if (queryParams.districtCode === d.properties.districtCode) {
									return SelectedLineWidth
								}
								return DefaultLineWidth
							} else {
								if (queryParams.subDistrictCode === d.properties.subDistrictCode) {
									return SelectedLineWidth
								}
								return DefaultLineWidth
							}
						}
					}
				},
				pickable: true,
				updateTriggers: {
					getFillColor: queryParams.provinceCode || queryParams.districtCode || queryParams.subDistrictCode,
					getLineColor: queryParams.provinceCode || queryParams.districtCode || queryParams.subDistrictCode,
					getLineWidth: queryParams.provinceCode || queryParams.districtCode || queryParams.subDistrictCode,
				},
			}),
		])
		addLayer(
			new MVTLayer({
				id: `boundary_$${queryParams.year}`,
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
					if (areaSearchPlotIds.includes(d.properties.activity_id)) {
						return LossTypeTileColor.rnr
					}
					return LossTypeTileColor.default
				},
				getLineColor(d: Feature<Geometry, BoundaryLayerType>) {
					return LineWidthColor.default
				},
				getLineWidth(d: Feature<Geometry, BoundaryLayerType>) {
					if (areaSearchPlotIds.includes(d.properties.activity_id)) {
						return SelectedLineWidth
					}
					return DefaultLineWidth
				},
				pickable: true,
				updateTriggers: {
					getFillColor: queryParams.provinceCode || queryParams.districtCode || queryParams.subDistrictCode,
					getLineColor: queryParams.provinceCode || queryParams.districtCode || queryParams.subDistrictCode,
					getLineWidth: queryParams.provinceCode || queryParams.districtCode || queryParams.subDistrictCode,
				},
				onClick: (info, event) => {
					if (info.object) {
						if (areaSearchPlotIds.includes(info.object.properties.activity_id)) {
							if (info.coordinate) {
								handleLayerPositionClick(info.x, info.y, info.coordinate, queryParams.year)
							}
						} else {
							setClickLayerInfo(null)
						}
					} else {
						setClickLayerInfo(null)
					}
				},
			}),
		)
		addLayer(
			new IconLayer<PoisIconType>({
				id: 'IconLayer',
				data: open ? poisDataWithCoordinates : [],
				getColor: (d: PoisIconType) => {
					return [240, 62, 62, 255]
				},
				// getIcon: (d: PoisIconType) => {
				// 	return 'marker'
				// },
				getIcon: () => {
					return {
						url: getPin('#01AA86'),
						anchorY: 69,
						width: 58,
						height: 69,
						mask: false,
					}
				},
				getPosition: (d: PoisIconType) => {
					return d.coordinates
				},
				getSize: 40,

				// sizeScale: 1,
				// getPosition: (d) => d.coordinates,
				// getSize: 40,

				// iconAtlas: '/map/pin/location_on.png',
				// iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
				// iconMapping: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.json',
				pickable: true,
				onClick: (info, event) => {
					if (info.object) {
						if (poisDataIds.includes(info.object.poiId)) {
							setClickPinInfo({ x: info.x, y: info.y, area: info.object })
						} else {
							setClickPinInfo(null)
						}
					} else {
						setClickPinInfo(null)
					}
				},
			}),
		)
	}, [
		setLayers,
		addLayer,
		areaSearchPlotIds,
		poisDataIds,
		handleLayerPositionClick,
		queryParams.provinceCode,
		queryParams.districtCode,
		queryParams.subDistrictCode,
		queryParams.year,
		poisDataWithCoordinates,
		open,
	])

	return (
		<div
			className={classNames('relative h-full w-full', {
				hidden: areaDetail !== 'map',
			})}
		>
			<InfoWindows clickLayerInfo={clickLayerInfo} setClickLayerInfo={setClickLayerInfo} />
			<InfoPinTitle clickPinInfo={clickPinInfo} setClickPinInfo={setClickPinInfo} />
			<MapView
				className='max-lg:[&_div.MuiBox-root:first-child]:bottom-auto max-lg:[&_div.MuiBox-root:first-child]:left-4 max-lg:[&_div.MuiBox-root:first-child]:top-[68px] max-lg:[&_div.MuiBox-root:nth-child(2)]:bottom-auto max-lg:[&_div.MuiBox-root:nth-child(2)]:left-4 max-lg:[&_div.MuiBox-root:nth-child(2)]:top-4 max-lg:[&_div.MuiBox-root>div.MuiBox-root]:hidden'
				isShowMapPin
				ref={mapViewRef}
			/>
		</div>
	)
}

export default MapList
