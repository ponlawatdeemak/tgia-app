import { Box, Card, CardContent, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import React, { useState } from 'react'
import clsx from 'clsx'
import { AreaTypeKey, AreaUnitKey, Language } from '@/enum'
import useAreaType from '@/store/area-type'
import useAreaUnit from '@/store/area-unit'
import { LossType } from '@/enum'
import FieldLossCard from '../Card'
import { useTranslation } from 'react-i18next'
import dayjs, { Dayjs } from 'dayjs'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'

interface OptionType {
	name: string
	id: string
	searchType: string
}

interface LossPredictedType {
	lossType: string
	areaRai: number
	areaPlot: number
	precent: number
}

interface FieldLossSummaryProps {
	selectedOption: OptionType | null
	startDate: Dayjs | null
	endDate: Dayjs | null
	lossType: LossType | null
	setLossType: React.Dispatch<React.SetStateAction<LossType | null>>
}

const FieldLossSummary: React.FC<FieldLossSummaryProps> = ({
	selectedOption,
	startDate,
	endDate,
	lossType,
	setLossType,
}) => {
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['default', 'field-loss'])
	const [selectedCard, setSelecteeCard] = useState<number>(2)

	const { data: summaryData, isLoading: isSummaryDataLoading } = useQuery({
		queryKey: ['getSummaryPredictedLoss', lossType, startDate, endDate, areaType, selectedOption?.id],
		queryFn: () =>
			service.fieldLoss.getSummaryPredictedLoss({
				lossType: lossType || undefined,
				startDate: startDate?.toISOString().split('T')[0] || '',
				endDate: endDate?.toISOString().split('T')[0] || '',
				registrationAreaType: areaType,
				provinceId: selectedOption?.id ? parseInt(selectedOption.id) : undefined,
			}),
	})

	// console.log('lossType', lossType ?? undefined)
	// console.log('startDate', startDate?.toISOString().split('T')[0])
	// console.log('endDate', endDate?.toISOString().split('T')[0])
	// console.log('areaType', areaType)
	// console.log('provinceId', selectedOption?.id)
	// console.log('summaryData', summaryData)

	const handleLossTypeClick = (_event: React.MouseEvent<HTMLElement>, newAlignment: LossType | null) => {
		setLossType(newAlignment)
	}

	const handleCardClick = (_event: React.MouseEvent<HTMLElement>, cardIndex: number) => {
		setSelecteeCard(cardIndex)
	}

	return (
		<div className='lg:bg-gray-light2 box-border flex flex-col gap-0 bg-gray-light p-0 lg:w-[30%] lg:min-w-[360px] lg:max-w-[580px] lg:gap-4 lg:px-[22px] lg:py-4'>
			<ToggleButtonGroup
				value={lossType}
				exclusive
				onChange={handleLossTypeClick}
				aria-label='loss-type'
				className='lg:border-gray-light2 flex gap-2 border-2 border-solid border-gray-light max-lg:py-3 lg:gap-1 [&_*]:rounded [&_*]:border-none [&_*]:px-3 [&_*]:py-1.5'
			>
				<ToggleButton
					className={clsx('text-base', {
						'bg-primary font-semibold text-white': Boolean(lossType) === false,
						'text-gray-dark2': Boolean(lossType) !== false,
					})}
					value={''}
				>
					{t('allDisasters')}
				</ToggleButton>
				<ToggleButton
					className={clsx('text-base', {
						'bg-primary font-semibold text-white': lossType === LossType.Drought,
						'text-gray-dark2': lossType !== LossType.Drought,
					})}
					value={LossType.Drought}
				>
					{t('drought')}
				</ToggleButton>
				<ToggleButton
					className={clsx('text-base', {
						'bg-primary font-semibold text-white': lossType === LossType.Flood,
						'text-gray-dark2': lossType !== LossType.Flood,
					})}
					value={LossType.Flood}
				>
					{t('flood')}
				</ToggleButton>
			</ToggleButtonGroup>
			<Box className='flex flex-col gap-3 lg:gap-2'>
				<Card className='bg-gray-dark3 lg:border-gray-light2 box-border w-full border-2 border-solid border-gray-light px-4 py-3 max-lg:rounded'>
					<CardContent className='flex flex-col gap-3 p-0'>
						<Typography variant='body1' className='text-left text-md font-semibold text-black-dark'>
							{t('allRegisteredAreas', { ns: 'field-loss' })}
						</Typography>
						<div className='flex items-baseline justify-end gap-1'>
							<span className='text-black-light text-xl font-semibold'>
								{summaryData?.data?.actAreaNoGeom[areaUnit].toLocaleString()}
							</span>
							<span className='text-base text-black-dark'>{t(areaUnit)}</span>
						</div>
						<span className='text-gray-dark2 text-left text-sm font-medium'>
							{t('lastUpdated', { ns: 'field-loss' })} 24 มี.ค. 2568
						</span>
					</CardContent>
				</Card>
				<ToggleButtonGroup
					value={selectedCard}
					exclusive
					onChange={handleCardClick}
					aria-label='card-toggle'
					className='flex flex-col gap-3 lg:gap-2'
				>
					<ToggleButton
						value={1}
						className={clsx('m-0 p-0 max-lg:rounded', {
							'border-2 border-primary': selectedCard === 1,
							'hover:border-gray-light2 border-2 border-transparent': selectedCard !== 1,
						})}
					>
						<Card
							className={clsx('w-full border-solid max-lg:rounded', {
								'border border-transparent': selectedCard === 1,
								'border border-gray-light': selectedCard !== 1,
							})}
						>
							<CardContent className='flex flex-col gap-3 px-4 py-3'>
								<Typography variant='body1' className='text-left text-md font-semibold text-black-dark'>
									{t('estimatedRemediationArea', { ns: 'field-loss' })}
								</Typography>
								<div className='flex flex-col items-end gap-1'>
									<div className='flex items-baseline justify-end gap-1'>
										<span className='text-xl font-semibold text-secondary'>
											{summaryData?.data?.claimedArea[areaUnit].toLocaleString()}
										</span>
										<span className='text-base text-black-dark'>{t(areaUnit)}</span>
									</div>
									<p className='m-0 text-base font-normal text-black-dark'>
										{i18n.language === 'th' && 'คิดเป็น'}{' '}
										<span className='text-base font-semibold text-secondary'>
											{(summaryData?.data?.claimedArea.percent || '') + '%'}
										</span>{' '}
										{t('percentTotalRegisteredAreas', { ns: 'field-loss' })}
									</p>
								</div>
								<span className='text-right text-sm font-normal text-black-dark underline'>
									{t('calculationMethod', { ns: 'field-loss' })}
								</span>
							</CardContent>
						</Card>
					</ToggleButton>
					<ToggleButton
						value={2}
						className={clsx('m-0 p-0 max-lg:rounded', {
							'border-2 border-primary': selectedCard === 2,
							'hover:border-gray-light2 border-2 border-transparent': selectedCard !== 2,
						})}
					>
						<Card
							className={clsx('w-full border-solid max-lg:rounded', {
								'border border-transparent': selectedCard === 2,
								'border border-gray-light': selectedCard !== 2,
							})}
						>
							<CardContent className='flex flex-col gap-3 px-[15px] py-3'>
								<Typography variant='body1' className='text-left text-md font-semibold text-black-dark'>
									{t('totalDamagedArea', { ns: 'field-loss' })}
								</Typography>
								<div className='flex items-baseline justify-end gap-1'>
									<span className='text-xl font-semibold text-secondary'>
										{summaryData?.data?.predictedArea[areaUnit].toLocaleString()}
									</span>
									<span className='text-base text-black-dark'>{t(areaUnit)}</span>
								</div>
								<div className='flex flex-col gap-2'>
									{summaryData?.data?.lossPredicted.map((item) => (
										<FieldLossCard
											key={item.lossType}
											item={item}
											actArea={summaryData.data?.actArea}
										/>
									))}
								</div>
								<span className='text-gray-dark2 text-left text-sm font-medium'>
									{t('latestDataAnalysis', { ns: 'field-loss' })} 24 มี.ค. 2568
								</span>
							</CardContent>
						</Card>
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>
		</div>
	)
}

export default FieldLossSummary
