import { Popover } from '@mui/material'
import classNames from 'classnames'
import React, { Dispatch, SetStateAction } from 'react'
import RangeCalendar from './RangeCalendar'
import useRangePicker from './context'

interface RangePickerPopoverProps {
	anchorEl: HTMLButtonElement | null
	setAnchorEl: Dispatch<SetStateAction<HTMLButtonElement | null>>
	onChange: () => void
	className?: string
}

const RangePickerPopover: React.FC<RangePickerPopoverProps> = ({ anchorEl, setAnchorEl, onChange, className = '' }) => {
	const { open, setOpen } = useRangePicker()

	const handleClose = () => {
		setAnchorEl(null)
		setOpen(false)
		console.log('Open:', false)
	}

	return (
		<Popover
			id='date-range-picker-popover'
			open={open}
			anchorEl={anchorEl}
			onClose={handleClose}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			className={classNames(
				'mt-1 [&_.MuiPaper-elevation]:border [&_.MuiPaper-elevation]:border-solid [&_.MuiPaper-elevation]:border-gray',
				className,
			)}
		>
			<div>
				<RangeCalendar />
			</div>
		</Popover>
	)
}

export default RangePickerPopover
