'use client'
import { Button } from '@mui/material'
import * as React from 'react'
import dayjs, { Dayjs } from 'dayjs'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'

export default function PlaygroundPage() {
	const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-07'))

	return (
		<main>
			<LocalizationProvider
				dateAdapter={AdapterDayjs}
				localeText={{
					calendarWeekNumberHeaderText: '#',
					calendarWeekNumberText: (weekNumber) => `${weekNumber}.`,
				}}
			>
				<DateCalendar />
			</LocalizationProvider>
			<Button variant='contained'>Contained</Button>
			<Button variant='outlined'>Outlined</Button>

			<div className='text-2xs'>โครงการพัฒนาระบบเทคโนโลยี เพื่องานประกันภัยข้าวนาปี</div>
			<div className='text-xs'>โครงการพัฒนาระบบเทคโนโลยี เพื่องานประกันภัยข้าวนาปี</div>
			<div className='text-sm'>โครงการพัฒนาระบบเทคโนโลยี เพื่องานประกันภัยข้าวนาปี</div>
			<div className='text-base'>โครงการพัฒนาระบบเทคโนโลยี เพื่องานประกันภัยข้าวนาปี</div>
			<div className='text-lg'>โครงการพัฒนาระบบเทคโนโลยี เพื่องานประกันภัยข้าวนาปี</div>
			<div className='text-xl'>โครงการพัฒนาระบบเทคโนโลยี เพื่องานประกันภัยข้าวนาปี</div>
			<div className='text-2xl'>โครงการพัฒนาระบบเทคโนโลยี เพื่องานประกันภัยข้าวนาปี</div>
		</main>
	)
}
