'use client'
import { Button } from '@mui/material'
import * as React from 'react'
import dayjs, { Dayjs } from 'dayjs'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { Language } from '@/enum'

import service from '@/api'
import StackedProgressBar from '@/components/common/progress-bar/StackedProgressBar'
import { LossTypeColor } from '@/config/color'

export default function PlaygroundPage() {
	const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-07'))

	const text = `text-2xl text-[${LossTypeColor.drought}]`

	const textFlood = `text-2xl text-[${LossTypeColor.flood}]`

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

			<div>
				<div className='w-3/6'>
					<StackedProgressBar
						data={[
							{
								label: 'drought',
								percent: 20,
								color: '#E34A33',
							},
							{
								label: 'flood',
								percent: 30,
								color: '#3182BD',
							},
						]}
					></StackedProgressBar>
				</div>

				<div className='w-3/6'> sss </div>
			</div>

			<Button
				onClick={async () => {
					const adminPoly = await service.fieldLoss.getSearchAdminPoly({ keyword: 'บาง' })
					// .then((res) => {
					// 	console.log('res ', res)
					// })
					// .catch((error) => {
					// 	console.log('error ', error)
					// })
				}}
			>
				Test Search
			</Button>
			<br />
			<Button variant='contained'>Contained</Button>
			<Button variant='outlined'>Outlined</Button>

			<div className={text}>โครงการพัฒนาระบบเทคโนโลยี เพื่องานประกันภัยข้าวนาปี test </div>
			<div className='text-xs text-[#E34A33]'>โครงการพัฒนาระบบเทคโนโลยี เพื่องานประกันภัยข้าวนาปี</div>
			<div className='text-sm text-lossType-drought'>โครงการพัฒนาระบบเทคโนโลยี เพื่องานประกันภัยข้าวนาปี</div>
			<div className='text-base text-lossType-flood'>โครงการพัฒนาระบบเทคโนโลยี เพื่องานประกันภัยข้าวนาปี</div>
			<div className='text-lg text-lossType'>โครงการพัฒนาระบบเทคโนโลยี เพื่องานประกันภัยข้าวนาปี</div>
			<div className='text-xl text-[#3182BD]'>โครงการพัฒนาระบบเทคโนโลยี เพื่องานประกันภัยข้าวนาปี</div>
			<div className={textFlood}>โครงการพัฒนาระบบเทคโนโลยี เพื่องานประกันภัยข้าวนาปี Flood</div>

			<div>NEXT_PUBLIC_API_URL_DISASTER {process.env.NEXT_PUBLIC_API_URL_DISASTER}</div>

			<div>API_URL_DISASTER {process.env.API_URL_DISASTER}</div>

			<div>NEXT_PUBLIC_DISASTER {process.env.NEXT_PUBLIC_DISASTER}</div>

			<div>DISASTER {process.env.DISASTER}</div>
		</main>
	)
}
