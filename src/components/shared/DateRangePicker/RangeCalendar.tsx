'use client'

import { Language } from '@/enum'
import classNames from 'classnames'
import { enUS, th } from 'date-fns/locale'
import { useState } from 'react'
import { Calendar, DateRange, Range, RangeKeyDict } from 'react-date-range'
import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file
import '@/styles/calendar.css' // theme css file
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import { formatDate } from '@/utils/date'
import { IconButton, Typography } from '@mui/material'
import Icon from '@mdi/react'
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'

export type DateRangeTypes = {
	startDate: Date | undefined
	endDate: Date | undefined
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
	const [ranges, setRanges] = useState<Range[]>([{ ...dateRange, key: 'selection' }])

	const handleChange = (values: RangeKeyDict) => {
		setRanges([values.selection])
		onChange?.({ startDate: values.selection?.startDate, endDate: values.selection?.endDate })
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
				<IconButton onClick={() => changeShownDate(-1, 'monthOffset')}>
					<Icon path={mdiChevronLeft} size={1} />
				</IconButton>
				<Typography className='text-base font-semibold'>
					{formatDate(focusedDate, 'MMMM yyyy', i18n.language)}
				</Typography>
				<IconButton onClick={() => changeShownDate(+1, 'monthOffset')}>
					<Icon path={mdiChevronRight} size={1} />
				</IconButton>
			</div>
		)
	}

	return (
		<div>
			<DateRange
				locale={i18n.language === Language.EN ? enUS : th}
				ranges={ranges}
				onChange={handleChange}
				navigatorRenderer={renderCalendarNavigator}
				showMonthAndYearPickers={false}
				moveRangeOnFirstSelection={false}
				// disabledDates={[]}
				className={classNames('h-fit w-[500px]', className)}
			/>
		</div>
	)
}

export default RangeCalendar
