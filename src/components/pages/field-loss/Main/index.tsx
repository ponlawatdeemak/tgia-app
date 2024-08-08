'use client'

import RangePickerPage from '@/components/shared/DateRangePicker/RangePickerPage'
import useRangePicker from '@/components/shared/DateRangePicker/context'
import { LossType } from '@/enum'
import useResponsive from '@/hook/responsive'
import { Paper } from '@mui/material'
import { addDays } from 'date-fns'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import FieldLossDetail from './FieldLossDetail'
import SearchForm from './SearchForm'
import useSearchFieldLoss from './context'

interface OptionType {
	name: string
	id: string
	searchType: string
}

export const FieldLossMain = () => {
	const { isDesktop } = useResponsive()
	const { open } = useRangePicker()
	const { queryParams, setQueryParams } = useSearchFieldLoss()
	const [selectedOption, setSeletedOption] = useState<OptionType | null>(null)
	const [startDate, setStartDate] = useState<Dayjs | null>(dayjs(new Date()))
	const [endDate, setEndDate] = useState<Dayjs | null>(dayjs(new Date().setDate(new Date().getDate() + 15)))
	const [lossType, setLossType] = useState<LossType | null>(null)

	useEffect(() => {
		setQueryParams({ startDate: new Date(), endDate: addDays(new Date(), 15) })
	}, [setQueryParams])

	return (
		<div className='flex flex-grow flex-col gap-y-[16px]'>
			<SearchForm
				selectedOption={selectedOption}
				startDate={startDate}
				endDate={endDate}
				setSeletedOption={setSeletedOption}
				setStartDate={setStartDate}
				setEndDate={setEndDate}
			/>
			<Paper className='flex h-full overflow-hidden rounded-none px-4 lg:mx-4 lg:mb-4 lg:rounded-lg lg:px-0'>
				{open && !isDesktop ? (
					<RangePickerPage className='flex flex-grow lg:hidden' />
				) : (
					<>
						{/* <FieldLossSummary
							selectedOption={selectedOption}
							startDate={startDate}
							endDate={endDate}
							lossType={lossType}
							setLossType={setLossType}
						/> */}
						<FieldLossDetail
							selectedOption={selectedOption}
							startDate={startDate}
							endDate={endDate}
							lossType={lossType}
						/>
					</>
				)}
			</Paper>
		</div>
	)
}
