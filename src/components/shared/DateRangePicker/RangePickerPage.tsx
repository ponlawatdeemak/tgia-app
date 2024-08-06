'use client'

import React from 'react'
import useRangePicker from './context'
import RangeCalendar from './RangeCalendar'

interface RangePickerPageProps {
	className?: string
}

const RangePickerPage: React.FC<RangePickerPageProps> = ({ className = '' }) => {
	const { open, setOpen } = useRangePicker()

	if (!open) return null

	return (
		<div className={className}>
			<span>RangePickerPage</span>
			<RangeCalendar />
		</div>
	)
}

export default RangePickerPage
