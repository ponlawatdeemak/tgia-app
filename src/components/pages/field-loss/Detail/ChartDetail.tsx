'use client'

import {
	Box,
	CircularProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
} from '@mui/material'
import React, { useCallback, useMemo } from 'react'
import { GetTimeStatisticDtoOut } from '@/api/field-loss/dto-out.dto'
import { ResponseArea, ResponseLanguage } from '@/api/interface'
import useAreaType from '@/store/area-type'
import useAreaUnit from '@/store/area-unit'
import { useTranslation } from 'react-i18next'
import { LossType } from '@/enum'
import clsx from 'clsx'
import StackedProgressBar from '@/components/common/progress-bar/StackedProgressBar'
import { SummaryLineChartColor } from '@/config/color'
import useSearchFieldLoss from '../Main/context'
import { addDays, format, isWithinInterval } from 'date-fns'
import { GetTimeStatisticDtoIn } from '@/api/field-loss/dto-in.dto'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'
import useResponsive from '@/hook/responsive'
import { formatDate } from '@/utils/date'
import classNames from 'classnames'

interface Data {
	totalPredicted: ResponseArea
	droughtPredicted: ResponseArea
	floodPredicted: ResponseArea
}

const EndCultivationMonth = 3

interface ChartDetailProps {
	areaDetail: string
}

