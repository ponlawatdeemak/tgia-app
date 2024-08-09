'use client'

import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
	Tooltip,
	Typography,
} from '@mui/material'
import React, { useCallback, useState } from 'react'
import { visuallyHidden } from '@mui/utils'
import { GetAreaStatisticDtoOut, GetTimeStatisticDtoOut, LossTypeAreaPredicted } from '@/api/field-loss/dto-out.dto'
import { ResponseArea, ResponseLanguage, ResponseStatisticDto } from '@/api/interface'
import useAreaType from '@/store/area-type'
import useAreaUnit from '@/store/area-unit'
import { useTranslation } from 'react-i18next'
import { SortType } from '@/enum'
import clsx from 'clsx'
import StackedProgressBar from '@/components/common/progress-bar/StackedProgressBar'
import { SummaryLineChartColor } from '@/config/color'

interface Data {
	//id: number
	totalPredicted: ResponseArea
	droughtPredicted: ResponseArea
	floodPredicted: ResponseArea
}

interface ChartDetailProps {
	timeStatisticData: GetTimeStatisticDtoOut[] | undefined
	timeStatisticDataTotal: LossTypeAreaPredicted | undefined
	sortTypeField: keyof Data
}

const ChartDetail: React.FC<ChartDetailProps> = ({ timeStatisticData, timeStatisticDataTotal, sortTypeField }) => {
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['default', 'profile'])
	const language = i18n.language as keyof ResponseLanguage

	const rows = timeStatisticData || []
	// const maxTotalPredicted = Math.max.apply(
	// 	null,
	// 	rows.map((item) => item.totalPredicted[areaUnit]),
	// )

	// const maxDroughtPredicted = Math.max.apply(
	// 	null,
	// 	rows.map((item) => item.droughtPredicted[areaUnit]),
	// )

	// const maxFloodPredicted = Math.max.apply(
	// 	null,
	// 	rows.map((item) => item.floodPredicted[areaUnit]),
	// )

	const chartData = (row: GetTimeStatisticDtoOut) => {
		console.log('percentDrought', row.droughtPredicted.percent)
		console.log('percentFlood', row.floodPredicted.percent)
		if (sortTypeField === 'totalPredicted') {
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
		} else if (sortTypeField === 'droughtPredicted') {
			return [
				{
					label: 'drought',
					percent: row.droughtPredicted.percent,
					color: SummaryLineChartColor.loss.drought,
				},
			]
		} else if (sortTypeField === 'floodPredicted') {
			return [
				{
					label: 'flood',
					percent: row.floodPredicted.percent,
					color: SummaryLineChartColor.loss.flood,
				},
			]
		}
	}

	// console.log('max', maxDroughtPredicted)
	// console.log('sortTypeField', sortTypeField)

	return (
		<div className='flex h-full flex-1 flex-col gap-3 overflow-hidden bg-white p-6 pb-0 max-lg:rounded'>
			<Typography className='text-md font-semibold text-black-dark'>
				ความเสียหายจากภัยพิบัติ (รายเดือน)
			</Typography>
			<TableContainer>
				<Table aria-labelledby='tableTitle'>
					<TableHead>
						<TableRow className='[&_th]:border-gray [&_th]:text-base'>
							<TableCell className='w-[25.5%] min-w-[130px] p-2.5 font-semibold text-black' align='left'>
								รวมทั้งหมด
							</TableCell>
							<TableCell
								className='w-[20.5%] min-w-[100px] p-2.5 font-semibold text-secondary'
								align='right'
							>
								{timeStatisticDataTotal?.[sortTypeField][areaUnit].toLocaleString()}
							</TableCell>
							<TableCell className='p-0 py-2 font-medium text-black' align='right'>
								<div className='flex flex-row items-center justify-end'>
									<div className='flex flex-row items-center gap-1 px-2 py-0.5'>
										<span className='bg-droughtTileColor-level4 h-2.5 w-2.5 rounded-sm'></span>
										<span>ภัยแล้ง</span>
									</div>
									<div className='flex flex-row items-center gap-1 px-2 py-0.5'>
										<span className='bg-floodTileColor-level4 h-2.5 w-2.5 rounded-sm'></span>
										<span>น้ำท่วม</span>
									</div>
								</div>
							</TableCell>
						</TableRow>
						<TableRow className='h-3'></TableRow>
						<TableRow>
							<TableCell
								className='text-gray-light4 border-none p-0 px-2.5 pb-1 text-sm font-medium'
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
											<span className='text-gray-dark2 text-xs font-medium'>
												พื้นที่เสียหายจากการวิเคราะห์
											</span>
											{sortTypeField === 'totalPredicted' ? (
												<>
													<div className='flex flex-row items-baseline justify-between'>
														<span className='text-sm font-medium text-black'>ทั้งหมด</span>
														<div className='flex flex-row items-baseline gap-1'>
															<span className='text-base font-semibold text-secondary'>
																{row.totalPredicted[areaUnit].toLocaleString()}
															</span>
															<span className='text-sm font-normal text-black'>ไร่</span>
														</div>
													</div>
													<div className='flex flex-row items-baseline justify-between'>
														<span className='text-sm font-medium text-black'>ภัยแล้ง</span>
														<div className='flex flex-row items-baseline gap-1'>
															<span className='text-base font-semibold text-secondary'>
																{row.droughtPredicted[areaUnit].toLocaleString()}
															</span>
															<span className='text-sm font-normal text-black'>ไร่</span>
														</div>
													</div>
													<div className='flex flex-row items-baseline justify-between'>
														<span className='text-sm font-medium text-black'>น้ำท่วม</span>
														<div className='flex flex-row items-baseline gap-1'>
															<span className='text-base font-semibold text-secondary'>
																{row.floodPredicted[areaUnit].toLocaleString()}
															</span>
															<span className='text-sm font-normal text-black'>ไร่</span>
														</div>
													</div>
												</>
											) : (
												<>
													<div className='flex flex-row items-baseline justify-between'>
														<span className='text-sm font-medium text-black'>
															{sortTypeField === 'droughtPredicted'
																? 'ภัยแล้ง'
																: 'น้ำท่วม'}
														</span>
														<div className='flex flex-row items-baseline gap-1'>
															<span className='text-base font-semibold text-secondary'>
																{sortTypeField === 'droughtPredicted'
																	? row.droughtPredicted[areaUnit].toLocaleString()
																	: row.floodPredicted[areaUnit].toLocaleString()}
															</span>
															<span className='text-sm font-normal text-black'>ไร่</span>
														</div>
													</div>
												</>
											)}
										</Box>
									}
								>
									<TableRow
										className='opacity-40 hover:bg-transparent hover:opacity-100 [&_td]:border-none'
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
										<TableCell className='p-2.5 text-base font-medium text-secondary' align='right'>
											{row?.[sortTypeField][areaUnit].toLocaleString()}
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
		</div>
	)
}

export default ChartDetail
