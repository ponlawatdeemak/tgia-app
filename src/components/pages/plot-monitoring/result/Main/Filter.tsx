'use client'

import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material'
import React from 'react'
import clsx from 'clsx'
import { LossType } from '@/enum'
import { useTranslation } from 'react-i18next'
import useSearchPlotMonitoring from './context'
import { useRouter } from 'next/navigation'
import { AppPath } from '@/config/app'

interface PlotMonitoringFilterProps {
	isFullList: boolean
}

const PlotMonitoringFilter: React.FC<PlotMonitoringFilterProps> = ({ isFullList }) => {
	const router = useRouter()
	const { t, i18n } = useTranslation(['default', 'field-loss'])
	const { queryParams, setQueryParams } = useSearchPlotMonitoring()

	return (
		<div className='box-border flex flex-col gap-0 bg-gray-light p-0 lg:w-[30%] lg:min-w-[360px] lg:max-w-[580px] lg:gap-4 lg:overflow-auto lg:bg-gray-light2 lg:px-6 lg:py-4'>
			<ToggleButtonGroup
				value={queryParams.lossType}
				exclusive
				//onChange={handleLossTypeClick}
				aria-label='loss-type'
				className='flex gap-2 max-lg:py-3 lg:gap-1 [&_*]:rounded [&_*]:border-none [&_*]:px-3 [&_*]:py-1.5 lg:[&_*]:rounded-lg'
			>
				<ToggleButton
					className={clsx('text-base', {
						'bg-primary font-semibold text-white': Boolean(queryParams.lossType) === false,
						'text-gray-dark2': Boolean(queryParams.lossType) !== false,
					})}
					value={''}
				>
					{t('allDisasters')}
				</ToggleButton>
				<ToggleButton
					className={clsx('text-base', {
						'bg-primary font-semibold text-white': queryParams.lossType === LossType.Drought,
						'text-gray-dark2': queryParams.lossType !== LossType.Drought,
					})}
					value={LossType.Drought}
				>
					{t('drought')}
				</ToggleButton>
				<ToggleButton
					className={clsx('text-base', {
						'bg-primary font-semibold text-white': queryParams.lossType === LossType.Flood,
						'text-gray-dark2': queryParams.lossType !== LossType.Flood,
					})}
					value={LossType.Flood}
				>
					{t('flood')}
				</ToggleButton>
			</ToggleButtonGroup>
			<Button
				variant='contained'
				onClick={() => router.push(`${AppPath.PlotMonitoring}/result/98735422`)}
			>{`Card: 98735422`}</Button>
		</div>
	)
}

export default PlotMonitoringFilter
