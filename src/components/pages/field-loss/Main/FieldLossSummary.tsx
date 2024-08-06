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

interface DataType {
	updatedDate: string
	actAreaRai: number
	actAreaPlot: number
	actAreaRaiNoGeom: number
	actAreaPlotNoGeom: number
	predictedAreaRai: number
	predictedAreaPlot: number
	lossPredicted: LossPredictedType[]
	claimedAreaRai: number
	claimedAreaPlot: number
	lossAreaPercent: number
}

// const data: DataType = {
// 	updatedDate: '2022-07-19',
// 	actAreaRai: 1200000.0,
// 	actAreaPlot: 30968.0,
// 	actAreaRaiNoGeom: 3000000.0,
// 	actAreaPlotNoGeom: 30968.0,
// 	predictedAreaRai: 450000.0,
// 	predictedAreaPlot: 147.0,
// 	lossPredicted: [
// 		{
// 			lossType: 'drought',
// 			areaRai: 150000.0,
// 			areaPlot: 51.0,
// 			precent: 0.125,
// 		},
// 		{
// 			lossType: 'flood',
// 			areaRai: 300000.0,
// 			areaPlot: 96.0,
// 			precent: 0.25,
// 		},
// 	],
// 	claimedAreaRai: 1125000.0,
// 	claimedAreaPlot: 0,
// 	lossAreaPercent: 0.375,
// }

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
	const { areaType, setAreaType } = useAreaType()
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
		<div className='box-border flex w-[360px] flex-col gap-[16px] bg-[#F8FAFD] px-[24px] py-[16px]'>
			<ToggleButtonGroup
				value={lossType}
				exclusive
				onChange={handleLossTypeClick}
				aria-label='loss-type'
				className='flex gap-[4px] [&_*]:border-none [&_*]:px-[12px] [&_*]:py-[6px] [&_*]:leading-[20px]'
			>
				<ToggleButton
					className={clsx('text-[#7A7A7A]', {
						'bg-primary font-semibold text-white': Boolean(lossType) === false,
					})}
					value={''}
				>
					{t('allDisasters')}
				</ToggleButton>
				<ToggleButton
					className={clsx('text-[#7A7A7A]', {
						'bg-primary font-semibold text-white': lossType === LossType.Drought,
					})}
					value={LossType.Drought}
				>
					{t('drought')}
				</ToggleButton>
				<ToggleButton
					className={clsx('text-[#7A7A7A]', {
						'bg-primary font-semibold text-white': lossType === LossType.Flood,
					})}
					value={LossType.Flood}
				>
					{t('flood')}
				</ToggleButton>
			</ToggleButtonGroup>
			<Box className='flex flex-col gap-[8px]'>
				<Card className='box-border w-full bg-[#0000000A] px-[16px] py-[12px]'>
					<CardContent className='flex flex-col gap-[12px] p-0'>
						<Typography variant='body1' className='font-semibold'>
							{t('allRegisteredAreas', { ns: 'field-loss' })}
						</Typography>
						<div className='flex items-baseline justify-end gap-[4px]'>
							<span className='text-lg font-semibold leading-[24px] text-[#575757]'>
								{/* {data.actAreaRaiNoGeom.toLocaleString()} */}
								{summaryData?.data?.actAreaNoGeom[areaUnit].toLocaleString()}
							</span>
							<span className='text-sm leading-[20px]'>{t(areaUnit)}</span>
						</div>
						<span className='text-xs font-medium leading-[16px] text-[#7A7A7A]'>
							{t('lastUpdated', { ns: 'field-loss' })} 24 มี.ค. 2568
						</span>
					</CardContent>
				</Card>
				<ToggleButtonGroup
					value={selectedCard}
					exclusive
					onChange={handleCardClick}
					aria-label='card-toggle'
					className='flex flex-col gap-[8px]'
				>
					<ToggleButton
						value={1}
						className={clsx('p-0', {
							'border-[2px] border-primary': selectedCard === 1,
							'border-[1px] border-[#F2F2F2]': selectedCard !== 1,
						})}
					>
						<Card className='w-full px-[16px] py-[12px]'>
							<CardContent className='flex flex-col gap-[12px] p-0'>
								<Typography variant='body1' className='text-left font-semibold'>
									{t('estimatedRemediationArea', { ns: 'field-loss' })}
								</Typography>
								<div className='flex flex-col items-end gap-[4px]'>
									<div className='flex items-baseline justify-end gap-[4px]'>
										<span className='text-lg font-semibold leading-[24px] text-[#9F1853]'>
											{/* {data.claimedAreaRai.toLocaleString()} */}
											{summaryData?.data?.claimedArea[areaUnit].toLocaleString()}
										</span>
										<span className='text-sm leading-[20px]'>{t(areaUnit)}</span>
									</div>
									<p className='m-0 font-normal leading-[20px]'>
										{i18n.language === 'th' && 'คิดเป็น'}{' '}
										<span className='font-semibold text-[#9F1853]'>
											{/* {(data.lossAreaPercent * 100).toFixed(1) + '%'} */}
											{summaryData?.data?.claimedArea.percent + '%'}
										</span>{' '}
										{t('percentTotalRegisteredAreas', { ns: 'field-loss' })}
									</p>
								</div>
								<span className='text-right text-xs font-normal leading-[16px] underline'>
									{t('calculationMethod', { ns: 'field-loss' })}
								</span>
							</CardContent>
						</Card>
					</ToggleButton>
					<ToggleButton
						value={2}
						className={clsx('p-0', {
							'border-[2px] border-primary': selectedCard === 2,
							'border-[1px] border-[#F2F2F2]': selectedCard !== 2,
						})}
					>
						<Card className='w-full px-[16px] py-[12px]'>
							<CardContent className='flex flex-col gap-[12px] p-0'>
								<Typography variant='body1' className='text-left font-semibold'>
									{t('totalDamagedArea', { ns: 'field-loss' })}
								</Typography>
								<div className='flex items-baseline justify-end gap-[4px]'>
									<span className='text-lg font-semibold leading-[24px] text-[#9F1853]'>
										{/* {data.predictedAreaRai.toLocaleString()} */}
										{summaryData?.data?.predictedArea[areaUnit].toLocaleString()}
									</span>
									<span className='text-sm leading-[20px]'>{t(areaUnit)}</span>
								</div>
								<div className='flex flex-col gap-[8px]'>
									{/* {data.lossPredicted.map((item) => {
										const actArea = {
											areaRai: data.actAreaRai,
											areaPlot: data.actAreaPlot,
										}
										return <FieldLossCard key={item.lossType} item={item} actArea={actArea} />
									})} */}
									{summaryData?.data?.lossPredicted.map((item) => (
										<FieldLossCard
											key={item.lossType}
											item={item}
											actArea={summaryData.data?.actArea}
										/>
									))}
								</div>
								<span className='text-left text-xs font-medium leading-[16px] text-[#7A7A7A]'>
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
