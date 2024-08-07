import React, { useCallback, useState } from 'react'
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

const FieldLossDetail: React.FC<FieldLossDetailProps> = ({ selectedOption, startDate, endDate, lossType }) => {
	const { areaType } = useAreaType()
	const [areaDetail, setAreaDetail] = useState('summary-area')
	const [order, setOrder] = useState<SortType>(SortType.DESC)
	const [orderBy, setOrderBy] = useState<keyof Data>('totalPredicted')

	const { data: summaryAreaData, isLoading: isSummaryAreaDataLoading } = useQuery({
		queryKey: ['getSummaryArea', startDate, endDate, areaType, selectedOption?.id],
		queryFn: () =>
			service.fieldLoss.getSummaryArea({
				startDate: startDate?.toISOString().split('T')[0] || '',
				endDate: endDate?.toISOString().split('T')[0] || '',
				registrationAreaType: areaType,
				provinceId: selectedOption?.id ? parseInt(selectedOption.id) : undefined,
			}),
		enabled: areaDetail === 'summary-area',
	})

	const { data: areaStatisticData, isLoading: isAreaStatisticData } = useQuery({
		queryKey: ['getAreaStatistic', startDate, endDate, lossType, areaType, orderBy, order],
		queryFn: () =>
			service.fieldLoss.getAreaStatistic({
				startDate: startDate?.toISOString().split('T')[0] || '',
				endDate: endDate?.toISOString().split('T')[0] || '',
				lossType: lossType || undefined,
				registrationAreaType: areaType,
				sort: orderBy,
				sortType: order,
			}),
		enabled: areaDetail === 'area-statistic',
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
		enabled: areaDetail === 'time-statistic',
	})

	// console.log('summaryAreaData', summaryAreaData)
	// console.log('areaStatisticData', areaStatisticData)
	// console.log('timeStatisticData', timeStatisticData)

	const handleAreaDetailChange = useCallback((_event: React.MouseEvent<HTMLElement>, newAreaDetail: string) => {
		setAreaDetail((prev) => newAreaDetail || prev)
	}, [])

	return (
		<Paper className='relative block flex-grow'>
			<ToggleButtonGroup
				size='small'
				exclusive
				color='primary'
				className='absolute right-0 top-0 z-10 bg-white'
				value={areaDetail}
				onChange={handleAreaDetailChange}
			>
				<ToggleButton value={'summary-area'}>ตามแผนที่</ToggleButton>
				<ToggleButton value={'area-statistic'}>ตามอันดับ</ToggleButton>
				<ToggleButton value={'time-statistic'}>ตามช่วงเวลา</ToggleButton>
			</ToggleButtonGroup>
			{areaDetail === 'summary-area' && <MapView />}
			{areaDetail === 'area-statistic' && (
				<TableDetail
					areaStatisticData={areaStatisticData?.data}
					areaStatisticDataTotal={areaStatisticData?.dataTotal}
					order={order}
					orderBy={orderBy}
					setOrder={setOrder}
					setOrderBy={setOrderBy}
				/>
			)}
			{areaDetail === 'time-statistic' && <ChartDetail />}
		</Paper>
	)
}

export default FieldLossDetail
