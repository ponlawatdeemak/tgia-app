'use client'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import '@/styles/calendar.css'

import service from '@/api'
import useSearchFieldLoss from '@/components/pages/field-loss/Main/context'
import { Language } from '@/enum'
import useAreaType from '@/store/area-type'
import { formatDate } from '@/utils/date'
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'
import Icon from '@mdi/react'
import { IconButton, Typography } from '@mui/material'
import classNames from 'classnames'
import { addDays, endOfMonth, format, startOfMonth } from 'date-fns'
import { enUS, th } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { DateRange, Range, RangeKeyDict } from 'react-date-range'
import { useTranslation } from 'react-i18next'
import useRangePicker from './context'
import { useQuery } from '@tanstack/react-query'

export type DateRangeTypes = {
	startDate: Date
	endDate: Date
}

export interface RangeCalendarProps {
	dateRange?: DateRangeTypes
	onChange?: (dateRange: DateRangeTypes) => void
	className?: string
}

const RangeCalendar: React.FC<RangeCalendarProps> = ({
	dateRange = { startDate: new Date(), endDate: new Date() },
	onChange,
	className,
}) => {
	const { i18n } = useTranslation()
	const { open } = useRangePicker()
	const { queryParams, setQueryParams } = useSearchFieldLoss()
	const { areaType } = useAreaType()
	const [ranges, setRanges] = useState<Range[]>([{ ...dateRange, key: 'selection' }])
	const [filter, setFilter] = useState<any>({
		startDate: queryParams.startDate ? format(addDays(startOfMonth(new Date()), -7), 'yyyy-MM-dd') : '',
		endDate: queryParams.endDate ? format(addDays(endOfMonth(new Date()), 7), 'yyyy-MM-dd') : '',
		registrationAreaType: areaType,
		provinceId: queryParams.provinceId,
		districtId: queryParams.districtId,
	})

	const { data, isLoading } = useQuery({
		queryKey: ['calendar', filter],
		queryFn: () => service.calendar.getCalendar(filter),
		enabled: open,
	})
	console.log('TLOG ~ data:', data)

	useEffect(() => {
		setRanges([{ ...dateRange, key: 'selection' }])
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
			provinceId: queryParams.provinceId,
			districtId: queryParams.districtId,
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

	return (
		<DateRange
			locale={i18n.language === Language.EN ? enUS : th}
			ranges={ranges}
			onChange={handleChange}
			onShownDateChange={handleMonthChange}
			navigatorRenderer={renderCalendarNavigator}
			showMonthAndYearPickers={false}
			moveRangeOnFirstSelection={false}
			// disabledDates={[]}
			className={classNames('h-fit w-full min-w-[288px]', className)}
		/>
	)
}

export default RangeCalendar
