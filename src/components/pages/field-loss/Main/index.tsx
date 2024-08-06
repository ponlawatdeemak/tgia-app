'use client'

import MapView from '@/components/common/map/MapView'
import RangePickerPage from '@/components/shared/DateRangePicker/RangePickerPage'
import useRangePicker from '@/components/shared/DateRangePicker/context'
import { Paper } from '@mui/material'
import SearchForm from './SearchForm'
import useResponsive from '@/hook/responsive'

export const FieldLossMain = () => {
	const { isDesktop } = useResponsive()
	const { open } = useRangePicker()
	return (
		<div className='flex flex-grow flex-col gap-y-[16px]'>
			<SearchForm />
			<Paper className='flex h-full overflow-hidden rounded-none px-4 lg:mx-4 lg:mb-4 lg:rounded-lg lg:px-0'>
				{open && !isDesktop ? (
					<RangePickerPage className='lg:hidden' />
				) : (
					<>
						{/* <FieldLossSummary /> */}
						<div className='flex w-full'>
							<MapView />
						</div>
					</>
				)}
			</Paper>
		</div>
	)
}
