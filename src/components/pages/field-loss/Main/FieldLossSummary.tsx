import { Box, Card, CardContent, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import React, { useState } from 'react'
import clsx from 'clsx'
import { LossType } from '@/enum'
import FieldLossCard from '../Card'

const FieldLossSummary = () => {
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
							พื้นที่ขึ้นทะเบียนเกษตรกรทั้งหมด
						</Typography>
						<div className='flex items-baseline justify-end gap-[4px]'>
							<span className='text-lg font-semibold leading-[24px] text-[#575757]'>3,000,000</span>
							<span className='text-sm leading-[20px]'>ไร่</span>
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
									พื้นที่ประมาณการการเยียวยาจากพื้นที่ ลงทะเบียนเกษตรกรทั้งหมด
								</Typography>
								<div className='flex flex-col items-end gap-[4px]'>
									<div className='flex items-baseline justify-end gap-[4px]'>
										<span className='text-lg font-semibold leading-[24px] text-[#9F1853]'>
											1,125,000
										</span>
										<span className='text-sm leading-[20px]'>ไร่</span>
									</div>
									<p className='m-0 font-normal leading-[20px]'>
										คิดเป็น <span className='font-semibold text-[#9F1853]'>37.5%</span>{' '}
										ของพื้นที่ขึ้นทะเบียนทั้งหมด
									</p>
								</div>
								<span className='text-right text-xs font-normal leading-[16px] underline'>
									วิธีการคำนวณ
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
									พื้นที่เสียหายทั้งหมดจากการวิเคราะห์
								</Typography>
								<div className='flex items-baseline justify-end gap-[4px]'>
									<span className='text-lg font-semibold leading-[24px] text-[#9F1853]'>450,000</span>
									<span className='text-sm leading-[20px]'>ไร่</span>
								</div>
								<FieldLossCard />
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
