'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import MapView from '@/components/common/map/MapView'
import { Box, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material'
import TableDetail from '../Detail/TableDetail'
import ChartDetail from '../Detail/ChartDetail'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'
import useAreaType from '@/store/area-type'
import { Dayjs } from 'dayjs'
import { AreaTypeKey, LossType, SortType } from '@/enum'
import { time } from 'console'
import { ResponseArea } from '@/api/interface'
import clsx from 'clsx'
import useResponsive from '@/hook/responsive'
import DatePickerHorizontal from '@/components/shared/DatePickerHorizontal'
import { addDays, endOfMonth, format, getDate, startOfMonth } from 'date-fns'
import useSearchFieldLoss from './context'
import useRangePicker from '@/components/shared/DateRangePicker/context'
import ColorRange from '../Map/ColorRange'
import { DroughtTileColor, FloodTileColor, TotalTileColor } from '@/config/color'

interface OptionType {
	name: string
	id: string
	searchType: string
}

interface Data {
	//id: number
	totalPredicted: ResponseArea
	droughtPredicted: ResponseArea
	floodPredicted: ResponseArea
}

interface FieldLossDetailProps {
	selectedOption: OptionType | null
	startDate: Dayjs | null
	endDate: Dayjs | null
	lossType: LossType | null
}

interface FilterType {
	startDate: string
	endDate: string
	registrationAreaType: AreaTypeKey
	provinceId: number | undefined
	districtId: number | undefined
}

// enum SortFieldType {
// 	1 =
// }

const FieldLossDetail: React.FC<FieldLossDetailProps> = ({ selectedOption, startDate, endDate, lossType }) => {
	const { queryParams } = useSearchFieldLoss()
	const { isDesktop } = useResponsive()
	const { areaType } = useAreaType()
	const [areaDetail, setAreaDetail] = useState('summary-area')
	const [sortType, setSortType] = useState<SortType>(SortType.DESC)
	const [sortTypeField, setSortTypeField] = useState<keyof Data>('totalPredicted')

	const filterRangeMonth = useMemo(() => {
		const filter: FilterType = {
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

	useEffect(() => {
		if (lossType) {
			if (lossType === LossType.Flood) {
				setSortTypeField('floodPredicted')
			} else if (lossType === LossType.Drought) {
				setSortTypeField('droughtPredicted')
			}
		} else {
			setSortTypeField('totalPredicted')
		}
	}, [lossType])

	const { data: summaryAreaData, isLoading: isSummaryAreaDataLoading } = useQuery({
		queryKey: ['getSummaryArea', startDate, endDate, areaType, selectedOption?.id],
		queryFn: () =>
			service.fieldLoss.getSummaryArea({
				startDate: startDate?.toISOString().split('T')[0] || '',
				endDate: endDate?.toISOString().split('T')[0] || '',
				registrationAreaType: areaType,
				provinceId: selectedOption?.id ? parseInt(selectedOption.id) : undefined,
			}),
		enabled: areaDetail === 'summary-area' || !isDesktop,
	})

	const { data: areaStatisticData, isLoading: isAreaStatisticData } = useQuery({
		queryKey: ['getAreaStatistic', startDate, endDate, lossType, areaType, sortTypeField, sortType],
		queryFn: () =>
			service.fieldLoss.getAreaStatistic({
				startDate: startDate?.toISOString().split('T')[0] || '',
				endDate: endDate?.toISOString().split('T')[0] || '',
				lossType: lossType || undefined,
				registrationAreaType: areaType,
				sort: sortTypeField,
				sortType: sortType,
			}),
		enabled: areaDetail === 'area-statistic' || !isDesktop,
	})

	const { data: timeStatisticData, isLoading: isTimeStatisticData } = useQuery({
		queryKey: ['getTimeStatistic', startDate, endDate, lossType, areaType],
		queryFn: () =>
			service.fieldLoss.getTimeStatistic({
				startDate: startDate?.toISOString().split('T')[0] || '',
				endDate: endDate?.toISOString().split('T')[0] || '',
				lossType: lossType || undefined,
				registrationAreaType: areaType,
			}),
		enabled: areaDetail === 'time-statistic' || !isDesktop,
	})

	const handleAreaDetailChange = useCallback((_event: React.MouseEvent<HTMLElement>, newAreaDetail: string) => {
		setAreaDetail((prev) => newAreaDetail || prev)
	}, [])

	return (
		<Paper className='relative max-lg:flex max-lg:flex-col max-lg:gap-3 max-lg:bg-gray-light lg:block lg:flex-grow'>
			<ToggleButtonGroup
				size='small'
				exclusive
				color='primary'
				className='absolute right-3 top-3 z-10 flex gap-2 rounded-lg bg-gray-light3 p-1 max-lg:hidden [&_*]:px-3 [&_*]:py-1.5'
				value={areaDetail}
				onChange={handleAreaDetailChange}
			>
				<ToggleButton
					className={clsx('border border-solid text-base', {
						'border-primary bg-white font-semibold text-primary': areaDetail === 'summary-area',
						'border-transparent font-medium text-gray-dark2': areaDetail !== 'summary-area',
					})}
					value={'summary-area'}
				>
					ตามแผนที่
				</ToggleButton>
				<ToggleButton
					className={clsx('border border-solid text-base', {
						'border-primary bg-white font-semibold text-primary': areaDetail === 'area-statistic',
						'border-transparent font-medium text-gray-dark2': areaDetail !== 'area-statistic',
					})}
					value={'area-statistic'}
				>
					ตามอันดับ
				</ToggleButton>
				<ToggleButton
					className={clsx('border border-solid text-base', {
						'border-primary bg-white font-semibold text-primary': areaDetail === 'time-statistic',
						'border-transparent font-medium text-gray-dark2': areaDetail !== 'time-statistic',
					})}
					value={'time-statistic'}
				>
					ตามช่วงเวลา
				</ToggleButton>
			</ToggleButtonGroup>
			{(areaDetail === 'summary-area' || !isDesktop) && (
				<div className='relative h-[390px] w-full max-lg:overflow-hidden max-lg:rounded lg:h-full'>
					<Box className='absolute bottom-2 left-[68px] z-10 w-[calc(100%-84px)] max-lg:hidden'>
						<DatePickerHorizontal
							startDate={queryParams.startDate || new Date()}
							endDate={queryParams.endDate || addDays(new Date(), 15)}
							calendarData={calendarData}
						/>
					</Box>
					<Box className='absolute bottom-24 right-2 z-10 max-lg:hidden'>
						{sortTypeField === 'totalPredicted' && (
							<ColorRange startColor={TotalTileColor.level1} endColor={TotalTileColor.level5} />
						)}
						{sortTypeField === 'droughtPredicted' && (
							<ColorRange startColor={DroughtTileColor.level1} endColor={DroughtTileColor.level5} />
						)}
						{sortTypeField === 'floodPredicted' && (
							<ColorRange startColor={FloodTileColor.level1} endColor={FloodTileColor.level5} />
						)}
					</Box>
					<MapView />
				</div>
			)}
			{(areaDetail === 'area-statistic' || !isDesktop) && (
				<TableDetail
					areaStatisticData={areaStatisticData?.data}
					areaStatisticDataTotal={areaStatisticData?.dataTotal}
					sortType={sortType}
					sortTypeField={sortTypeField}
					setSortType={setSortType}
					setSortTypeField={setSortTypeField}
				/>
			)}
			{(areaDetail === 'time-statistic' || !isDesktop) && (
				<ChartDetail
					timeStatisticData={timeStatisticData?.data}
					timeStatisticDataTotal={timeStatisticData?.dataTotal}
					sortTypeField={sortTypeField}
				/>
			)}
		</Paper>
	)
}

export default FieldLossDetail
