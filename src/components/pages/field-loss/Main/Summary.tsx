import {
	Box,
	Card,
	CardContent,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Paper,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from '@mui/material'
import React, { useMemo, useState } from 'react'
import clsx from 'clsx'
import { AreaTypeKey, SortType } from '@/enum'
import useAreaType from '@/store/area-type'
import useAreaUnit from '@/store/area-unit'
import { LossType } from '@/enum'
import FieldLossCard from '../Card'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'
import RegistrationCalculation from '@/components/svg/field-loss/RegistrationCalculation'
import { mdiClose } from '@mdi/js'
import Icon from '@mdi/react'
import InsuranceCalculation from '@/components/svg/field-loss/InsuranceCalculation'
import useSearchFieldLoss from './context'
import { addDays, format } from 'date-fns'
import { GetSummaryPredictedLossDtoIn } from '@/api/field-loss/dto-in.dto'
import { ResponseArea } from '@/api/interface'

interface Data {
	//id: number
	totalPredicted: ResponseArea
	droughtPredicted: ResponseArea
	floodPredicted: ResponseArea
}

interface FieldLossSummaryProps {}

const FieldLossSummary: React.FC<FieldLossSummaryProps> = () => {
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['default', 'field-loss'])
	const { queryParams, setQueryParams } = useSearchFieldLoss()
	const [selectedCard, setSelecteeCard] = useState<number>(2)
	const [openCalDialog, setOpenCalDialog] = useState<boolean>(false)

	const filterSummary = useMemo(() => {
		const filter: GetSummaryPredictedLossDtoIn = {
			lossType: queryParams.lossType || undefined,
			startDate: queryParams.startDate
				? format(queryParams.startDate, 'yyyy-MM-dd')
				: format(new Date(), 'yyyy-MM-dd'),
			endDate: queryParams.endDate
				? format(queryParams.endDate, 'yyyy-MM-dd')
				: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
			registrationAreaType: areaType,
			provinceCode: queryParams.provinceCode,
		}
		return filter
	}, [queryParams, areaType])

	const { data: summaryData, isLoading: isSummaryDataLoading } = useQuery({
		queryKey: ['getSummaryPredictedLoss', filterSummary],
		queryFn: () => service.fieldLoss.getSummaryPredictedLoss(filterSummary),
	})

	const handleLossTypeClick = (_event: React.MouseEvent<HTMLElement>, newAlignment: LossType | null) => {
		let sortTypeField: keyof Data
		if (newAlignment) {
			if (newAlignment === LossType.Drought) {
				sortTypeField = 'droughtPredicted'
			} else {
				sortTypeField = 'floodPredicted'
			}
		} else {
			sortTypeField = 'totalPredicted'
		}
		setQueryParams({
			...queryParams,
			lossType: newAlignment,
			sortTypeField: sortTypeField,
			sortType: SortType.DESC,
		})
	}

	const handleCardClick = (_event: React.MouseEvent<HTMLElement>, cardIndex: number) => {
		setSelecteeCard(cardIndex)
	}

	const handleOpenCalDialog = (event: React.MouseEvent<HTMLElement>) => {
		event.stopPropagation()
		setOpenCalDialog(true)
	}

	const handleCloseCalDialog = (event: React.MouseEvent<HTMLElement>) => {
		event.stopPropagation()
		setOpenCalDialog(false)
	}

	return (
		<div className='box-border flex flex-col gap-0 bg-gray-light p-0 lg:w-[30%] lg:min-w-[360px] lg:max-w-[580px] lg:gap-4 lg:overflow-auto lg:bg-gray-light2 lg:px-[22px] lg:py-4'>
			{isSummaryDataLoading ? (
				<div className='flex h-full flex-col items-center justify-center bg-white'>
					<CircularProgress size={80} color='primary' />
				</div>
			) : (
				<>
					<ToggleButtonGroup
						value={queryParams.lossType}
						exclusive
						onChange={handleLossTypeClick}
						aria-label='loss-type'
						className='flex gap-2 border-2 border-solid border-gray-light max-lg:py-3 lg:gap-1 lg:border-gray-light2 [&_*]:rounded [&_*]:border-none [&_*]:px-3 [&_*]:py-1.5 lg:[&_*]:rounded-lg'
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
					<Box className='flex flex-col gap-3 lg:gap-2'>
						<Card className='box-border w-full border-2 border-solid border-gray-light bg-gray-dark3 px-4 py-3 max-lg:rounded lg:border-gray-light2'>
							<CardContent className='flex flex-col gap-3 p-0'>
								<Typography variant='body1' className='text-left text-md font-semibold text-black-dark'>
									{t('allRegisteredAreas', { ns: 'field-loss' })}
								</Typography>
								<div className='flex items-baseline justify-end gap-1'>
									<span className='text-xl font-semibold text-black-light'>
										{summaryData?.data?.actAreaNoGeom[areaUnit].toLocaleString()}
									</span>
									<span className='text-base text-black-dark'>{t(areaUnit)}</span>
								</div>
								<span className='text-left text-sm font-medium text-gray-dark2'>
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
									'border-2 border-transparent hover:border-gray-light2': selectedCard !== 1,
								})}
							>
								<Card
									className={clsx('w-full border-solid max-lg:rounded', {
										'border border-transparent': selectedCard === 1,
										'border border-gray-light': selectedCard !== 1,
									})}
								>
									<CardContent className='flex flex-col gap-3 px-4 py-3'>
										<Typography
											variant='body1'
											className='text-left text-md font-semibold text-black-dark'
										>
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
										<div className='flex justify-end'>
											<span
												onClick={(event) => handleOpenCalDialog(event)}
												className='text-right text-sm font-normal text-black-dark underline'
											>
												{t('calculationMethod', { ns: 'field-loss' })}
											</span>
										</div>
										<Dialog
											open={openCalDialog}
											onClick={(event) => handleCloseCalDialog(event)}
											aria-labelledby='alert-dialog-title'
											aria-describedby='alert-dialog-description'
											PaperComponent={({ children }) => (
												<Paper
													className={clsx('m-0 flex flex-col gap-4 p-6 max-lg:mx-4', {
														'lg:pl-4': areaType === AreaTypeKey.Insurance,
													})}
												>
													{children}
												</Paper>
											)}
										>
											<DialogTitle
												className='flex items-center justify-between p-0'
												id='alert-dialog-title'
											>
												<Typography
													className={clsx(
														'text-sm font-semibold text-black-dark lg:text-lg',
														{
															'lg:ml-2': areaType === AreaTypeKey.Insurance,
														},
													)}
												>
													{areaType === AreaTypeKey.Registration
														? 'วิธีการคำนวนพื้นที่ประมาณการการเยียวยา'
														: 'วิธีการคำนวนพื้นที่ประมาณการเคลมประกัน'}
												</Typography>
												<IconButton
													aria-label='close'
													onClick={(event) => handleCloseCalDialog(event)}
												>
													<Icon
														path={mdiClose}
														className='h-4 w-4 font-light text-black lg:h-6 lg:w-6'
													/>
												</IconButton>
											</DialogTitle>
											<DialogContent className='p-0 max-lg:[&_svg]:!h-full max-lg:[&_svg]:!w-full'>
												{areaType === AreaTypeKey.Registration ? (
													<Box className='overflow-hidden rounded-lg lg:h-[94px] lg:w-[433px]'>
														<RegistrationCalculation width={433} height={94} />
													</Box>
												) : (
													<Box className='h-[38px] overflow-hidden rounded-lg lg:h-[94px] lg:w-[799px]'>
														<InsuranceCalculation width={799} height={94} />
													</Box>
												)}
											</DialogContent>
										</Dialog>
									</CardContent>
								</Card>
							</ToggleButton>
							<ToggleButton
								value={2}
								className={clsx('m-0 p-0 max-lg:rounded', {
									'border-2 border-primary': selectedCard === 2,
									'border-2 border-transparent hover:border-gray-light2': selectedCard !== 2,
								})}
							>
								<Card
									className={clsx('w-full border-solid max-lg:rounded', {
										'border border-transparent': selectedCard === 2,
										'border border-gray-light': selectedCard !== 2,
									})}
								>
									<CardContent className='flex flex-col gap-3 px-[15px] py-3'>
										<Typography
											variant='body1'
											className='text-left text-md font-semibold text-black-dark'
										>
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
										<span className='text-left text-sm font-medium text-gray-dark2'>
											{t('latestDataAnalysis', { ns: 'field-loss' })} 24 มี.ค. 2568
										</span>
									</CardContent>
								</Card>
							</ToggleButton>
						</ToggleButtonGroup>
					</Box>
				</>
			)}
		</div>
	)
}

export default FieldLossSummary
