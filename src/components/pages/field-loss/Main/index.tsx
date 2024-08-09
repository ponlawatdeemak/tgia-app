'use client'

import { Paper } from '@mui/material'
import SearchForm from './SearchForm'
import FieldLossSummary from './Summary'
import { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import FieldLossDetail from './Detail'
import { LossType } from '@/enum'
import RangePickerPage from '@/components/shared/DateRangePicker/RangePickerPage'
import useResponsive from '@/hook/responsive'
import useRangePicker from '@/components/shared/DateRangePicker/context'
import useSearchFieldLoss from './context'
import { addDays } from 'date-fns'

interface OptionType {
	name: string
	id: string
	searchType: string
}

export const FieldLossMain = () => {
	const { isDesktop } = useResponsive()
	const { open } = useRangePicker()
	const { setQueryParams } = useSearchFieldLoss()
	const [selectedOption, setSeletedOption] = useState<OptionType | null>(null)
	const [startDate, setStartDate] = useState<Dayjs | null>(dayjs(new Date()))
	const [endDate, setEndDate] = useState<Dayjs | null>(dayjs(new Date().setDate(new Date().getDate() + 15)))
	const [lossType, setLossType] = useState<LossType | null>(null)

	useEffect(() => {
		setQueryParams({ startDate: new Date(), endDate: addDays(new Date(), 15) })
	}, [setQueryParams])

	return (
		<div className='flex flex-grow flex-col gap-4'>
			<SearchForm
				selectedOption={selectedOption}
				startDate={startDate}
				endDate={endDate}
				setSeletedOption={setSeletedOption}
				setStartDate={setStartDate}
				setEndDate={setEndDate}
			/>
			<Paper className='mb-4 flex h-full overflow-hidden rounded-none lg:mx-4 lg:rounded-lg'>
				{open && !isDesktop ? (
					<div className='flex flex-grow bg-white px-4 lg:hidden lg:px-0'>
						<RangePickerPage />
					</div>
				) : (
					<div className='flex w-full px-4 max-lg:flex-col max-lg:gap-3 max-lg:bg-gray-light lg:px-0'>
						<FieldLossSummary
							selectedOption={selectedOption}
							startDate={startDate}
							endDate={endDate}
							lossType={lossType}
							setLossType={setLossType}
						/>
						<FieldLossDetail
							selectedOption={selectedOption}
							startDate={startDate}
							endDate={endDate}
							lossType={lossType}
						/>
					</div>
				)}
			</Paper>
		</div>
	)
}
