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
	sortType: SortType
	sortTypeField: keyof Data
	setSortType: React.Dispatch<React.SetStateAction<SortType>>
	setSortTypeField: React.Dispatch<React.SetStateAction<keyof Data>>
}

const TableDetail: React.FC<TableDetailProps> = ({
	areaStatisticData,
	areaStatisticDataTotal,
	sortType,
	sortTypeField,
	setSortType,
	setSortTypeField,
}) => {
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['default', 'profile'])
	const language = i18n.language as keyof ResponseLanguage

	const rows = areaStatisticData || []

	const handleRequestSort = useCallback(
		(_event: React.MouseEvent<HTMLSpanElement, MouseEvent>, property: keyof Data) => {
			const isDesc = sortTypeField === property && sortType === SortType.DESC
			setSortType(isDesc ? SortType.ASC : SortType.DESC)
			setSortTypeField(property)
		},
		[sortType, sortTypeField, setSortType, setSortTypeField],
	)

	return (
		<div className='flex h-full flex-1 flex-col gap-3 overflow-hidden p-4 pb-0'>
			<Typography className='text-md font-semibold'>อันดับความเสียหายจากภัยพิบัติ</Typography>
			<TableContainer>
				<Table aria-labelledby='tableTitle'>
					<TableHead>
						<TableRow className='h-10'>
							<TableCell className='p-0 px-2.5 text-base font-semibold' align='left'>
								รวมทั้งหมด
							</TableCell>
							<TableCell
								className={clsx('p-0 px-2.5 text-base font-semibold', {
									'text-secondary': sortTypeField === 'totalPredicted',
								})}
								align='right'
							>
								{areaStatisticDataTotal?.totalPredicted[areaUnit].toLocaleString()}
							</TableCell>
							<TableCell
								className={clsx('p-0 px-2.5 text-base font-semibold', {
									'text-secondary': sortTypeField === 'droughtPredicted',
								})}
								align='right'
							>
								{areaStatisticDataTotal?.droughtPredicted[areaUnit].toLocaleString()}
							</TableCell>
							<TableCell
								className={clsx('p-0 px-2.5 text-base font-semibold', {
									'text-secondary': sortTypeField === 'floodPredicted',
								})}
								align='right'
							>
								{areaStatisticDataTotal?.floodPredicted[areaUnit].toLocaleString()}
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align='left'>อันดับ</TableCell>
							{headCells.map((headCell) => (
								<TableCell
									key={headCell.id}
									align={headCell.numeric ? 'right' : 'left'}
									padding={headCell.disablePadding ? 'none' : 'normal'}
									sortDirection={sortTypeField === headCell.id ? sortType : false}
								>
									<TableSortLabel
										active={sortTypeField === headCell.id}
										direction={sortTypeField === headCell.id ? sortType : SortType.DESC}
										onClick={(event) => handleRequestSort(event, headCell.id)}
									>
										{headCell.label}
										{sortTypeField === headCell.id ? (
											<Box component='span' sx={visuallyHidden}>
												{sortType === SortType.ASC ? 'sorted ascending' : 'sorted descending'}
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
									<TableCell
										className={clsx('', { 'text-secondary': sortTypeField === 'totalPredicted' })}
									>
										{row.totalPredicted[areaUnit].toLocaleString()}
									</TableCell>
									<TableCell
										className={clsx('', { 'text-secondary': sortTypeField === 'droughtPredicted' })}
									>
										{row.droughtPredicted[areaUnit].toLocaleString()}
									</TableCell>
									<TableCell
										className={clsx('', { 'text-secondary': sortTypeField === 'floodPredicted' })}
									>
										{row.floodPredicted[areaUnit].toLocaleString()}
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
