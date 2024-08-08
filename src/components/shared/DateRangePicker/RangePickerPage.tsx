'use client'

import classNames from 'classnames'
import React from 'react'
import RangeCalendar from './RangeCalendar'
import useRangePicker from './context'

interface RangePickerPageProps {
	className?: string
}

const RangePickerPage: React.FC<RangePickerPageProps> = ({ className = '' }) => {
	const { open } = useRangePicker()

	if (!open) return null

	return (
		<div className={classNames('pt-6', className)}>
			<RangeCalendar />
		</div>
	)
}

export default RangePickerPage
