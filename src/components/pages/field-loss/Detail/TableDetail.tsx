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
	TableSortLabel,
	Typography,
} from '@mui/material'
import React, { useCallback, useMemo } from 'react'
import { visuallyHidden } from '@mui/utils'
import { ResponseArea, ResponseLanguage } from '@/api/interface'
import useAreaType from '@/store/area-type'
import useAreaUnit from '@/store/area-unit'
import { useTranslation } from 'react-i18next'
import { SortType } from '@/enum'
import clsx from 'clsx'
import useSearchFieldLoss from '../Main/context'
import { GetAreaStatisticDtoIn } from '@/api/field-loss/dto-in.dto'
import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'
import useResponsive from '@/hook/responsive'

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
	areaDetail: string
}

const TableDetail: React.FC<TableDetailProps> = ({ areaDetail }) => {
	const { queryParams, setQueryParams } = useSearchFieldLoss()
	const { isDesktop } = useResponsive()
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['default', 'um'])
	const language = i18n.language as keyof ResponseLanguage

	const filterAreaStatistic = useMemo(() => {
		const filter: GetAreaStatisticDtoIn = {
			startDate: queryParams.startDate ? format(queryParams.startDate, 'yyyy-MM-dd') : '',
			endDate: queryParams.endDate ? format(queryParams.endDate, 'yyyy-MM-dd') : '',
			lossType: queryParams.lossType || undefined,
			registrationAreaType: areaType,
			sort: queryParams.sortTypeField || 'totalPredicted',
			sortType: queryParams.sortType || SortType.DESC,
		}
		return filter
	}, [queryParams, areaType])

	const { data: areaStatisticData, isLoading: isAreaStatisticData } = useQuery({
		queryKey: ['getAreaStatistic', filterAreaStatistic],
		queryFn: () => service.fieldLoss.getAreaStatistic(filterAreaStatistic),
		enabled: areaDetail === 'area-statistic' || !isDesktop,
	})

	const rows = useMemo(() => areaStatisticData?.data || [], [areaStatisticData?.data])

	const handleRequestSort = useCallback(
		(_event: React.MouseEvent<HTMLSpanElement, MouseEvent>, property: keyof Data) => {
			const isDesc =
				(queryParams.sortTypeField || 'totalPredicted') === property &&
				(queryParams.sortType || SortType.DESC) === SortType.DESC
			setQueryParams({ ...queryParams, sortType: isDesc ? SortType.ASC : SortType.DESC, sortTypeField: property })
		},
		[queryParams, setQueryParams],
	)

	return (
		<div className='box-border flex h-full flex-1 flex-col gap-3 overflow-hidden bg-white p-6 pb-0 max-lg:rounded'>
			<Typography className='text-md font-semibold text-black-dark'>อันดับความเสียหายจากภัยพิบัติ</Typography>
			{isAreaStatisticData ? (
				<div className='flex h-full flex-col items-center justify-center bg-white'>
					<CircularProgress size={80} color='primary' />
				</div>
			) : (
				<TableContainer>
					<Table aria-labelledby='tableTitle'>
						<TableHead>
							<TableRow className='[&_th]:border-gray [&_th]:p-2.5 [&_th]:text-base [&_th]:font-semibold'>
								<TableCell className='text-black' align='left'>
									รวมทั้งหมด
								</TableCell>
								<TableCell
									className={clsx('w-[20.5%] min-w-[120px]', {
										'text-secondary':
											(queryParams.sortTypeField || 'totalPredicted') === 'totalPredicted',
										'text-black-light':
											(queryParams.sortTypeField || 'totalPredicted') !== 'totalPredicted',
									})}
									align='right'
								>
									{areaStatisticData?.dataTotal?.totalPredicted[areaUnit].toLocaleString()}
								</TableCell>
								<TableCell
									className={clsx('w-[20.5%] min-w-[100px]', {
										'text-secondary':
											(queryParams.sortTypeField || 'totalPredicted') === 'droughtPredicted',
										'text-black-light':
											(queryParams.sortTypeField || 'totalPredicted') !== 'droughtPredicted',
									})}
									align='right'
								>
									{areaStatisticData?.dataTotal?.droughtPredicted[areaUnit].toLocaleString()}
								</TableCell>
								<TableCell
									className={clsx('w-[20.5%] min-w-[100px]', {
										'text-secondary':
											(queryParams.sortTypeField || 'totalPredicted') === 'floodPredicted',
										'text-black-light':
											(queryParams.sortTypeField || 'totalPredicted') !== 'floodPredicted',
									})}
									align='right'
								>
									{areaStatisticData?.dataTotal?.floodPredicted[areaUnit].toLocaleString()}
								</TableCell>
							</TableRow>
							<TableRow className='[&_th]:border-gray [&_th]:px-2.5 [&_th]:py-2 [&_th]:text-sm [&_th]:font-semibold [&_th]:text-black'>
								<TableCell align='left'>อันดับ</TableCell>
								{headCells.map((headCell) => (
									<TableCell
										key={headCell.id}
										className='[&_span.Mui-active>svg]:block [&_span>svg]:hidden'
										sortDirection={
											(queryParams.sortTypeField || 'totalPredicted') === headCell.id
												? queryParams.sortType || SortType.DESC
												: false
										}
									>
										<TableSortLabel
											className='flex flex-row items-center justify-end gap-1 [&_svg]:m-0 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:font-normal [&_svg]:text-black'
											active={(queryParams.sortTypeField || 'totalPredicted') === headCell.id}
											direction={
												(queryParams.sortTypeField || 'totalPredicted') === headCell.id
													? queryParams.sortType || SortType.DESC
													: SortType.DESC
											}
											onClick={(event) => handleRequestSort(event, headCell.id)}
										>
											{headCell.label}
											{(queryParams.sortTypeField || 'totalPredicted') === headCell.id ? (
												<Box component='span' sx={visuallyHidden}>
													{(queryParams.sortType || SortType.DESC) === SortType.ASC
														? 'sorted ascending'
														: 'sorted descending'}
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
												'font-medium text-secondary':
													(queryParams.sortTypeField || 'totalPredicted') ===
													'totalPredicted',
												'font-normal text-black-light':
													(queryParams.sortTypeField || 'totalPredicted') !==
													'totalPredicted',
											})}
										>
											{row.totalPredicted[areaUnit].toLocaleString()}
										</TableCell>
										<TableCell
											align='right'
											className={clsx('', {
												'font-medium text-secondary':
													(queryParams.sortTypeField || 'totalPredicted') ===
													'droughtPredicted',
												'font-normal text-black-light':
													(queryParams.sortTypeField || 'totalPredicted') !==
													'droughtPredicted',
											})}
										>
											{row.droughtPredicted[areaUnit].toLocaleString()}
										</TableCell>
										<TableCell
											align='right'
											className={clsx('', {
												'font-medium text-secondary':
													(queryParams.sortTypeField || 'totalPredicted') ===
													'floodPredicted',
												'font-normal text-black-light':
													(queryParams.sortTypeField || 'totalPredicted') !==
													'floodPredicted',
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
			)}
		</div>
	)
}

export default TableDetail
