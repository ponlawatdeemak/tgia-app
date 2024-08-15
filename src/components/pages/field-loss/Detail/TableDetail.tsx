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
	label: string
}

const headCells: readonly HeadCell[] = [
	{
		id: 'totalPredicted',
		label: 'ภัยพิบัติทั้งหมด',
	},
	{
		id: 'droughtPredicted',
		label: 'ภัยแล้ง',
	},
	{
		id: 'floodPredicted',
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
	const { t, i18n } = useTranslation(['default', 'um'])
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
		<div className='flex h-full flex-1 flex-col gap-3 overflow-hidden bg-white p-6 pb-0 max-lg:rounded'>
			<Typography className='text-md font-semibold text-black-dark'>อันดับความเสียหายจากภัยพิบัติ</Typography>
			<TableContainer>
				<Table aria-labelledby='tableTitle'>
					<TableHead>
						<TableRow className='[&_th]:border-gray [&_th]:p-2.5 [&_th]:text-base [&_th]:font-semibold'>
							<TableCell className='text-black' align='left'>
								รวมทั้งหมด
							</TableCell>
							<TableCell
								className={clsx('w-[20.5%] min-w-[120px]', {
									'text-secondary': sortTypeField === 'totalPredicted',
									'text-black-light': sortTypeField !== 'totalPredicted',
								})}
								align='right'
							>
								{areaStatisticDataTotal?.totalPredicted[areaUnit].toLocaleString()}
							</TableCell>
							<TableCell
								className={clsx('w-[20.5%] min-w-[100px]', {
									'text-secondary': sortTypeField === 'droughtPredicted',
									'text-black-light': sortTypeField !== 'droughtPredicted',
								})}
								align='right'
							>
								{areaStatisticDataTotal?.droughtPredicted[areaUnit].toLocaleString()}
							</TableCell>
							<TableCell
								className={clsx('w-[20.5%] min-w-[100px]', {
									'text-secondary': sortTypeField === 'floodPredicted',
									'text-black-light': sortTypeField !== 'floodPredicted',
								})}
								align='right'
							>
								{areaStatisticDataTotal?.floodPredicted[areaUnit].toLocaleString()}
							</TableCell>
						</TableRow>
						<TableRow className='[&_th]:border-gray [&_th]:px-2.5 [&_th]:py-2 [&_th]:text-sm [&_th]:font-semibold [&_th]:text-black'>
							<TableCell align='left'>อันดับ</TableCell>
							{headCells.map((headCell) => (
								<TableCell
									key={headCell.id}
									className='[&_span.Mui-active>svg]:block [&_span>svg]:hidden'
									sortDirection={sortTypeField === headCell.id ? sortType : false}
								>
									<TableSortLabel
										className='flex flex-row items-center justify-end gap-1 [&_svg]:m-0 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:font-normal [&_svg]:text-black'
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
						<TableRow className='h-3'></TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row, index) => {
							const labelId = `enhanced-table-checkbox-${index}`
							return (
								<TableRow
									className='[&_td]:border-gray-light [&_td]:p-2.5 [&_td]:text-base'
									hover
									role='checkbox'
									tabIndex={-1}
									key={row.id}
									sx={{ cursor: 'pointer' }}
								>
									<TableCell
										className='border-gray-light p-2.5 text-base'
										component='th'
										id={labelId}
										scope='row'
										align='left'
									>
										<div className='flex flex-row gap-5 font-medium text-black'>
											<span className='w-5'>{row.order}</span>
											<span>{row.name[language]}</span>
										</div>
									</TableCell>
									<TableCell
										align='right'
										className={clsx('', {
											'font-medium text-secondary': sortTypeField === 'totalPredicted',
											'text-black-light font-normal': sortTypeField !== 'totalPredicted',
										})}
									>
										{row.totalPredicted[areaUnit].toLocaleString()}
									</TableCell>
									<TableCell
										align='right'
										className={clsx('', {
											'font-medium text-secondary': sortTypeField === 'droughtPredicted',
											'text-black-light font-normal': sortTypeField !== 'droughtPredicted',
										})}
									>
										{row.droughtPredicted[areaUnit].toLocaleString()}
									</TableCell>
									<TableCell
										align='right'
										className={clsx('', {
											'font-medium text-secondary': sortTypeField === 'floodPredicted',
											'text-black-light font-normal': sortTypeField !== 'floodPredicted',
										})}
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
