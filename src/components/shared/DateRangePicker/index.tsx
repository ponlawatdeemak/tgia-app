'use client'

import useResponsive from '@/hook/responsive'
import { mdiCalendarMonthOutline } from '@mdi/js'
import Icon from '@mdi/react'
import { Button, IconButton } from '@mui/material'
import { useState } from 'react'
import RangePickerPopover from './RangePickerPopover'
import useRangePicker from './context'

const DateRangePicker = () => {
	const { open, setOpen } = useRangePicker()
	const { isDesktop } = useResponsive()
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (isDesktop) {
			setAnchorEl(event.currentTarget)
			setOpen(!!event.currentTarget)
		} else {
			setOpen(!open)
		}
	}

	const handleDateChange = () => {
		//
	}

	return (
		<>
			{/* Mobile */}
			<IconButton color='secondary' className='btn-shadow lg:hidden' onClick={handleClick}>
				<Icon path={mdiCalendarMonthOutline} size={1} />
			</IconButton>

			{/* Desktop */}
			<Button
				variant='contained'
				color='secondary'
				className='hidden min-w-[280px] lg:flex'
				startIcon={<Icon path={mdiCalendarMonthOutline} size={1} />}
				onClick={handleClick}
			>
				01 เม.ย. 2567 – 15 เม.ย. 2567
			</Button>
			<RangePickerPopover
				anchorEl={anchorEl}
				setAnchorEl={setAnchorEl}
				onChange={handleDateChange}
				className='hidden lg:flex'
			/>
		</>
	)
}

export default DateRangePicker
