'use client'

import useSearchFieldLoss from '@/components/pages/field-loss/Main/context'
import useResponsive from '@/hook/responsive'
import { formatDate } from '@/utils/date'
import { mdiCalendarMonthOutline } from '@mdi/js'
import Icon from '@mdi/react'
import { Button, IconButton } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import RangePickerPopover from './RangePickerPopover'
import useRangePicker from './context'

interface DateRangePickerProps {}

const DateRangePicker: React.FC<DateRangePickerProps> = () => {
	const { open, setOpen } = useRangePicker()
	const { queryParams } = useSearchFieldLoss()
	const { isDesktop } = useResponsive()
	const { i18n } = useTranslation()
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (isDesktop) {
			setAnchorEl(event.currentTarget)
			setOpen(!!event.currentTarget)
		} else {
			setOpen(!open)
		}
	}

	const formatDateRange =
		queryParams.startDate && queryParams.endDate
			? `${formatDate(queryParams.startDate, 'dd MMM yyyy', i18n.language)} - ${formatDate(queryParams.endDate, 'dd MMM yyyy', i18n.language)}`
			: ''

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
				{formatDateRange}
			</Button>
			<RangePickerPopover anchorEl={anchorEl} setAnchorEl={setAnchorEl} className='hidden lg:flex' />
		</>
	)
}

export default DateRangePicker
