'use client'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import '@/styles/calendar.css'

import service from '@/api'
import useSearchFieldLoss from '@/components/pages/field-loss/Main/context'
import { AreaTypeKey, AreaUnitKey, Language } from '@/enum'
import useAreaType from '@/store/area-type'
import useAreaUnit from '@/store/area-unit'
import { formatDate } from '@/utils/date'
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'
import Icon from '@mdi/react'
import { IconButton, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { addDays, endOfMonth, format, isWithinInterval, startOfMonth } from 'date-fns'
import { enUS, th } from 'date-fns/locale'
import { useEffect, useMemo, useState } from 'react'
import { DateRange, Range, RangeKeyDict } from 'react-date-range'
import { useTranslation } from 'react-i18next'
import useRangePicker from './context'
import { GetCalendarDtoOut, LossPredictedType } from '@/api/calendar/dto-out.dto'
import humanFormat from 'human-format'

export type DateRangeTypes = {
	startDate: Date
	endDate: Date
}

export interface RangeCalendarProps {
	dateRange?: DateRangeTypes
	onChange?: (dateRange: DateRangeTypes) => void
	className?: string
}

interface FilterType {
	startDate: string
	endDate: string
	registrationAreaType: AreaTypeKey
	provinceCode: number | undefined
	districtCode: number | undefined
}

interface MappedDataType {
	[key: string]: {
		[LossType.Drought]?: LossPredictedType
		[LossType.Flood]?: LossPredictedType
		[LossType.NoData]?: boolean
	}
}

enum LossType {
	Drought = 'drought',
	Flood = 'flood',
	NoData = 'noData',
}

const RangeCalendar: React.FC<RangeCalendarProps> = ({ dateRange = undefined, onChange, className }) => {
	const { i18n } = useTranslation()
	const { open } = useRangePicker()
	const { queryParams } = useSearchFieldLoss()
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const [ranges, setRanges] = useState<Range[]>([{ ...dateRange, key: 'selection' }])
	const [filter, setFilter] = useState<FilterType>({
		startDate: queryParams.startDate ? format(addDays(startOfMonth(new Date()), -7), 'yyyy-MM-dd') : '',
		endDate: queryParams.endDate ? format(addDays(endOfMonth(new Date()), 7), 'yyyy-MM-dd') : '',
		registrationAreaType: areaType,
		provinceCode: queryParams.provinceCode,
		districtCode: queryParams.districtCode,
	})

	const { data } = useQuery({
		queryKey: ['calendar', filter],
		queryFn: () => service.calendar.getCalendar(filter),
		enabled: open,
	})

	const mappedData = useMemo(() => {
		const mappedData: MappedDataType = {}
		data?.data?.forEach((item: GetCalendarDtoOut) => {
			if (!mappedData[item.dateTime]) {
				mappedData[item.dateTime] = {}
			}
			const lossType = item.lossType as LossType
			if (lossType === LossType.NoData) {
				mappedData[item.dateTime][lossType] = true
			} else {
				mappedData[item.dateTime][lossType] = item.lossPredicted
			}
		})
		return mappedData
	}, [data])

	useEffect(() => {
		if (dateRange) {
			setRanges([{ ...dateRange, key: 'selection' }])
		}
	}, [dateRange])

	const handleChange = async (values: RangeKeyDict) => {
		setRanges([values.selection])
		if (values.selection?.startDate && values.selection?.endDate) {
			onChange?.({ startDate: values.selection.startDate, endDate: values.selection.endDate })
		}
	}

	const handleMonthChange = (date: Date) => {
		setFilter({
			startDate: format(addDays(startOfMonth(date), -7), 'yyyy-MM-dd'),
			endDate: format(addDays(endOfMonth(date), 7), 'yyyy-MM-dd'),
			registrationAreaType: areaType,
			provinceCode: queryParams.provinceCode,
			districtCode: queryParams.districtCode,
		})
	}

	const renderCalendarNavigator = (
		focusedDate: Date,
		changeShownDate: (
			value: string | number | Date,
			mode?: 'set' | 'monthOffset' | 'setYear' | 'setMonth' | undefined,
		) => void,
	) => {
		return (
			<div className='flex items-center justify-between' onMouseUp={(e) => e.stopPropagation()}>
				<IconButton className='pl-0' onClick={() => changeShownDate(-1, 'monthOffset')}>
					<Icon path={mdiChevronLeft} size={1} />
				</IconButton>
				<Typography className='text-base font-semibold'>
					{formatDate(focusedDate, 'MMMM yyyy', i18n.language)}
				</Typography>
				<IconButton className='pr-0' onClick={() => changeShownDate(+1, 'monthOffset')}>
					<Icon path={mdiChevronRight} size={1} />
				</IconButton>
			</div>
		)
	}

	const renderCalendarDay = (date: Date) => {
		const data = mappedData[format(date, 'yyyy-MM-dd')]
		const drought = data?.[LossType.Drought]
		const flood = data?.[LossType.Flood]
		const noData = data?.[LossType.NoData] || false
		const droughtValue =
			areaUnit === AreaUnitKey.LandPlot ? drought?.[AreaUnitKey.LandPlot] : drought?.[AreaUnitKey.Rai]
		const floodValue = areaUnit === AreaUnitKey.LandPlot ? flood?.[AreaUnitKey.LandPlot] : flood?.[AreaUnitKey.Rai]
		const [{ startDate, endDate }] = ranges
		let isInRange = true
		if (startDate && endDate) {
			isInRange = isWithinInterval(date, {
				start: startDate,
				end: endDate,
			})
		}

		return (
			<div className={classNames('!h-full w-full', { 'bg-[#F5F5F5]': noData && !isInRange })}>
				<div
					className={classNames('absolute left-0 right-0 top-0 mt-3 text-base text-inherit', {
						'!text-[#959595]': noData,
					})}
				>
					{date.getDate()}
				</div>
				<div className='mt-10 flex flex-col items-center'>
					{droughtValue && (
						<div className='flex items-center gap-1'>
							<div className='size-1.5 rounded-full bg-[#E34A33]' />
							<div className='text-xs !text-secondary'>
								{humanFormat(droughtValue, {
									maxDecimals: 2,
								}).replace(' ', '')}
							</div>
						</div>
					)}
					{floodValue && (
						<div className='flex items-center gap-1'>
							<div className='size-1.5 rounded-full bg-[#3182BD]' />
							<div className='text-xs !text-secondary'>
								{humanFormat(floodValue, {
									maxDecimals: 2,
								}).replace(' ', '')}
							</div>
						</div>
					)}
					{noData && <div className='text-xs !text-[#959595]'>ไม่มีข้อมูล</div>}
				</div>
			</div>
		)
	}

	return (
		<DateRange
			locale={i18n.language === Language.EN ? enUS : th}
			ranges={ranges}
			onChange={handleChange}
			onShownDateChange={handleMonthChange}
			navigatorRenderer={renderCalendarNavigator}
			showMonthAndYearPickers={false}
			moveRangeOnFirstSelection={false}
			dayContentRenderer={renderCalendarDay}
			className={classNames('h-fit w-full min-w-[288px]', className)}
		/>
	)
}

export default RangeCalendar
