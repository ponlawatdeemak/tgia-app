import { Box, Card, CardContent, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import React, { useState } from 'react'
import clsx from 'clsx'
import { AreaTypeKey, AreaUnitKey, Language } from '@/enum'
import useAreaType from '@/store/area-type'
import useAreaUnit from '@/store/area-unit'
import { LossType } from '@/enum'
import FieldLossCard from '../Card'
import { useTranslation } from 'react-i18next'

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

const data: DataType = {
	updatedDate: '2022-07-19',
	actAreaRai: 1200000.0,
	actAreaPlot: 30968.0,
	actAreaRaiNoGeom: 3000000.0,
	actAreaPlotNoGeom: 30968.0,
	predictedAreaRai: 450000.0,
	predictedAreaPlot: 147.0,
	lossPredicted: [
		{
			lossType: 'drought',
			areaRai: 150000.0,
			areaPlot: 51.0,
			precent: 0.125,
		},
		{
			lossType: 'flood',
			areaRai: 300000.0,
			areaPlot: 96.0,
			precent: 0.25,
		},
	],
	claimedAreaRai: 1125000.0,
	claimedAreaPlot: 0,
	lossAreaPercent: 0.375,
}

const FieldLossSummary = () => {
	const { areaType, setAreaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const { t } = useTranslation(['default', 'field-loss'])
	const [lossType, setLossType] = useState<LossType | string>('')
	const [selectedCard, setSelecteeCard] = useState<number>(2)

	const handleLossTypeClick = (_event: React.MouseEvent<HTMLElement>, newAlignment: LossType | string) => {
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
					className={clsx('text-[#7A7A7A]', { 'bg-primary font-semibold text-white': lossType === '' })}
					value={''}
				>
					ภัยพิบัติทั้งหมด
				</ToggleButton>
				<ToggleButton
					className={clsx('text-[#7A7A7A]', {
						'bg-primary font-semibold text-white': lossType === LossType.Drought,
					})}
					value={LossType.Drought}
				>
					ภัยแล้ง
				</ToggleButton>
				<ToggleButton
					className={clsx('text-[#7A7A7A]', {
						'bg-primary font-semibold text-white': lossType === LossType.Flood,
					})}
					value={LossType.Flood}
				>
					น้ำท่วม
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
								{data.actAreaRaiNoGeom.toLocaleString()}
							</span>
							<span className='text-sm leading-[20px]'>{t(areaUnit)}</span>
						</div>
						<span className='text-xs font-medium leading-[16px] text-[#7A7A7A]'>
							อัปเดตล่าสุด 24 มี.ค. 2568
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
											{data.claimedAreaRai.toLocaleString()}
										</span>
										<span className='text-sm leading-[20px]'>{t(areaUnit)}</span>
									</div>
									<p className='m-0 font-normal leading-[20px]'>
										คิดเป็น{' '}
										<span className='font-semibold text-[#9F1853]'>
											{(data.lossAreaPercent * 100).toFixed(1) + '%'}
										</span>{' '}
										ของพื้นที่ขึ้นทะเบียนทั้งหมด
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
										{data.predictedAreaRai.toLocaleString()}
									</span>
									<span className='text-sm leading-[20px]'>{t(areaUnit)}</span>
								</div>
								<div className='flex flex-col gap-[8px]'>
									{data.lossPredicted.map((item) => {
										const actArea = {
											areaRai: data.actAreaRai,
											areaPlot: data.actAreaPlot,
										}
										return <FieldLossCard key={item.lossType} item={item} actArea={actArea} />
									})}
								</div>
								<span className='text-left text-xs font-medium leading-[16px] text-[#7A7A7A]'>
									วิเคราะห์ข้อมูลล่าสุด 24 มี.ค. 2568
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
