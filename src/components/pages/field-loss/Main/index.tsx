'use client'

import { Paper } from '@mui/material'
import SearchForm from './SearchForm'
import FieldLossSummary from './Summary'
import { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import FieldLossDetail from './Detail'
import { LossType } from '@/enum'
import RangePickerPage from '@/components/shared/DateRangePicker/RangePickerPage'
import useResponsive from '@/hook/responsive'
import useRangePicker from '@/components/shared/DateRangePicker/context'

interface OptionType {
	name: string
	id: string
	searchType: string
}

export const FieldLossMain = () => {
	const [selectedOption, setSeletedOption] = useState<OptionType | null>(null)
	const [startDate, setStartDate] = useState<Dayjs | null>(dayjs(new Date()))
	const [endDate, setEndDate] = useState<Dayjs | null>(dayjs(new Date().setDate(new Date().getDate() + 15)))
	const [lossType, setLossType] = useState<LossType | null>(null)
	const { isDesktop } = useResponsive()
	const { open } = useRangePicker()

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
			<Paper className='mb-4 flex h-full overflow-hidden rounded-none px-4 max-lg:flex-col max-lg:gap-3 max-lg:bg-gray-light lg:mx-4 lg:rounded-lg lg:px-0'>
				{open && !isDesktop ? (
					<RangePickerPage className='lg:hidden' />
				) : (
					<>
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
					</>
				)}
			</Paper>
		</div>
	)
}