const ChartDetail: React.FC<ChartDetailProps> = ({ areaDetail }) => {
	const { queryParams } = useSearchFieldLoss()
	const { isDesktop } = useResponsive()
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['default', 'field-loss'])
	const language = i18n.language as keyof ResponseLanguage

	const filterTimeStatistic = useMemo(() => {
		const filter: GetTimeStatisticDtoIn = {
			lossType: queryParams.lossType || undefined,
			startDate: queryParams.startDate ? format(queryParams.startDate, 'yyyy-MM-dd') : '',
			endDate: queryParams.endDate ? format(queryParams.endDate, 'yyyy-MM-dd') : '',
			registrationAreaType: areaType,
		}
		return filter
	}, [queryParams, areaType])

	const { data: timeStatisticData, isLoading: isTimeStatisticData } = useQuery({
		queryKey: ['getTimeStatistic', filterTimeStatistic],
		queryFn: () => service.fieldLoss.getTimeStatistic(filterTimeStatistic),
		//enabled: areaDetail === 'time-statistic' || !isDesktop,
	})

	const rows = useMemo(() => timeStatisticData?.data || [], [timeStatisticData?.data])

	const lossTypePredicted = useMemo(() => {
		let lossTypePredicted: keyof Data
		if (queryParams.lossType) {
			if (queryParams.lossType === LossType.Drought) {
				lossTypePredicted = 'droughtPredicted'
			} else {
				lossTypePredicted = 'floodPredicted'
			}
		} else {
			lossTypePredicted = 'totalPredicted'
		}
		return lossTypePredicted
	}, [queryParams.lossType])

	const chartData = useCallback(
		(row: GetTimeStatisticDtoOut) => {
			if (queryParams.lossType) {
				if (queryParams.lossType === LossType.Drought) {
					return [
						{
							label: 'drought',
							percent: row.droughtPredicted.percent,
							color: SummaryLineChartColor.loss.drought,
						},
					]
				} else {
					return [
						{
							label: 'flood',
							percent: row.floodPredicted.percent,
							color: SummaryLineChartColor.loss.flood,
						},
					]
				}
			} else {
				return [
					{
						label: 'drought',
						percent: row.droughtPredicted.percent,
						color: SummaryLineChartColor.loss.drought,
					},
					{
						label: 'flood',
						percent: row.floodPredicted.percent,
						color: SummaryLineChartColor.loss.flood,
					},
				]
			}
		},
		[queryParams.lossType],
	)

	const cultivationYear = useMemo(() => {
		if (queryParams.endDate) {
			const endYear = formatDate(queryParams.endDate, 'yyyy', i18n.language)
			const endMonth = queryParams.endDate.getMonth()
			if (endMonth >= EndCultivationMonth) {
				return `${endYear}/${(parseInt(endYear) + 1).toString().slice(2, 4)}`
			} else {
				return `${(parseInt(endYear) - 1).toString()}/${endYear.slice(2, 4)}`
			}
		}
		return ''
	}, [queryParams.endDate, i18n.language])

	return (
		<div
			className={classNames(
				'box-border flex h-full flex-1 flex-col gap-4 bg-white p-4 max-lg:rounded lg:gap-3 lg:overflow-hidden lg:p-6 lg:pb-0',
				{
					'lg:hidden': areaDetail !== 'time-statistic',
				},
			)}
		>
			<div className='flex flex-col gap-2'>
				{!isDesktop && (
					<Typography className='text-sm font-medium text-gray-dark2'>
						{t('totalDamagedArea', { ns: 'field-loss' })}
					</Typography>
				)}
				<Typography className='text-lg font-semibold text-black-dark lg:text-md'>
					{t('monthlyDisasterDamage', { ns: 'field-loss' })}
				</Typography>
				{!isDesktop && (
					<div className='flex flex-row items-center'>
						{(!queryParams.lossType || queryParams.lossType === LossType.Drought) && (
							<div className='flex flex-row items-center gap-1 px-2 py-0.5'>
								<span className='h-2.5 w-2.5 rounded-sm bg-lossType-drought'></span>
								<span className='text-base font-medium text-black'>{t('drought')}</span>
							</div>
						)}
						{(!queryParams.lossType || queryParams.lossType === LossType.Flood) && (
							<div className='flex flex-row items-center gap-1 px-2 py-0.5'>
								<span className='h-2.5 w-2.5 rounded-sm bg-lossType-flood'></span>
								<span className='text-base font-medium text-black'>{t('flood')}</span>
							</div>
						)}
					</div>
				)}
			</div>
			{isTimeStatisticData ? (
				<div className='flex h-60 flex-col items-center justify-center bg-white lg:h-full'>
					<CircularProgress size={80} color='primary' />
				</div>
			) : (
				<TableContainer>
					<Table aria-labelledby='tableTitle'>
						<TableHead>
							<TableRow className='[&_th]:border-gray [&_th]:text-base'>
								<TableCell
									className='w-[25.5%] min-w-[130px] p-2.5 font-semibold text-black'
									align='left'
								>
									{t('total')}
								</TableCell>
								<TableCell
									className='w-[20.5%] min-w-[100px] p-2.5 font-semibold text-secondary'
									align='right'
								>
									{timeStatisticData?.dataTotal?.[lossTypePredicted][areaUnit].toLocaleString()}
								</TableCell>
								{isDesktop && (
									<TableCell className='p-0 py-2 font-medium text-black' align='right'>
										<div className='flex flex-row items-center justify-end'>
											<div className='flex flex-row items-center gap-1 px-2 py-0.5'>
												<span className='h-2.5 w-2.5 rounded-sm bg-lossType-drought'></span>
												<span>{t('drought')}</span>
											</div>
											<div className='flex flex-row items-center gap-1 px-2 py-0.5'>
												<span className='h-2.5 w-2.5 rounded-sm bg-lossType-flood'></span>
												<span>{t('flood')}</span>
											</div>
										</div>
									</TableCell>
								)}
							</TableRow>
							<TableRow className='h-3'></TableRow>
							<TableRow>
								<TableCell
									className='border-none p-0 px-2.5 pb-1 text-sm font-medium text-gray-light4'
									align='left'
									colSpan={2}
								>
									{`${t('cultivationYear', { ns: 'field-loss' })} ${cultivationYear}`}
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row, index) => {
								const labelId = `enhanced-table-checkbox-${index}`
								const isWithinRange = isWithinInterval(row.month - 1, {
									start: queryParams.startDate?.getMonth() || new Date().getMonth(),
									end: queryParams.endDate?.getMonth() || addDays(new Date(), 15).getMonth(),
								})
								return (
									<Tooltip
										key={index}
										placement='bottom-end'
										slotProps={{
											popper: {
												className: 'z-50',
											},
											tooltip: {
												className: 'bg-white m-0 border-solid border border-gray p-0 w-[172px]',
											},
										}}
										title={
											<Box className='flex flex-col gap-2 p-2'>
												<span className='text-base font-semibold text-black'>
													{row.monthYear[language]}
												</span>
												<span className='text-xs font-medium text-gray-dark2'>
													{t('damageAreaAnalysis', { ns: 'field-loss' })}
												</span>
												{queryParams.lossType ? (
													<>
														<div className='flex flex-row items-baseline justify-between'>
															<span className='text-sm font-medium text-black'>
																{queryParams.lossType === LossType.Drought
																	? 'ภัยแล้ง'
																	: 'น้ำท่วม'}
															</span>
															<div className='flex flex-row items-baseline gap-1'>
																<span className='text-base font-semibold text-secondary'>
																	{queryParams.lossType === LossType.Drought
																		? row.droughtPredicted[
																				areaUnit
																			].toLocaleString()
																		: row.floodPredicted[areaUnit].toLocaleString()}
																</span>
																<span className='text-sm font-normal text-black'>
																	{t(areaUnit)}
																</span>
															</div>
														</div>
													</>
												) : (
													<>
														<div className='flex flex-row items-baseline justify-between'>
															<span className='text-sm font-medium text-black'>
																{t('all')}
															</span>
															<div className='flex flex-row items-baseline gap-1'>
																<span className='text-base font-semibold text-secondary'>
																	{row.totalPredicted[areaUnit].toLocaleString()}
																</span>
																<span className='text-sm font-normal text-black'>
																	{t(areaUnit)}
																</span>
															</div>
														</div>
														<div className='flex flex-row items-baseline justify-between'>
															<span className='text-sm font-medium text-black'>
																{t('drought')}
															</span>
															<div className='flex flex-row items-baseline gap-1'>
																<span className='text-base font-semibold text-secondary'>
																	{row.droughtPredicted[areaUnit].toLocaleString()}
																</span>
																<span className='text-sm font-normal text-black'>
																	{t(areaUnit)}
																</span>
															</div>
														</div>
														<div className='flex flex-row items-baseline justify-between'>
															<span className='text-sm font-medium text-black'>
																{t('flood')}
															</span>
															<div className='flex flex-row items-baseline gap-1'>
																<span className='text-base font-semibold text-secondary'>
																	{row.floodPredicted[areaUnit].toLocaleString()}
																</span>
																<span className='text-sm font-normal text-black'>
																	{t(areaUnit)}
																</span>
															</div>
														</div>
													</>
												)}
											</Box>
										}
									>
										{isDesktop ? (
											<TableRow
												className={clsx(
													'hover:bg-transparent hover:opacity-100 [&_td]:border-none',
													{
														'opacity-100': isWithinRange,
														'opacity-40': !isWithinRange,
													},
												)}
												hover
												role='checkbox'
												tabIndex={-1}
												key={index}
												sx={{ cursor: 'pointer' }}
											>
												<TableCell
													className='border-none p-2.5 text-base font-medium text-black'
													component='th'
													id={labelId}
													scope='row'
													align='left'
												>
													{row.monthYear[language]}
												</TableCell>
												<TableCell
													className='p-2.5 text-base font-medium text-secondary'
													align='right'
												>
													{row?.[lossTypePredicted][areaUnit].toLocaleString()}
												</TableCell>
												<TableCell className='p-0 px-2.5' align='left'>
													<div className='w-full'>
														<StackedProgressBar
															data={chartData(row) || []}
														></StackedProgressBar>
													</div>
												</TableCell>
											</TableRow>
										) : (
											<TableRow
												className={clsx(
													'hover:bg-transparent hover:opacity-100 [&_td]:border-none',
													{
														'opacity-100': isWithinRange,
														'opacity-40': !isWithinRange,
													},
												)}
												hover
												role='checkbox'
												tabIndex={-1}
												key={index}
												sx={{ cursor: 'pointer' }}
											>
												<TableCell className='p-0 py-2' colSpan={2}>
													<Box className='flex flex-col'>
														<Box className='flex flex-row items-baseline justify-between px-2.5 py-0.5'>
															<Typography className='border-none text-base font-medium text-black'>
																{row.monthYear[language]}
															</Typography>
															<Typography className='text-base font-medium text-secondary'>
																{row?.[lossTypePredicted][areaUnit].toLocaleString()}
															</Typography>
														</Box>
														<div className='px-2.5'>
															<StackedProgressBar
																data={chartData(row) || []}
															></StackedProgressBar>
														</div>
													</Box>
												</TableCell>
											</TableRow>
										)}
									</Tooltip>
								)
							})}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</div>
	)
}

export default ChartDetail
