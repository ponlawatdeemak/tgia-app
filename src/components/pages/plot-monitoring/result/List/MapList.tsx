'use client'

import MapView from '@/components/common/map/MapView'
import classNames from 'classnames'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import useSearchPlotMonitoring from '../Main/context'
import useResponsive from '@/hook/responsive'
import useAreaType from '@/store/area-type'
import useAreaUnit from '@/store/area-unit'
import { useTranslation } from 'react-i18next'
import { ResponseLanguage } from '@/api/interface'
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

type ProvincePropertiesType = {
	layerName: string
	provinceCode: number
	provinceNameEn: string
	provinceNameTh: string
}

type DistrictPropertiesType = {
	layerName: string
	districtCode: number
	districtNameEn: string
	districtNameTh: string
	provinceCode: number
	provinceNameEn: string
	provinceNameTh: string
}

type SubDistrictPropertiesType = {
	layerName: string
	subDistrictCode: number
	subDistrictNameEn: string
	subDistrictNameTh: string
	districtCode: number
	districtNameEn: string
	districtNameTh: string
	provinceCode: number
	provinceNameEn: string
	provinceNameTh: string
}

type BoundaryLayerType = {
	layerName: string
	activity_id: number
}

type ClickInfo = {
	x: number
	y: number
	area: GetPositionSearchPlotDtoOut
}

const SelectedLineWidth = 2
const DefaultLineWidth = 0

interface MapListProps {
	areaDetail: string
}

