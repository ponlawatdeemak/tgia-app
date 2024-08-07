'use client'

import { Paper } from '@mui/material'
import SearchForm from './SearchForm'
import FieldLossSummary from './Summary'
import { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import FieldLossDetail from './Detail'
import { LossType } from '@/enum'

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
			<Paper className='flex h-full overflow-hidden'>
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
			</Paper>
		</div>
	)
}
