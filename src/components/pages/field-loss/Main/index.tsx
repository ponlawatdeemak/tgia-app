'use client'

import '@/components/common/map/inject'
import { Paper } from '@mui/material'
import SearchForm from './SearchForm'
import FieldLossSummary from './Summary'
import { useEffect, useRef } from 'react'
import FieldLossDetail from './Detail'
import RangePickerPage from '@/components/shared/DateRangePicker/RangePickerPage'
import useResponsive from '@/hook/responsive'
import useRangePicker from '@/components/shared/DateRangePicker/context'
import useSearchFieldLoss from './context'
import { addDays } from 'date-fns'
import { MapViewRef } from '@/components/common/map/MapView'

export const FieldLossMain = () => {
	const { isDesktop } = useResponsive()
	const { open } = useRangePicker()
	const { setQueryParams } = useSearchFieldLoss()

	const mapViewRef = useRef<MapViewRef>(null)

	useEffect(() => {
		setQueryParams({ startDate: new Date(), endDate: addDays(new Date(), 15) })
	}, [setQueryParams])

	return (
		<div className='flex flex-grow flex-col gap-4 overflow-auto'>
			<SearchForm mapViewRef={mapViewRef} />
			<Paper className='flex h-full overflow-hidden rounded-none lg:mx-4 lg:mb-4 lg:h-[calc(100vh-154px)] lg:rounded-lg'>
				{open && !isDesktop ? (
					<div className='flex flex-grow bg-white px-4 lg:hidden lg:px-0'>
						<RangePickerPage />
					</div>
				) : (
					<div className='box-border flex w-full overflow-auto px-4 max-lg:flex-col max-lg:gap-3 max-lg:bg-gray-light max-lg:pb-4 lg:px-0'>
						<FieldLossSummary />
						<FieldLossDetail mapViewRef={mapViewRef} />
					</div>
				)}
			</Paper>
		</div>
	)
}
