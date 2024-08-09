'use client'

import useSearchFieldLoss from '@/components/pages/field-loss/Main/context'
import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import RangeCalendar, { DateRangeTypes } from './RangeCalendar'
import useRangePicker from './context'

interface RangePickerPageProps {}

const RangePickerPage: React.FC<RangePickerPageProps> = () => {
	const { open, setOpen, resetDateRanges } = useRangePicker()
	const { queryParams, setQueryParams } = useSearchFieldLoss()
	const [ranges, setRanges] = useState<DateRangeTypes>()

	useEffect(() => {
		if (open && queryParams?.startDate && queryParams?.endDate) {
			setRanges({ startDate: queryParams.startDate, endDate: queryParams.endDate })
		}
	}, [queryParams, open])

	const onSubmit = () => {
		if (ranges?.startDate && ranges?.endDate) {
			setQueryParams({ ...queryParams, startDate: ranges.startDate, endDate: ranges.endDate })
		}
		setOpen(false)
	}

	const onReset = () => {
		setRanges(resetDateRanges)
	}

	const handleChangeDateRanges = (values: DateRangeTypes) => {
		setRanges(values)
	}

	return (
		<div className='flex flex-grow flex-col pt-6 lg:hidden'>
			<div className='flex flex-grow'>
				<RangeCalendar dateRange={ranges} onChange={handleChangeDateRanges} />
			</div>
			<div className='mb-6 grid grid-cols-2 gap-2'>
				<Button variant='outlined' className='ml-auto w-full max-w-[200px]' onClick={onReset}>
					รีเซ็ท
				</Button>
				<Button variant='contained' className='w-full max-w-[200px]' onClick={onSubmit}>
					ใช้งาน
				</Button>
			</div>
		</div>
	)
}

export default RangePickerPage
