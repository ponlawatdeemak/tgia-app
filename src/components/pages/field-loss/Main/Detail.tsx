'use client'

import React, { useCallback, useEffect, useState } from 'react'
import MapView from '@/components/common/map/MapView'
import { Paper, ToggleButton, ToggleButtonGroup } from '@mui/material'
import TableDetail from '../Detail/TableDetail'
import ChartDetail from '../Detail/ChartDetail'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'
import useAreaType from '@/store/area-type'
import { Dayjs } from 'dayjs'
import { LossType, SortType } from '@/enum'
import { time } from 'console'
import { ResponseArea } from '@/api/interface'
import clsx from 'clsx'
import useResponsive from '@/hook/responsive'

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

// enum SortFieldType {
// 	1 =
// }

const FieldLossDetail: React.FC<FieldLossDetailProps> = ({ selectedOption, startDate, endDate, lossType }) => {
	const { isDesktop } = useResponsive()
	const { areaType } = useAreaType()
	const [areaDetail, setAreaDetail] = useState('summary-area')
	const [sortType, setSortType] = useState<SortType>(SortType.DESC)
	const [sortTypeField, setSortTypeField] = useState<keyof Data>('totalPredicted')

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

	//console.log('lossType', lossType)

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

	// console.log('summaryAreaData', summaryAreaData)
	// console.log('areaStatisticData', areaStatisticData)
	// console.log('timeStatisticData', timeStatisticData)

	const handleAreaDetailChange = useCallback((_event: React.MouseEvent<HTMLElement>, newAreaDetail: string) => {
		setAreaDetail((prev) => newAreaDetail || prev)
	}, [])

	return (
		<Paper className='relative max-lg:flex max-lg:flex-col max-lg:gap-3 max-lg:bg-gray-light lg:block lg:flex-grow'>
			<ToggleButtonGroup
				size='small'
				exclusive
				color='primary'
				className='bg-gray-light3 absolute right-3 top-3 z-10 flex gap-2 rounded-lg p-1 max-lg:hidden [&_*]:px-3 [&_*]:py-1.5'
				value={areaDetail}
				onChange={handleAreaDetailChange}
			>
				<ToggleButton
					className={clsx('border border-solid text-base', {
						'border-primary bg-white font-semibold text-primary': areaDetail === 'summary-area',
						'text-gray-dark2 border-transparent font-medium': areaDetail !== 'summary-area',
					})}
					value={'summary-area'}
				>
					ตามแผนที่
				</ToggleButton>
				<ToggleButton
					className={clsx('border border-solid text-base', {
						'border-primary bg-white font-semibold text-primary': areaDetail === 'area-statistic',
						'text-gray-dark2 border-transparent font-medium': areaDetail !== 'area-statistic',
					})}
					value={'area-statistic'}
				>
					ตามอันดับ
				</ToggleButton>
				<ToggleButton
					className={clsx('border border-solid text-base', {
						'border-primary bg-white font-semibold text-primary': areaDetail === 'time-statistic',
						'text-gray-dark2 border-transparent font-medium': areaDetail !== 'time-statistic',
					})}
					value={'time-statistic'}
				>
					ตามช่วงเวลา
				</ToggleButton>
			</ToggleButtonGroup>
			{(areaDetail === 'summary-area' || !isDesktop) && (
				<div className='h-[390px] w-full max-lg:overflow-hidden max-lg:rounded lg:h-full'>
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
