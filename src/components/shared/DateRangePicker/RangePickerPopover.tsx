import FormInput from '@/components/common/input/FormInput'
import { formatDate } from '@/utils/date'
import { Button, Popover } from '@mui/material'
import classNames from 'classnames'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
import RangeCalendar, { DateRangeTypes } from './RangeCalendar'
import useRangePicker from './context'

interface RangePickerPopoverProps {
	anchorEl: HTMLButtonElement | null
	setAnchorEl: Dispatch<SetStateAction<HTMLButtonElement | null>>
	onChange: (ranges: DateRangeTypes) => void
	className?: string
}

const RangePickerPopover: React.FC<RangePickerPopoverProps> = ({ anchorEl, setAnchorEl, onChange, className = '' }) => {
	const { i18n } = useTranslation()
	const { open, setOpen } = useRangePicker()
	const [ranges, setRanges] = useState<DateRangeTypes>()

	const handleClose = () => {
		setAnchorEl(null)
		setOpen(false)
	}

	const handleChangeDateRanges = (values: DateRangeTypes) => {
		console.log('values:', values)
		setRanges(values)
	}

	const onSubmit = () => {
		if (ranges) onChange?.(ranges)
		setOpen(false)
	}

	const onReset = () => {
		setRanges({ startDate: undefined, endDate: undefined })
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
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			className={classNames(
				'mt-1 [&_.MuiPaper-elevation]:border [&_.MuiPaper-elevation]:border-solid [&_.MuiPaper-elevation]:border-gray',
				className,
			)}
		>
			<div className='flex'>
				<RangeCalendar dateRange={ranges} onChange={handleChangeDateRanges} className='px-6 py-4' />
				<div className='w-[172px] border-0 border-l border-solid border-gray px-6 py-4'>
					<FormInput
						name='startDate'
						label='วันที่เริ่มต้น'
						value={
							ranges?.startDate ? formatDate(ranges.startDate, 'd MMM yyyy', i18n.language) : undefined
						}
						className='[&_#startDate-label]:!text-sm [&_#startDate-label]:!font-medium'
					/>
					<FormInput
						name='endDate'
						label='วันที่สิ้นสุด'
						value={ranges?.endDate ? formatDate(ranges.endDate, 'd MMM yyyy', i18n.language) : undefined}
						className='mt-4 [&_#endDate-label]:!text-sm [&_#endDate-label]:!font-medium'
					/>
					<div className='mt-4 flex justify-center gap-2'>
						<Button variant='outlined' onClick={onReset}>
							รีเซ็ท
						</Button>
						<Button variant='contained' onClick={onSubmit}>
							ใช้งาน
						</Button>
					</div>
				</div>
			</div>
		</Popover>
	)
}

export default RangePickerPopover
