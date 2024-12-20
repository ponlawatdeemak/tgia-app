import FormInput from '@/components/common/input/FormInput'
import useSearchFieldLoss from '@/components/pages/field-loss/Main/context'
import { formatDate } from '@/utils/date'
import { Button, Popover } from '@mui/material'
import classNames from 'classnames'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import RangeCalendar, { DateRangeTypes } from './RangeCalendar'
import useRangePicker from './context'

interface RangePickerPopoverProps {
	anchorEl: HTMLButtonElement | null
	setAnchorEl: Dispatch<SetStateAction<HTMLButtonElement | null>>
	className?: string
}

const RangePickerPopover: React.FC<RangePickerPopoverProps> = ({ anchorEl, setAnchorEl, className = '' }) => {
	const { t, i18n } = useTranslation(['field-loss', 'default'])
	const { open, setOpen, resetDateRanges } = useRangePicker()
	const { queryParams, setQueryParams } = useSearchFieldLoss()
	const [ranges, setRanges] = useState<DateRangeTypes>()

	useEffect(() => {
		if (open && queryParams?.startDate && queryParams?.endDate) {
			setRanges({ startDate: queryParams.startDate, endDate: queryParams.endDate })
		}
	}, [queryParams, open])

	const handleClose = () => {
		setAnchorEl(null)
		setOpen(false)
	}

	const handleChangeDateRanges = (values: DateRangeTypes) => {
		setRanges(values)
	}

	const onSubmit = () => {
		if (ranges?.startDate && ranges?.endDate) {
			setQueryParams({ ...queryParams, startDate: ranges.startDate, endDate: ranges.endDate })
		}
		setOpen(false)
	}

	const onReset = () => {
		setRanges(resetDateRanges)
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
				<div className='w-[500px]'>
					<RangeCalendar dateRange={ranges} onChange={handleChangeDateRanges} className='px-6 py-4' />
				</div>
				<div className='w-[172px] border-0 border-l border-solid border-gray px-6 py-4'>
					<FormInput
						name='startDate'
						label={t('startDate')}
						value={
							ranges?.startDate ? formatDate(ranges.startDate, 'd MMM yyyy', i18n.language) : undefined
						}
						className='[&_#startDate-label]:!text-sm [&_#startDate-label]:!font-medium [&_.MuiOutlinedInput-root]:rounded-lg'
					/>
					<FormInput
						name='endDate'
						label={t('endDate')}
						value={ranges?.endDate ? formatDate(ranges.endDate, 'd MMM yyyy', i18n.language) : undefined}
						className='mt-4 [&_#endDate-label]:!text-sm [&_#endDate-label]:!font-medium [&_.MuiOutlinedInput-root]:rounded-lg'
					/>
					<div className='mt-4 flex justify-start gap-2'>
						<Button
							variant='outlined'
							className='border border-solid border-gray text-black'
							onClick={onReset}
						>
							{t('reset')}
						</Button>
						<Button variant='contained' onClick={onSubmit}>
							{t('use')}
						</Button>
					</div>
					<div className='mt-4 flex flex-col'>
						<div className='flex flex-row items-center gap-1 px-2 py-0.5'>
							<span className='h-2.5 w-2.5 rounded-sm bg-lossType-drought'></span>
							<span className='text-base font-medium text-black'>{t('drought', { ns: 'default' })}</span>
						</div>
						<div className='flex flex-row items-center gap-1 px-2 py-0.5'>
							<span className='h-2.5 w-2.5 rounded-sm bg-lossType-flood'></span>
							<span className='text-base font-medium text-black'>{t('flood', { ns: 'default' })}</span>
						</div>
					</div>
				</div>
			</div>
		</Popover>
	)
}

export default RangePickerPopover
