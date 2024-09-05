'use client'

import { Box, FormControl, OutlinedInput, Typography } from '@mui/material'
import React, { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSearchPlotMonitoring from './context'
import classNames from 'classnames'
import FilterButtonMain from '../Filter'

interface PlotMonitoringFilterProps {
	isFullList: boolean
}

const PlotMonitoringFilter: React.FC<PlotMonitoringFilterProps> = ({ isFullList }) => {
	const { queryParams, setQueryParams } = useSearchPlotMonitoring()
	const { t, i18n } = useTranslation(['default', 'field-loss'])

	const [inputActivityId, setInputActivityId] = useState<string>(queryParams.activityId?.toString() || '')
	const activityIdRef = useRef<HTMLInputElement>(null)

	const handleChangeActivityIdInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value
		const numericValue = inputValue.replace(/[^0-9]/g, '')
		setInputActivityId(numericValue)
	}, [])

	const handleSubmitActivityId = useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			setQueryParams({ ...queryParams, activityId: parseInt(inputActivityId) })
			if (activityIdRef.current) {
				activityIdRef.current.blur()
			}
		},
		[inputActivityId, queryParams, setQueryParams],
	)

	return (
		<div
			className={classNames(
				'box-border flex w-[30%] min-w-[360px] max-w-[580px] flex-col gap-0 bg-gray-light2 p-6 max-lg:hidden lg:overflow-auto',
				{
					'lg:hidden': isFullList,
				},
			)}
		>
			<Box className='flex flex-col gap-1'>
				<Typography className='text-sm font-medium text-black'>รหัสอ้างอิง (Activity ID)</Typography>
				<form noValidate onSubmit={handleSubmitActivityId} autoComplete='off'>
					<FormControl className='[&_.Mui-focused>fieldset]:border-primary' fullWidth variant='outlined'>
						<OutlinedInput
							className={classNames(
								'text-md font-normal text-[#7A7A7A] [&_fieldset]:rounded-lg [&_fieldset]:border-gray [&_input]:px-3 [&_input]:py-2',
								{
									'!font-medium !text-black': !!inputActivityId,
								},
							)}
							id='activityId'
							value={inputActivityId}
							onChange={handleChangeActivityIdInput}
							inputRef={activityIdRef}
							placeholder='รหัสอ้างอิง'
						/>
					</FormControl>
				</form>
			</Box>
			<FilterButtonMain />
		</div>
	)
}

export default PlotMonitoringFilter
