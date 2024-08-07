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
	const maxTotalPredicted = Math.max.apply(
		null,
		rows.map((item) => item.totalPredicted[areaUnit]),
	)

	const maxDroughtPredicted = Math.max.apply(
		null,
		rows.map((item) => item.droughtPredicted[areaUnit]),
	)

	const maxFloodPredicted = Math.max.apply(
		null,
		rows.map((item) => item.floodPredicted[areaUnit]),
	)

	const chartData = (row: GetTimeStatisticDtoOut) => {
		if (sortTypeField === 'totalPredicted') {
			return [
				{
					label: 'drought',
					percent: (row.droughtPredicted[areaUnit] / row.totalPredicted[areaUnit]) * 100,
					color: '#E34A33',
				},
				{
					label: 'flood',
					percent: (row.floodPredicted[areaUnit] / row.totalPredicted[areaUnit]) * 100,
					color: '#3182BD',
				},
			]
		} else if (sortTypeField === 'droughtPredicted') {
			return [
				{
					label: 'drought',
					percent: (row.droughtPredicted[areaUnit] / maxDroughtPredicted) * 100,
					color: '#E34A33',
				},
			]
		} else if (sortTypeField === 'floodPredicted') {
			return [
				{
					label: 'flood',
					percent: (row.floodPredicted[areaUnit] / maxFloodPredicted) * 100,
					color: '#3182BD',
				},
			]
		}
	}

	// console.log('max', maxDroughtPredicted)
	// console.log('sortTypeField', sortTypeField)

	return (
		<div className='flex h-full flex-1 flex-col gap-3 overflow-hidden p-4 pb-0'>
			<Typography className='text-md font-semibold'>ความเสียหายจากภัยพิบัติ (รายเดือน)</Typography>
			<TableContainer>
				<Table aria-labelledby='tableTitle'>
					<TableHead>
						<TableRow>
							<TableCell align='left'>รวมทั้งหมด</TableCell>
							<TableCell className='text-secondary' align='left'>
								{timeStatisticDataTotal?.[sortTypeField][areaUnit].toLocaleString()}
							</TableCell>
							<TableCell align='right'>
								<div>
									<span>Drougth</span>
									<span>Flood</span>
								</div>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align='left'>ปีการเพาะปลูก 2567/68</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row, index) => {
							const labelId = `enhanced-table-checkbox-${index}`
							return (
								<TableRow hover role='checkbox' tabIndex={-1} key={index} sx={{ cursor: 'pointer' }}>
									<TableCell component='th' id={labelId} scope='row' padding='none'>
										{row.monthYear[language]}
									</TableCell>
									<TableCell className='text-secondary'>
										{row?.[sortTypeField][areaUnit].toLocaleString()}
									</TableCell>
									<TableCell>
										<div className='w-full'>
											<StackedProgressBar
												data={chartData(row) || []}
												percentTotal={
													sortTypeField === 'totalPredicted'
														? (row.totalPredicted[areaUnit] / maxTotalPredicted) * 100
														: 100
												}
											></StackedProgressBar>
										</div>
									</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	)
}

export default ChartDetail
