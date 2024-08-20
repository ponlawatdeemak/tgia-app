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

interface Data {
	totalPredicted: ResponseArea
	droughtPredicted: ResponseArea
	floodPredicted: ResponseArea
}

interface ChartDetailProps {
	areaDetail: string
}

const ChartDetail: React.FC<ChartDetailProps> = ({ areaDetail }) => {
	const { queryParams } = useSearchFieldLoss()
	const { isDesktop } = useResponsive()
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['default', 'um'])
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
		enabled: areaDetail === 'time-statistic' || !isDesktop,
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

	return (
		<div className='box-border flex h-full flex-1 flex-col gap-3 overflow-hidden bg-white p-6 pb-0 max-lg:rounded'>
			<Typography className='text-md font-semibold text-black-dark'>
				ความเสียหายจากภัยพิบัติ (รายเดือน)
			</Typography>
			{isTimeStatisticData ? (
				<div className='flex h-full flex-col items-center justify-center bg-white'>
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
									รวมทั้งหมด
								</TableCell>
								<TableCell
									className='w-[20.5%] min-w-[100px] p-2.5 font-semibold text-secondary'
									align='right'
								>
									{timeStatisticData?.dataTotal?.[lossTypePredicted][areaUnit].toLocaleString()}
								</TableCell>
								<TableCell className='p-0 py-2 font-medium text-black' align='right'>
									<div className='flex flex-row items-center justify-end'>
										<div className='flex flex-row items-center gap-1 px-2 py-0.5'>
											<span className='h-2.5 w-2.5 rounded-sm bg-lossType-drought'></span>
											<span>ภัยแล้ง</span>
										</div>
										<div className='flex flex-row items-center gap-1 px-2 py-0.5'>
											<span className='h-2.5 w-2.5 rounded-sm bg-lossType-flood'></span>
											<span>น้ำท่วม</span>
										</div>
									</div>
								</TableCell>
							</TableRow>
							<TableRow className='h-3'></TableRow>
							<TableRow>
								<TableCell
									className='border-none p-0 px-2.5 pb-1 text-sm font-medium text-gray-light4'
									align='left'
									colSpan={2}
								>
									ปีการเพาะปลูก 2567/68
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
													พื้นที่เสียหายจากการวิเคราะห์
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
																	ไร่
																</span>
															</div>
														</div>
													</>
												) : (
													<>
														<div className='flex flex-row items-baseline justify-between'>
															<span className='text-sm font-medium text-black'>
																ทั้งหมด
															</span>
															<div className='flex flex-row items-baseline gap-1'>
																<span className='text-base font-semibold text-secondary'>
																	{row.totalPredicted[areaUnit].toLocaleString()}
																</span>
																<span className='text-sm font-normal text-black'>
																	ไร่
																</span>
															</div>
														</div>
														<div className='flex flex-row items-baseline justify-between'>
															<span className='text-sm font-medium text-black'>
																ภัยแล้ง
															</span>
															<div className='flex flex-row items-baseline gap-1'>
																<span className='text-base font-semibold text-secondary'>
																	{row.droughtPredicted[areaUnit].toLocaleString()}
																</span>
																<span className='text-sm font-normal text-black'>
																	ไร่
																</span>
															</div>
														</div>
														<div className='flex flex-row items-baseline justify-between'>
															<span className='text-sm font-medium text-black'>
																น้ำท่วม
															</span>
															<div className='flex flex-row items-baseline gap-1'>
																<span className='text-base font-semibold text-secondary'>
																	{row.floodPredicted[areaUnit].toLocaleString()}
																</span>
																<span className='text-sm font-normal text-black'>
																	ไร่
																</span>
															</div>
														</div>
													</>
												)}
											</Box>
										}
									>
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
														percentTotal={
															// sortTypeField === 'totalPredicted'
															// 	? (row.totalPredicted[areaUnit] / maxTotalPredicted) * 100
															// 	: 100
															100
														}
													></StackedProgressBar>
												</div>
											</TableCell>
										</TableRow>
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