const MapList: React.FC<MapListProps> = ({ areaDetail }) => {
	const { queryParams } = useSearchPlotMonitoring()
	const { isDesktop } = useResponsive()
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const [clickInfo, setClickInfo] = useState<ClickInfo | null>(null)
	const { t, i18n } = useTranslation(['default', 'field-loss'])
	const language = i18n.language as keyof ResponseLanguage
	const { layers, addLayer, setLayers } = useLayerStore()

	const filterAreaSearchPlot = useMemo(() => {
		const filter: GetAreaSearchPlotDtoIn = {
			activityId: queryParams.activityId || undefined,
			year: queryParams.year,
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
	}, [queryParams])

	const { data: areaSearchPlot, isLoading: isAreaSearchPlotLoading } = useQuery({
		queryKey: ['getAreaSearchPlot', filterAreaSearchPlot],
		queryFn: async () => {
			const data = await service.plotMonitoring.getAreaSearchPlot(filterAreaSearchPlot)
			setClickInfo(null)
			return data
		},
	})

	const areaSearchPlotId = useMemo(() => {
		return areaSearchPlot?.data?.map((item) => item.activityId) || []
	}, [areaSearchPlot])

	// const areaSearchPlotId = useMemo(() => {
	// 	return [204092124, 204148174, 204513425, 204457339, 204091737] || []
	// }, [areaSearchPlot])

	const handlePositionClick = useCallback(
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
				setClickInfo({ x, y, area: response.data })
			} catch (error) {
				console.log('error: ', error)
			}
		},
		[queryParams.year],
	)

	useEffect(() => {
		if (!queryParams.provinceCode) {
			setLayers([
				new MVTLayer({
					id: 'country',
					name: 'country',
					loadOptions: {
						fetch: {
							headers: {
								'content-type': 'application/json',
								Authorization: `Bearer ${apiAccessToken}`,
							},
						},
					},
					data: 'https://tileserver.cropinsurance-dev.thaicom.io/province/tiles.json',
					filled: true,
					lineWidthUnits: 'pixels',
					getFillColor(d: Feature<Geometry, ProvincePropertiesType>) {
						return BoundaryTileColor.default
					},
					getLineColor(d: Feature<Geometry, ProvincePropertiesType>) {
						return LineWidthColor.default
					},
					getLineWidth(d: Feature<Geometry, ProvincePropertiesType>) {
						return DefaultLineWidth
					},
					pickable: true,
				}),
			])
		} else if (queryParams.provinceCode && !queryParams.districtCode) {
			setLayers([
				new MVTLayer({
					id: 'province',
					name: 'province',
					loadOptions: {
						fetch: {
							headers: {
								'content-type': 'application/json',
								Authorization: `Bearer ${apiAccessToken}`,
							},
						},
					},
					data: 'https://tileserver.cropinsurance-dev.thaicom.io/province/tiles.json',
					filled: true,
					lineWidthUnits: 'pixels',
					getFillColor(d: Feature<Geometry, ProvincePropertiesType>) {
						return BoundaryTileColor.default
					},
					getLineColor(d: Feature<Geometry, ProvincePropertiesType>) {
						return LineWidthColor.default
					},
					getLineWidth(d: Feature<Geometry, ProvincePropertiesType>) {
						if (queryParams.provinceCode === d.properties.provinceCode) {
							return SelectedLineWidth
						}
						return DefaultLineWidth
					},
					pickable: true,
					updateTriggers: {
						getFillColor: queryParams.provinceCode,
						getLineColor: queryParams.provinceCode,
						getLineWidth: queryParams.provinceCode,
					},
				}),
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
					data: `https://tileserver.cropinsurance-dev.thaicom.io/boundary_${queryParams.year}/tiles.json`,
					filled: true,
					getFillColor(d: Feature<Geometry, BoundaryLayerType>) {
						if (areaSearchPlotId.includes(d.properties.activity_id)) {
							return LossTypeTileColor.rnr
						}
						return LossTypeTileColor.default
					},
					getLineColor(d: Feature<Geometry, BoundaryLayerType>) {
						return LineWidthColor.default
					},
					getLineWidth(d: Feature<Geometry, BoundaryLayerType>) {
						if (areaSearchPlotId.includes(d.properties.activity_id)) {
							return SelectedLineWidth
						}
						return DefaultLineWidth
					},
					pickable: true,
					updateTriggers: {
						getFillColor: queryParams.provinceCode,
						getLineColor: queryParams.provinceCode,
						getLineWidth: queryParams.provinceCode,
					},
					onClick: (info, event) => {
						if (info.object) {
							if (areaSearchPlotId.includes(info.object.properties.activity_id)) {
								if (info.coordinate) {
									handlePositionClick(info.x, info.y, info.coordinate, queryParams.year)
								}
							} else {
								setClickInfo(null)
							}
						} else {
							setClickInfo(null)
						}
					},
				}),
			])
		} else if (queryParams.provinceCode && queryParams.districtCode && !queryParams.subDistrictCode) {
			setLayers([
				new MVTLayer({
					id: 'district',
					name: 'district',
					loadOptions: {
						fetch: {
							headers: {
								'content-type': 'application/json',
								Authorization: `Bearer ${apiAccessToken}`,
							},
						},
					},
					data: 'https://tileserver.cropinsurance-dev.thaicom.io/district/tiles.json',
					filled: true,
					lineWidthUnits: 'pixels',
					getFillColor(d: Feature<Geometry, DistrictPropertiesType>) {
						return BoundaryTileColor.default
					},
					getLineColor(d: Feature<Geometry, DistrictPropertiesType>) {
						return LineWidthColor.default
					},
					getLineWidth(d: Feature<Geometry, DistrictPropertiesType>) {
						if (queryParams.districtCode === d.properties.districtCode) {
							return SelectedLineWidth
						}
						return DefaultLineWidth
					},
					pickable: true,
					updateTriggers: {
						getFillColor: queryParams.districtCode,
						getLineColor: queryParams.districtCode,
						getLineWidth: queryParams.districtCode,
					},
				}),
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
					data: `https://tileserver.cropinsurance-dev.thaicom.io/boundary_${queryParams.year}/tiles.json`,
					filled: true,
					getFillColor(d: Feature<Geometry, BoundaryLayerType>) {
						if (areaSearchPlotId.includes(d.properties.activity_id)) {
							return LossTypeTileColor.rnr
						}
						return LossTypeTileColor.default
					},
					getLineColor(d: Feature<Geometry, BoundaryLayerType>) {
						return LineWidthColor.default
					},
					getLineWidth(d: Feature<Geometry, BoundaryLayerType>) {
						if (areaSearchPlotId.includes(d.properties.activity_id)) {
							return SelectedLineWidth
						}
						return DefaultLineWidth
					},
					pickable: true,
					updateTriggers: {
						getFillColor: queryParams.districtCode,
						getLineColor: queryParams.districtCode,
						getLineWidth: queryParams.districtCode,
					},
					onClick: (info, event) => {
						if (info.object) {
							if (areaSearchPlotId.includes(info.object.properties.activity_id)) {
								if (info.coordinate) {
									handlePositionClick(info.x, info.y, info.coordinate, queryParams.year)
								}
							} else {
								setClickInfo(null)
							}
						} else {
							setClickInfo(null)
						}
					},
				}),
			])
		} else if (queryParams.provinceCode && queryParams.districtCode && queryParams.subDistrictCode) {
			setLayers([
				new MVTLayer({
					id: 'subDistrict',
					name: 'subDistrict',
					loadOptions: {
						fetch: {
							headers: {
								'content-type': 'application/json',
								Authorization: `Bearer ${apiAccessToken}`,
							},
						},
					},
					data: 'https://tileserver.cropinsurance-dev.thaicom.io/subdistrict/tiles.json',
					filled: true,
					lineWidthUnits: 'pixels',
					getFillColor(d: Feature<Geometry, SubDistrictPropertiesType>) {
						return BoundaryTileColor.default
					},
					getLineColor(d: Feature<Geometry, SubDistrictPropertiesType>) {
						return LineWidthColor.default
					},
					getLineWidth(d: Feature<Geometry, SubDistrictPropertiesType>) {
						if (queryParams.subDistrictCode === d.properties.subDistrictCode) {
							return SelectedLineWidth
						}
						return DefaultLineWidth
					},
					pickable: true,
					updateTriggers: {
						getFillColor: queryParams.subDistrictCode,
						getLineColor: queryParams.subDistrictCode,
						getLineWidth: queryParams.subDistrictCode,
					},
				}),
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
					data: `https://tileserver.cropinsurance-dev.thaicom.io/boundary_${queryParams.year}/tiles.json`,
					filled: true,
					getFillColor(d: Feature<Geometry, BoundaryLayerType>) {
						if (areaSearchPlotId.includes(d.properties.activity_id)) {
							return LossTypeTileColor.rnr
						}
						return LossTypeTileColor.default
					},
					getLineColor(d: Feature<Geometry, BoundaryLayerType>) {
						return LineWidthColor.default
					},
					getLineWidth(d: Feature<Geometry, BoundaryLayerType>) {
						if (areaSearchPlotId.includes(d.properties.activity_id)) {
							return SelectedLineWidth
						}
						return DefaultLineWidth
					},
					pickable: true,
					updateTriggers: {
						getFillColor: queryParams.subDistrictCode,
						getLineColor: queryParams.subDistrictCode,
						getLineWidth: queryParams.subDistrictCode,
					},
					onClick: (info, event) => {
						if (info.object) {
							if (areaSearchPlotId.includes(info.object.properties.activity_id)) {
								if (info.coordinate) {
									handlePositionClick(info.x, info.y, info.coordinate, queryParams.year)
								}
							} else {
								setClickInfo(null)
							}
						} else {
							setClickInfo(null)
						}
					},
				}),
			])
		}
	}, [
		setLayers,
		areaSearchPlot,
		areaSearchPlotId,
		handlePositionClick,
		queryParams.provinceCode,
		queryParams.districtCode,
		queryParams.subDistrictCode,
		queryParams.year,
	])

	return (
		<div
			className={classNames('relative h-[390px] w-full max-lg:overflow-hidden max-lg:rounded lg:h-full', {
				'lg:hidden': areaDetail !== 'map',
			})}
		>
			<InfoWindows clickInfo={clickInfo} setClickInfo={setClickInfo} />
			<MapView />
		</div>
	)
}

export default MapList
