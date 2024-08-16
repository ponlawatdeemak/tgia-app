'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import MapView from '@/components/common/map/MapView'
import { Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'
import useAreaType from '@/store/area-type'
import { AreaTypeKey, LossType } from '@/enum'
import useResponsive from '@/hook/responsive'
import DatePickerHorizontal from '@/components/shared/DatePickerHorizontal'
import { addDays, format } from 'date-fns'
import ColorRange from '../Map/ColorRange'
import {
	DroughtRangeColor,
	DroughtTileColor,
	FloodRangeColor,
	FloodTileColor,
	TotalRangeColor,
	TotalTileColor,
} from '@/config/color'
import useLayerStore from '@/components/common/map/store/map'
import { MVTLayer } from '@deck.gl/geo-layers'
import Tooltip from '../Map/Tooltip'
import { GetSummaryAreaDtoOut } from '@/api/field-loss/dto-out.dto'
import { GetSummaryAreaDtoIn } from '@/api/field-loss/dto-in.dto'
import useSearchFieldLoss from '../Main/context'
import { Feature, Geometry } from 'geojson'

interface FilterRangeMonthType {
	startDate: string
	endDate: string
	registrationAreaType: AreaTypeKey
	provinceId: number | undefined
	districtId: number | undefined
}

// enum SortFieldType {
// 	1 =
// }

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

type HoverInfo = {
	x: number
	y: number
	area: GetSummaryAreaDtoOut | null
	areaCode: number
	layerName: string
}

interface LayerType {
	layerName: string
	layerId: number | null
}

interface MapDetailProps {
	areaDetail: string
	layer: LayerType
	setLayer: React.Dispatch<React.SetStateAction<LayerType>>
}

const MapDetail: React.FC<MapDetailProps> = ({ areaDetail, layer, setLayer }) => {
	const { queryParams } = useSearchFieldLoss()
	const { isDesktop } = useResponsive()
	const { areaType } = useAreaType()
	const { layers, addLayer, setLayers } = useLayerStore()
	const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null)

	const filterRangeMonth = useMemo(() => {
		const filter: FilterRangeMonthType = {
			startDate: queryParams.startDate
				? format(queryParams.startDate, 'yyyy-MM-dd')
				: format(new Date(), 'yyyy-MM-dd'),
			endDate: queryParams.endDate
				? format(queryParams.endDate, 'yyyy-MM-dd')
				: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
			registrationAreaType: areaType,
			provinceId: queryParams.provinceId,
			districtId: queryParams.districtId,
		}
		return filter
	}, [queryParams, areaType])

	const { data: calendarData } = useQuery({
		queryKey: ['calendar', filterRangeMonth],
		queryFn: () => service.calendar.getCalendar(filterRangeMonth),
	})

	const filterSummaryArea = useMemo(() => {
		const filter: GetSummaryAreaDtoIn = {
			startDate: queryParams.startDate
				? format(queryParams.startDate, 'yyyy-MM-dd')
				: format(new Date(), 'yyyy-MM-dd'),
			endDate: queryParams.endDate
				? format(queryParams.endDate, 'yyyy-MM-dd')
				: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
			registrationAreaType: areaType,
			provinceCode: queryParams.provinceId,
			districtCode: queryParams.districtId,
		}
		return filter
	}, [queryParams, areaType])

	const { data: summaryAreaData, isLoading: isSummaryAreaDataLoading } = useQuery({
		queryKey: ['getSummaryArea', filterSummaryArea],
		queryFn: () => service.fieldLoss.getSummaryArea(filterSummaryArea),
		enabled: areaDetail === 'summary-area' || !isDesktop,
	})

	const summaryAreaId = useMemo(() => {
		return summaryAreaData?.data?.map((item) => parseInt(item.id)) || []
	}, [summaryAreaData])

	const checkLevelTileColor = useCallback((percent: number) => {
		let level
		switch (true) {
			case percent >= 80 && percent <= 100:
				level = 'level5'
				break
			case percent >= 60 && percent < 80:
				level = 'level4'
				break
			case percent >= 40 && percent < 60:
				level = 'level3'
				break
			case percent >= 20 && percent < 40:
				level = 'level2'
				break
			case percent >= 0 && percent < 20:
				level = 'level1'
				break
			default:
				level = 'default'
		}
		return level
	}, [])

	useEffect(() => {
		if (layer.layerName === 'country') {
			setLayers([
				new MVTLayer({
					data: 'https://tileserver.cropinsurance-dev.thaicom.io/province/tiles.json',
					filled: true,
					//visible: layer.layerName === 'country',
					getFillColor(d: Feature<Geometry, ProvincePropertiesType>) {
						if (summaryAreaId.includes(d.properties.provinceCode)) {
							const province = summaryAreaData?.data?.find(
								(item) => parseInt(item.id) === d.properties.provinceCode,
							)
							switch (queryParams.lossType) {
								case LossType.Drought: {
									const percentDrought =
										province?.lossPredicted.find((item) => item.lossType === 'drought')?.percent ||
										null
									const levelDroughtColor = percentDrought
										? checkLevelTileColor(percentDrought)
										: null
									return levelDroughtColor
										? DroughtTileColor[levelDroughtColor]
										: DroughtTileColor.default
								}
								case LossType.Flood: {
									const percentFlood =
										province?.lossPredicted.find((item) => item.lossType === 'flood')?.percent ||
										null
									const levelFloodColor = percentFlood ? checkLevelTileColor(percentFlood) : null
									return levelFloodColor ? FloodTileColor[levelFloodColor] : FloodTileColor.default
								}
								default: {
									const percentTotal = province?.totalPredictedArea.percent || null
									const levelTotalColor = percentTotal ? checkLevelTileColor(percentTotal) : null
									return levelTotalColor ? TotalTileColor[levelTotalColor] : TotalTileColor.default
								}
							}
						}
						return TotalTileColor.default
					},
					getLineColor(d: Feature<Geometry, ProvincePropertiesType>) {
						return [0, 0, 0, 255]
					},
					getLineWidth(d: Feature<Geometry, ProvincePropertiesType>) {
						if (summaryAreaId.includes(d.properties.provinceCode)) {
							return 400
						}
						return 4
					},
					pickable: true,
					updateTriggers: {
						getFillColor: queryParams.lossType,
						getLineColor: queryParams.lossType,
						getLineWidth: queryParams.lossType,
					},
					onHover: (info, event) => {
						if (info.object) {
							if (summaryAreaId.includes(info.object.properties.provinceCode)) {
								const province =
									summaryAreaData?.data?.find(
										(item) => parseInt(item.id) === info.object.properties.provinceCode,
									) || null
								console.log('lossType', queryParams.lossType)
								switch (queryParams.lossType) {
									case LossType.Drought: {
										if (province?.lossPredicted.find((item) => item.lossType === 'drought')) {
											setHoverInfo({
												x: info.x,
												y: info.y,
												area: province,
												areaCode: info.object.properties.provinceCode,
												layerName: info.object.properties.layerName,
											})
										} else {
											setHoverInfo(null)
										}
										break
									}
									case LossType.Flood: {
										if (province?.lossPredicted.find((item) => item.lossType === 'flood')) {
											setHoverInfo({
												x: info.x,
												y: info.y,
												area: province,
												areaCode: info.object.properties.provinceCode,
												layerName: info.object.properties.layerName,
											})
										} else {
											setHoverInfo(null)
										}
										break
									}
									default: {
										setHoverInfo({
											x: info.x,
											y: info.y,
											area: province,
											areaCode: info.object.properties.provinceCode,
											layerName: info.object.properties.layerName,
										})
										break
									}
								}
							} else {
								setHoverInfo(null)
							}
						} else {
							setHoverInfo(null)
						}
					},
				}),
			])
		} else if (layer.layerName === 'province') {
			setLayers([
				new MVTLayer({
					data: 'https://tileserver.cropinsurance-dev.thaicom.io/district/tiles.json',
					filled: true,
					//visible: layer.layerName === 'province',
					getFillColor(d: Feature<Geometry, DistrictPropertiesType>) {
						if (summaryAreaId.includes(d.properties.districtCode)) {
							const district = summaryAreaData?.data?.find(
								(item) => parseInt(item.id) === d.properties.districtCode,
							)
							switch (queryParams.lossType) {
								case LossType.Drought: {
									const percentDrought =
										district?.lossPredicted.find((item) => item.lossType === 'drought')?.percent ||
										null
									const levelDroughtColor = percentDrought
										? checkLevelTileColor(percentDrought)
										: null
									return levelDroughtColor
										? DroughtTileColor[levelDroughtColor]
										: DroughtTileColor.default
								}
								case LossType.Flood: {
									const percentFlood =
										district?.lossPredicted.find((item) => item.lossType === 'flood')?.percent ||
										null
									const levelFloodColor = percentFlood ? checkLevelTileColor(percentFlood) : null
									return levelFloodColor ? FloodTileColor[levelFloodColor] : FloodTileColor.default
								}
								default: {
									const percentTotal = district?.totalPredictedArea.percent || null
									const levelTotalColor = percentTotal ? checkLevelTileColor(percentTotal) : null
									return levelTotalColor ? TotalTileColor[levelTotalColor] : TotalTileColor.default
								}
							}
						}
						return TotalTileColor.default
					},
					getLineColor(d: Feature<Geometry, DistrictPropertiesType>) {
						return [0, 0, 0, 255]
					},
					getLineWidth(d: Feature<Geometry, DistrictPropertiesType>) {
						if (summaryAreaId.includes(d.properties.districtCode)) {
							const district =
								summaryAreaData?.data?.find(
									(item) => parseInt(item.id) === d.properties.districtCode,
								) || null
							switch (queryParams.lossType) {
								case LossType.Drought: {
									if (district?.lossPredicted.find((item) => item.lossType === 'drought')) {
										return 400
									} else {
										return 4
									}
								}
								case LossType.Flood: {
									if (district?.lossPredicted.find((item) => item.lossType === 'flood')) {
										return 400
									} else {
										return 4
									}
								}
								default: {
									return 400
								}
							}
						}
						return 4
					},
					pickable: true,
					updateTriggers: {
						getFillColor: queryParams.lossType,
						getLineColor: queryParams.lossType,
						getLineWidth: queryParams.lossType,
					},
					onHover: (info, event) => {
						if (info.object) {
							if (summaryAreaId.includes(info.object.properties.districtCode)) {
								const district =
									summaryAreaData?.data?.find(
										(item) => parseInt(item.id) === info.object.properties.districtCode,
									) || null
								console.log('lossType', queryParams.lossType)
								switch (queryParams.lossType) {
									case LossType.Drought: {
										if (district?.lossPredicted.find((item) => item.lossType === 'drought')) {
											setHoverInfo({
												x: info.x,
												y: info.y,
												area: district,
												areaCode: info.object.properties.districtCode,
												layerName: info.object.properties.layerName,
											})
										} else {
											setHoverInfo(null)
										}
										break
									}
									case LossType.Flood: {
										if (district?.lossPredicted.find((item) => item.lossType === 'flood')) {
											setHoverInfo({
												x: info.x,
												y: info.y,
												area: district,
												areaCode: info.object.properties.districtCode,
												layerName: info.object.properties.layerName,
											})
										} else {
											setHoverInfo(null)
										}
										break
									}
									default: {
										setHoverInfo({
											x: info.x,
											y: info.y,
											area: district,
											areaCode: info.object.properties.districtCode,
											layerName: info.object.properties.layerName,
										})
										break
									}
								}
							} else {
								setHoverInfo(null)
							}
						} else {
							setHoverInfo(null)
						}
					},
				}),
			])
		} else if (layer.layerName === 'district') {
			setLayers([
				new MVTLayer({
					data: 'https://tileserver.cropinsurance-dev.thaicom.io/subdistrict/tiles.json',
					filled: true,
					//visible: layer.layerName === 'district',
					getFillColor(d: Feature<Geometry, SubDistrictPropertiesType>) {
						if (summaryAreaId.includes(d.properties.subDistrictCode)) {
							const subDistrict = summaryAreaData?.data?.find(
								(item) => parseInt(item.id) === d.properties.subDistrictCode,
							)
							switch (queryParams.lossType) {
								case LossType.Drought: {
									const percentDrought =
										subDistrict?.lossPredicted.find((item) => item.lossType === 'drought')
											?.percent || null
									const levelDroughtColor = percentDrought
										? checkLevelTileColor(percentDrought)
										: null
									return levelDroughtColor
										? DroughtTileColor[levelDroughtColor]
										: DroughtTileColor.default
								}
								case LossType.Flood: {
									const percentFlood =
										subDistrict?.lossPredicted.find((item) => item.lossType === 'flood')?.percent ||
										null
									const levelFloodColor = percentFlood ? checkLevelTileColor(percentFlood) : null
									return levelFloodColor ? FloodTileColor[levelFloodColor] : FloodTileColor.default
								}
								default: {
									const percentTotal = subDistrict?.totalPredictedArea.percent || null
									const levelTotalColor = percentTotal ? checkLevelTileColor(percentTotal) : null
									return levelTotalColor ? TotalTileColor[levelTotalColor] : TotalTileColor.default
								}
							}
						}
						return TotalTileColor.default
					},
					getLineColor(d: Feature<Geometry, SubDistrictPropertiesType>) {
						return [0, 0, 0, 255]
					},
					getLineWidth(d: Feature<Geometry, SubDistrictPropertiesType>) {
						if (summaryAreaId.includes(d.properties.subDistrictCode)) {
							const subDistrict =
								summaryAreaData?.data?.find(
									(item) => parseInt(item.id) === d.properties.subDistrictCode,
								) || null
							switch (queryParams.lossType) {
								case LossType.Drought: {
									if (subDistrict?.lossPredicted.find((item) => item.lossType === 'drought')) {
										return 400
									} else {
										return 4
									}
								}
								case LossType.Flood: {
									if (subDistrict?.lossPredicted.find((item) => item.lossType === 'flood')) {
										return 400
									} else {
										return 4
									}
								}
								default: {
									return 400
								}
							}
						}
						return 4
					},
					pickable: true,
					updateTriggers: {
						getFillColor: queryParams.lossType,
						getLineColor: queryParams.lossType,
						getLineWidth: queryParams.lossType,
					},
					onHover: (info, event) => {
						if (info.object) {
							if (summaryAreaId.includes(info.object.properties.subDistrictCode)) {
								const subDistrict =
									summaryAreaData?.data?.find(
										(item) => parseInt(item.id) === info.object.properties.subDistrictCode,
									) || null
								console.log('lossType', queryParams.lossType)
								switch (queryParams.lossType) {
									case LossType.Drought: {
										if (subDistrict?.lossPredicted.find((item) => item.lossType === 'drought')) {
											setHoverInfo({
												x: info.x,
												y: info.y,
												area: subDistrict,
												areaCode: info.object.properties.subDistrictCode,
												layerName: info.object.properties.layerName,
											})
										} else {
											setHoverInfo(null)
										}
										break
									}
									case LossType.Flood: {
										if (subDistrict?.lossPredicted.find((item) => item.lossType === 'flood')) {
											setHoverInfo({
												x: info.x,
												y: info.y,
												area: subDistrict,
												areaCode: info.object.properties.subDistrictCode,
												layerName: info.object.properties.layerName,
											})
										} else {
											setHoverInfo(null)
										}
										break
									}
									default: {
										setHoverInfo({
											x: info.x,
											y: info.y,
											area: subDistrict,
											areaCode: info.object.properties.subDistrictCode,
											layerName: info.object.properties.layerName,
										})
										break
									}
								}
							} else {
								setHoverInfo(null)
							}
						} else {
							setHoverInfo(null)
						}
					},
				}),
			])
		}
	}, [setLayers, summaryAreaData, queryParams.lossType, checkLevelTileColor, layer, summaryAreaId])

	return (
		<div className='relative h-[390px] w-full max-lg:overflow-hidden max-lg:rounded lg:h-full'>
			<Box className='absolute bottom-2 left-[68px] z-10 w-[calc(100%-84px)] max-lg:hidden'>
				<DatePickerHorizontal
					startDate={queryParams.startDate || new Date()}
					endDate={queryParams.endDate || addDays(new Date(), 15)}
					calendarData={calendarData}
				/>
			</Box>
			<Box className='absolute bottom-24 right-2 z-10 max-lg:hidden'>
				{!queryParams.lossType && (
					<ColorRange startColor={TotalRangeColor.start} endColor={TotalRangeColor.end} />
				)}
				{queryParams.lossType === LossType.Drought && (
					<ColorRange startColor={DroughtRangeColor.start} endColor={DroughtRangeColor.end} />
				)}
				{queryParams.lossType === LossType.Flood && (
					<ColorRange startColor={FloodRangeColor.start} endColor={FloodRangeColor.end} />
				)}
			</Box>
			<Tooltip info={hoverInfo} setHoverInfo={setHoverInfo} setLayer={setLayer} />
			<MapView />
		</div>
	)
}

export default MapDetail
