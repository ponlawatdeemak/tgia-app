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
import { GetAreaStatisticDtoOut, LossTypeAreaPredicted } from '@/api/field-loss/dto-out.dto'
import { ResponseArea, ResponseLanguage, ResponseStatisticDto } from '@/api/interface'
import useAreaType from '@/store/area-type'
import useAreaUnit from '@/store/area-unit'
import { useTranslation } from 'react-i18next'
import { SortType } from '@/enum'
import clsx from 'clsx'

interface Data {
	//id: number
	totalPredicted: ResponseArea
	droughtPredicted: ResponseArea
	floodPredicted: ResponseArea
}

interface HeadCell {
	id: keyof Data
	numeric: boolean
	disablePadding: boolean
	label: string
}

const headCells: readonly HeadCell[] = [
	{
		id: 'totalPredicted',
		numeric: false,
		disablePadding: true,
		label: 'ภัยพิบัติทั้งหมด',
	},
	{
		id: 'droughtPredicted',
		numeric: false,
		disablePadding: false,
		label: 'ภัยแล้ง',
	},
	{
		id: 'floodPredicted',
		numeric: false,
		disablePadding: false,
		label: 'น้ำท่วม',
	},
]

interface TableDetailProps {
	areaStatisticData: GetAreaStatisticDtoOut[] | undefined
	areaStatisticDataTotal: LossTypeAreaPredicted | undefined
	order: SortType
	orderBy: keyof Data
	setOrder: React.Dispatch<React.SetStateAction<SortType>>
	setOrderBy: React.Dispatch<React.SetStateAction<keyof Data>>
}

const TableDetail: React.FC<TableDetailProps> = ({
	areaStatisticData,
	areaStatisticDataTotal,
	order,
	orderBy,
	setOrder,
	setOrderBy,
}) => {
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['default', 'profile'])
	const language = i18n.language as keyof ResponseLanguage

	const rows = areaStatisticData || []

	const handleRequestSort = useCallback(
		(_event: React.MouseEvent<HTMLSpanElement, MouseEvent>, property: keyof Data) => {
			const isDesc = orderBy === property && order === SortType.DESC
			setOrder(isDesc ? SortType.ASC : SortType.DESC)
			setOrderBy(property)
		},
		[order, orderBy, setOrder, setOrderBy],
	)

	return (
		<div className='relative flex h-full flex-1 flex-col overflow-hidden'>
			<Typography>อันดับความเสียหายจากภัยพิบัติ</Typography>
			<TableContainer>
				<Table aria-labelledby='tableTitle'>
					<TableHead>
						<TableRow>
							<TableCell align='left'>รวมทั้งหมด</TableCell>
							<TableCell
								className={clsx('', { 'text-secondary': orderBy === 'totalPredicted' })}
								align='left'
							>
								{areaStatisticDataTotal?.totalPredicted[areaUnit]}
							</TableCell>
							<TableCell
								className={clsx('', { 'text-secondary': orderBy === 'droughtPredicted' })}
								align='left'
							>
								{areaStatisticDataTotal?.droughtPredicted[areaUnit]}
							</TableCell>
							<TableCell
								className={clsx('', { 'text-secondary': orderBy === 'floodPredicted' })}
								align='left'
							>
								{areaStatisticDataTotal?.floodPredicted[areaUnit]}
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align='left'>อันดับ</TableCell>
							{headCells.map((headCell) => (
								<TableCell
									key={headCell.id}
									align={headCell.numeric ? 'right' : 'left'}
									padding={headCell.disablePadding ? 'none' : 'normal'}
									sortDirection={orderBy === headCell.id ? order : false}
								>
									<TableSortLabel
										active={orderBy === headCell.id}
										direction={orderBy === headCell.id ? order : SortType.DESC}
										onClick={(event) => handleRequestSort(event, headCell.id)}
									>
										{headCell.label}
										{orderBy === headCell.id ? (
											<Box component='span' sx={visuallyHidden}>
												{order === SortType.ASC ? 'sorted ascending' : 'sorted descending'}
											</Box>
										) : null}
									</TableSortLabel>
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row, index) => {
							const labelId = `enhanced-table-checkbox-${index}`
							return (
								<TableRow hover role='checkbox' tabIndex={-1} key={row.id} sx={{ cursor: 'pointer' }}>
									<TableCell component='th' id={labelId} scope='row' padding='none'>
										<div className='m-4 flex flex-row gap-2'>
											<span>{row.order}</span>
											<span>{row.name[language]}</span>
										</div>
									</TableCell>
									<TableCell className={clsx('', { 'text-secondary': orderBy === 'totalPredicted' })}>
										{row.totalPredicted[areaUnit]}
									</TableCell>
									<TableCell
										className={clsx('', { 'text-secondary': orderBy === 'droughtPredicted' })}
									>
										{row.droughtPredicted[areaUnit]}
									</TableCell>
									<TableCell className={clsx('', { 'text-secondary': orderBy === 'floodPredicted' })}>
										{row.floodPredicted[areaUnit]}
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

export default TableDetail
