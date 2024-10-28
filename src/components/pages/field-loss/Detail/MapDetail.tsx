'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
// import MapView, { MapViewRef } from '@/components/common/map/MapView'

import MapView from '@/components/common/map/MapView'
import { Box, Breadcrumbs, Link, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'
import useAreaType from '@/store/area-type'
import { AreaTypeKey, LossType } from '@/enum'
import useResponsive from '@/hook/responsive'
import DatePickerHorizontal from '@/components/shared/DatePickerHorizontal'
import { addDays, format } from 'date-fns'
import ColorRange from '../Map/ColorRange'
import {
	BoundaryTileColor,
	DroughtRangeColor,
	DroughtTileColor,
	FloodRangeColor,
	FloodTileColor,
	LineWidthColor,
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
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { apiAccessToken } from '@/api/core'

interface FilterRangeMonthType {
	startDate: string
	endDate: string
	registrationAreaType: AreaTypeKey
	provinceCode: number | undefined
	districtCode: number | undefined
}

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

const API_URL_TILE = process.env.API_URL_TILE

const SelectedLineWidth = 2
const DefaultLineWidth = 0

interface MapDetailProps {
	areaDetail: string
	mapViewRef: any
}

const MapDetail: React.FC<MapDetailProps> = ({ areaDetail, mapViewRef }) => {
	const { queryParams, setQueryParams } = useSearchFieldLoss()
	const { isDesktop } = useResponsive()
	const { areaType } = useAreaType()
	const { t } = useTranslation(['default', 'field-loss'])
	const { setLayers } = useLayerStore()
	const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null)

	const { data: provinceLookupData, isLoading: _isProvinceDataLoading } = useQuery({
		queryKey: ['getMapProvince'],
		queryFn: () => service.lookup.get('provinces'),
	})

	const provinceLookupId = useMemo(() => {
		return provinceLookupData?.data?.map((item) => Number(item.code)) || []
	}, [provinceLookupData])

	const filterRangeMonth = useMemo(() => {
		const filter: FilterRangeMonthType = {
			startDate: queryParams.startDate
				? format(queryParams.startDate, 'yyyy-MM-dd')
				: format(new Date(), 'yyyy-MM-dd'),
			endDate: queryParams.endDate
				? format(queryParams.endDate, 'yyyy-MM-dd')
				: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
			registrationAreaType: areaType,
			provinceCode: queryParams.provinceCode,
			districtCode: queryParams.districtCode,
		}
		return filter
	}, [queryParams, areaType])

	const { data: calendarData } = useQuery({
		queryKey: ['calendar', filterRangeMonth],
		queryFn: () => service.calendar.getCalendar(filterRangeMonth),
	})

	const filterSummaryArea = useMemo(() => {
		const filter: GetSummaryAreaDtoIn = {
			startDate: queryParams.selectedDateHorizontal
				? format(queryParams.selectedDateHorizontal, 'yyyy-MM-dd')
				: queryParams.startDate
					? format(queryParams.startDate, 'yyyy-MM-dd')
					: format(new Date(), 'yyyy-MM-dd'),
			endDate: queryParams.selectedDateHorizontal
				? format(queryParams.selectedDateHorizontal, 'yyyy-MM-dd')
				: queryParams.endDate
					? format(queryParams.endDate, 'yyyy-MM-dd')
					: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
			registrationAreaType: areaType,
			provinceCode: queryParams.provinceCode,
			districtCode: queryParams.districtCode,
		}
		return filter
	}, [queryParams, areaType])

	const { data: summaryAreaData, isLoading: _isSummaryAreaDataLoading } = useQuery({
		queryKey: ['getSummaryArea', filterSummaryArea],
		queryFn: () => service.fieldLoss.getSummaryArea(filterSummaryArea),
		//enabled: areaDetail === 'summary-area' || !isDesktop,
	})

	const summaryAreaId = useMemo(() => {
		return summaryAreaData?.data?.map((item) => parseInt(item.id)) || []
	}, [summaryAreaData])

	const checkLevelTileColor = useCallback((percent: number) => {
		let level
		switch (true) {
			case percent <= 10:
				level = 'level1'
				break
			case percent <= 20:
				level = 'level2'
				break
			case percent <= 30:
				level = 'level3'
				break
			case percent <= 40:
				level = 'level4'
				break
			case percent <= 50:
				level = 'level5'
				break
			case percent <= 60:
				level = 'level6'
				break
			case percent <= 70:
				level = 'level7'
				break
			case percent <= 80:
				level = 'level8'
				break
			case percent <= 90:
				level = 'level9'
				break
			case percent <= 100:
				level = 'level10'
				break
			default:
				level = 'default'
		}
		return level
	}, [])

	const getColor = useCallback(
		(admCode: number, layerName: string) => {
			if (layerName === 'province' && !provinceLookupId.includes(admCode)) return TotalTileColor.default
			if (
				(queryParams.subDistrictCode || !summaryAreaId.includes(admCode)) &&
				(!queryParams.subDistrictCode || queryParams.subDistrictCode !== admCode)
			)
				return TotalTileColor.default

			const data = summaryAreaData?.data?.find((item) => Number(item.id) === admCode)
			switch (queryParams.lossType) {
				case LossType.Drought: {
					const percentDrought =
						data?.lossPredicted?.find((item) => item.lossType === 'drought')?.percent ?? null
					const levelDroughtColor =
						percentDrought !== null && percentDrought >= 0 ? checkLevelTileColor(percentDrought) : null
					return levelDroughtColor ? DroughtTileColor[levelDroughtColor] : DroughtTileColor.default
				}
				case LossType.Flood: {
					const percentFlood = data?.lossPredicted?.find((item) => item.lossType === 'flood')?.percent ?? null
					const levelFloodColor =
						percentFlood !== null && percentFlood >= 0 ? checkLevelTileColor(percentFlood) : null
					return levelFloodColor ? FloodTileColor[levelFloodColor] : FloodTileColor.default
				}
				default: {
					const percentTotal = data?.totalPredictedArea?.percent ?? null
					const levelTotalColor =
						percentTotal !== null && percentTotal >= 0 ? checkLevelTileColor(percentTotal) : null
					return levelTotalColor ? TotalTileColor[levelTotalColor] : TotalTileColor.default
				}
			}
		},
		[
			provinceLookupId,
			queryParams.subDistrictCode,
			summaryAreaId,
			summaryAreaData,
			queryParams.lossType,
			checkLevelTileColor,
		],
	)

	const getLineWidth = useCallback(
		(admCode: number) => {
			if (
				(queryParams.subDistrictCode || !summaryAreaId.includes(admCode)) &&
				(!queryParams.subDistrictCode || queryParams.subDistrictCode !== admCode)
			)
				return DefaultLineWidth

			const data = summaryAreaData?.data?.find((item) => Number(item.id) === Number(admCode)) || null
			switch (queryParams.lossType) {
				case LossType.Drought: {
					if (data?.lossPredicted?.find((item) => item.lossType === 'drought')) {
						return SelectedLineWidth
					} else {
						return DefaultLineWidth
					}
				}
				case LossType.Flood: {
					if (data?.lossPredicted?.find((item) => item.lossType === 'flood')) {
						return SelectedLineWidth
					} else {
						return DefaultLineWidth
					}
				}
				default: {
					return SelectedLineWidth
				}
			}
		},
		[queryParams.subDistrictCode, summaryAreaId, summaryAreaData, queryParams.lossType],
	)

	const getHover = useCallback(
		(x: number, y: number, areaCode: number, layerName: string) => {
			if (layerName === 'province' && !provinceLookupId.includes(areaCode)) return setHoverInfo(null)
			if (
				(queryParams.subDistrictCode || !summaryAreaId.includes(areaCode)) &&
				(!queryParams.subDistrictCode || queryParams.subDistrictCode !== areaCode)
			)
				return setHoverInfo(null)

			const data = summaryAreaData?.data?.find((item) => Number(item.id) === areaCode) || null
			switch (queryParams.lossType) {
				case LossType.Drought: {
					if (data?.lossPredicted?.find((item) => item.lossType === 'drought')) {
						setHoverInfo({ x, y, area: data, areaCode, layerName })
					} else {
						setHoverInfo(null)
					}
					break
				}
				case LossType.Flood: {
					if (data?.lossPredicted?.find((item) => item.lossType === 'flood')) {
						setHoverInfo({ x, y, area: data, areaCode, layerName })
					} else {
						setHoverInfo(null)
					}
					break
				}
				default: {
					setHoverInfo({ x, y, area: data, areaCode, layerName })
					break
				}
			}
		},
		[
			provinceLookupId,
			queryParams.subDistrictCode,
			summaryAreaId,
			summaryAreaData,
			queryParams.lossType,
			setHoverInfo,
		],
	)

	useEffect(() => {
		setHoverInfo(null)
		if (!queryParams.layerName) {
			setLayers([
				new MVTLayer({
					id: 'province' + `-${new Date().getTime()}`,
					name: 'province',
					loadOptions: {
						fetch: {
							headers: {
								'content-type': 'application/json',
								Authorization: `Bearer ${apiAccessToken}`,
							},
						},
					},
					data: `${API_URL_TILE}/province/tiles.json`,
					filled: true,
					lineWidthUnits: 'pixels',
					getFillColor: (d: Feature<Geometry, ProvincePropertiesType>) => {
						const fillColor = getColor(Number(d.properties.provinceCode), d.properties.layerName)
						return fillColor
					},
					getLineColor(d: Feature<Geometry, ProvincePropertiesType>) {
						return LineWidthColor.default
					},
					getLineWidth(d: Feature<Geometry, ProvincePropertiesType>) {
						if (provinceLookupId.includes(Number(d.properties.provinceCode))) {
							return SelectedLineWidth
						}
						return DefaultLineWidth
					},
					pickable: true,
					onHover: (info, event) => {
						if (!info.object) return setHoverInfo(null)
						getHover(
							info.x,
							info.y,
							Number(info.object.properties.provinceCode),
							info.object.properties.layerName,
						)
					},
					onClick: (info, event) => {
						if (info.object) {
							setQueryParams({
								...queryParams,
								provinceCode: Number(info.object.properties.provinceCode),
								layerName: info.object.properties.layerName,
							})
						}
					},
					updateTriggers: {
						getFillColor: [queryParams.lossType, getColor],
						getLineColor: queryParams.lossType,
						getLineWidth: queryParams.lossType,
					},
				}),
			])
		} else if (queryParams.layerName === 'province') {
			setLayers([
				new MVTLayer({
					id: 'province-district' + `-${new Date().getTime()}`,
					name: 'province-district',
					loadOptions: {
						fetch: {
							headers: {
								'content-type': 'application/json',
								Authorization: `Bearer ${apiAccessToken}`,
							},
						},
					},
					data: `${API_URL_TILE}/province/tiles.json`,
					filled: true,
					lineWidthUnits: 'pixels',
					getFillColor(d: Feature<Geometry, ProvincePropertiesType>) {
						return BoundaryTileColor.default
					},
					getLineColor(d: Feature<Geometry, ProvincePropertiesType>) {
						return LineWidthColor.default
					},
					getLineWidth(d: Feature<Geometry, ProvincePropertiesType>) {
						if (queryParams.provinceCode === Number(d.properties.provinceCode)) {
							return SelectedLineWidth
						}
						return DefaultLineWidth
					},
				}),
				new MVTLayer({
					id: 'district' + `-${new Date().getTime()}`,
					name: 'district',
					loadOptions: {
						fetch: {
							headers: {
								'content-type': 'application/json',
								Authorization: `Bearer ${apiAccessToken}`,
							},
						},
					},
					data: `${API_URL_TILE}/district/tiles.json`,
					filled: true,
					lineWidthUnits: 'pixels',
					getFillColor: (d: Feature<Geometry, DistrictPropertiesType>) => {
						const fillColor = getColor(Number(d.properties.districtCode), d.properties.layerName)
						return fillColor
					},
					getLineColor(d: Feature<Geometry, DistrictPropertiesType>) {
						return LineWidthColor.default
					},
					getLineWidth: (d: Feature<Geometry, DistrictPropertiesType>) =>
						getLineWidth(Number(d.properties.districtCode)),
					pickable: true,
					onHover: (info, event) => {
						if (!info.object) return setHoverInfo(null)
						getHover(
							info.x,
							info.y,
							Number(info.object.properties.districtCode),
							info.object.properties.layerName,
						)
					},
					onClick: (info, event) => {
						if (info.object) {
							setQueryParams({
								...queryParams,
								districtCode: Number(info.object.properties.districtCode),
								layerName: info.object.properties.layerName,
							})
						}
					},
					updateTriggers: {
						getFillColor: [queryParams.lossType, getColor],
						getLineColor: queryParams.lossType,
						getLineWidth: [queryParams.lossType, getLineWidth],
					},
				}),
			])
		} else if (queryParams.layerName === 'district') {
			setLayers([
				new MVTLayer({
					id: 'district-subDistrict' + `-${new Date().getTime()}`,
					name: 'district-subDistrict',
					loadOptions: {
						fetch: {
							headers: {
								'content-type': 'application/json',
								Authorization: `Bearer ${apiAccessToken}`,
							},
						},
					},
					data: `${API_URL_TILE}/district/tiles.json`,
					filled: true,
					lineWidthUnits: 'pixels',
					getFillColor(d: Feature<Geometry, DistrictPropertiesType>) {
						return BoundaryTileColor.default
					},
					getLineColor(d: Feature<Geometry, DistrictPropertiesType>) {
						return LineWidthColor.default
					},
					getLineWidth(d: Feature<Geometry, DistrictPropertiesType>) {
						if (queryParams.districtCode === Number(d.properties.districtCode)) {
							return SelectedLineWidth
						}
						return DefaultLineWidth
					},
				}),
				new MVTLayer({
					id: 'subDistrict' + `-${new Date().getTime()}`,
					name: 'subDistrict',
					loadOptions: {
						fetch: {
							headers: {
								'content-type': 'application/json',
								Authorization: `Bearer ${apiAccessToken}`,
							},
						},
					},
					data: `${API_URL_TILE}/subdistrict/tiles.json`,
					filled: true,
					lineWidthUnits: 'pixels',
					getFillColor: (d: Feature<Geometry, SubDistrictPropertiesType>) => {
						const fillColor = getColor(Number(d.properties.subDistrictCode), d.properties.layerName)
						return fillColor
					},
					getLineColor(d: Feature<Geometry, SubDistrictPropertiesType>) {
						return LineWidthColor.default
					},
					getLineWidth: (d: Feature<Geometry, SubDistrictPropertiesType>) =>
						getLineWidth(Number(d.properties.subDistrictCode)),
					pickable: true,
					onHover: (info, event) => {
						if (!info.object) return setHoverInfo(null)
						getHover(
							info.x,
							info.y,
							Number(info.object.properties.subDistrictCode),
							info.object.properties.layerName,
						)
					},
					onClick: (info, event) => {
						if (info.object) {
							setQueryParams({
								...queryParams,
								subDistrictCode: Number(info.object.properties.subDistrictCode),
								layerName: info.object.properties.layerName,
							})
						}
					},
					updateTriggers: {
						getFillColor: [queryParams.lossType, getColor],
						getLineColor: queryParams.lossType,
						getLineWidth: [queryParams.lossType, getLineWidth],
					},
				}),
			])
		} else if (queryParams.layerName === 'subdistrict') {
			setLayers([
				new MVTLayer({
					id: 'subDistrict-subDistrict' + `-${new Date().getTime()}`,
					name: 'subDistrict-subDistrict',
					loadOptions: {
						fetch: {
							headers: {
								'content-type': 'application/json',
								Authorization: `Bearer ${apiAccessToken}`,
							},
						},
					},
					data: `${API_URL_TILE}/subdistrict/tiles.json`,
					filled: true,
					lineWidthUnits: 'pixels',
					getFillColor: (d: Feature<Geometry, SubDistrictPropertiesType>) => {
						const fillColor = getColor(Number(d.properties.subDistrictCode), d.properties.layerName)
						return fillColor
					},
					getLineColor(d: Feature<Geometry, SubDistrictPropertiesType>) {
						return LineWidthColor.default
					},
					getLineWidth: (d: Feature<Geometry, SubDistrictPropertiesType>) =>
						getLineWidth(Number(d.properties.subDistrictCode)),
					pickable: true,
					updateTriggers: {
						getFillColor: [queryParams.lossType, getColor],
						getLineColor: queryParams.lossType,
						getLineWidth: [queryParams.lossType, getLineWidth],
					},
					onHover: (info, event) => {
						if (!info.object) return setHoverInfo(null)
						getHover(info.x, info.y, Number(info.object.properties.subDistrictCode), 'endLayer')
					},
				}),
			])
		}
	}, [
		setLayers,
		setHoverInfo,
		queryParams.lossType,
		queryParams.layerName,
		queryParams.provinceCode,
		queryParams.districtCode,
		queryParams.subDistrictCode,
		provinceLookupId,
		getColor,
		getHover,
		getLineWidth,
	])

	function handleCountryClick() {
		setQueryParams({
			...queryParams,
			provinceCode: undefined,
			districtCode: undefined,
			subDistrictCode: undefined,
			layerName: undefined,
		})
	}

	const handleProvinceClick = () => {
		setQueryParams({ ...queryParams, districtCode: undefined, subDistrictCode: undefined, layerName: 'province' })
	}

	const handleDistrictClick = () => {
		setQueryParams({ ...queryParams, subDistrictCode: undefined, layerName: 'district' })
	}

	return (
		<div
			className={classNames('relative h-[390px] w-full max-lg:overflow-hidden max-lg:rounded lg:h-full', {
				'lg:hidden': areaDetail !== 'summary-area',
			})}
		>
			<Box
				role='presentation'
				className='absolute left-3 top-3 z-10 flex h-7 items-center gap-2 rounded-lg bg-white px-2 py-1'
			>
				{isDesktop && (
					<Typography className='text-sm font-medium text-black xl:text-base'>{`${t('level', { ns: 'field-loss' })}:`}</Typography>
				)}
				<Breadcrumbs aria-label='breadcrumb' className='max-xl:[&_li.MuiBreadcrumbs-separator]:mx-1.5'>
					{queryParams.layerName && (
						<Link
							className='text-sm font-normal text-black xl:text-base'
							underline='hover'
							href='#'
							onClick={handleCountryClick}
						>
							{t('national', { ns: 'field-loss' })}
						</Link>
					)}
					{queryParams.layerName &&
						(queryParams.layerName === 'district' || queryParams.layerName === 'subdistrict') && (
							<Link
								className='text-sm font-normal text-black xl:text-base'
								underline='hover'
								href='#'
								onClick={handleProvinceClick}
							>
								{t('province')}
							</Link>
						)}
					{queryParams.layerName && queryParams.layerName === 'subdistrict' && (
						<Link
							className='text-sm font-normal text-black xl:text-base'
							underline='hover'
							href='#'
							onClick={handleDistrictClick}
						>
							{t('district')}
						</Link>
					)}
					<Typography className='text-sm font-semibold text-black xl:text-base'>
						{queryParams.layerName
							? queryParams.layerName === 'province'
								? t('province')
								: queryParams.layerName === 'district'
									? t('district')
									: t('subDistrict')
							: t('national', { ns: 'field-loss' })}
					</Typography>
				</Breadcrumbs>
			</Box>
			<Box className='absolute bottom-24 right-2 z-10 max-lg:hidden'>
				{!queryParams.lossType && (
					<ColorRange
						title={t('totalDamagedArea', { ns: 'field-loss' })}
						startColor={TotalRangeColor.start}
						endColor={TotalRangeColor.end}
					/>
				)}
				{queryParams.lossType === LossType.Drought && (
					<ColorRange
						title={t('droughtDamageArea', { ns: 'field-loss' })}
						startColor={DroughtRangeColor.start}
						endColor={DroughtRangeColor.end}
					/>
				)}
				{queryParams.lossType === LossType.Flood && (
					<ColorRange
						title={t('floodDamageArea', { ns: 'field-loss' })}
						startColor={FloodRangeColor.start}
						endColor={FloodRangeColor.end}
					/>
				)}
			</Box>
			<Box className='absolute bottom-2 left-[68px] z-10 w-[calc(100%-76px)] max-lg:hidden'>
				<DatePickerHorizontal
					startDate={queryParams.startDate || new Date()}
					endDate={queryParams.endDate || addDays(new Date(), 15)}
					calendarData={calendarData}
				/>
			</Box>
			<Tooltip hoverInfo={hoverInfo} setHoverInfo={setHoverInfo} />
			{/* // TO DO */}
			{/* ref={mapViewRef} */}
			{/* <div className={classNames('relative flex h-full w-full flex-grow flex-col')}> */}
			<MapView />
			{/* </div> */}
		</div>
	)
}

export default MapDetail
