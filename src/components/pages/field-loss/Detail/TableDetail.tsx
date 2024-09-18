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
import { GetAreaStatisticDtoOut } from '@/api/field-loss/dto-out.dto'
import classNames from 'classnames'

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

interface TableDetailProps {
	areaDetail: string
}

const TableDetail: React.FC<TableDetailProps> = ({ areaDetail }) => {
	const { queryParams, setQueryParams } = useSearchFieldLoss()
	const { isDesktop } = useResponsive()
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['default', 'field-loss'])
	const language = i18n.language as keyof ResponseLanguage

	const headCells: readonly HeadCell[] = [
		{
			id: 'totalPredicted',
			label: t('allDisasters'),
		},
		{
			id: 'droughtPredicted',
			label: t('drought'),
		},
		{
			id: 'floodPredicted',
			label: t('flood'),
		},
	]

	const filterAreaStatistic = useMemo(() => {
		const filter: GetAreaStatisticDtoIn = {
			startDate: queryParams.startDate ? format(queryParams.startDate, 'yyyy-MM-dd') : '',
			endDate: queryParams.endDate ? format(queryParams.endDate, 'yyyy-MM-dd') : '',
			lossType: queryParams.lossType || undefined,
			registrationAreaType: areaType,
			// sort: queryParams.sortTypeField || 'totalPredicted',
			// sortType: queryParams.sortType || SortType.DESC,
		}
		return filter
	}, [queryParams, areaType])

	const filterOrder = useMemo(() => {
		// : GetAreaStatisticDtoIn
		const filter = {
			// startDate: queryParams.startDate ? format(queryParams.startDate, 'yyyy-MM-dd') : '',
			// endDate: queryParams.endDate ? format(queryParams.endDate, 'yyyy-MM-dd') : '',
			// lossType: queryParams.lossType || undefined,
			// registrationAreaType: areaType,
			sort: queryParams.sortTypeField || 'totalPredicted',
			sortType: queryParams.sortType || SortType.DESC,
		}
		return filter
	}, [queryParams, areaType])

	const { data: areaStatisticData, isLoading: isAreaStatisticData } = useQuery({
		queryKey: ['getAreaStatistic', filterAreaStatistic],
		queryFn: () => service.fieldLoss.getAreaStatistic({ ...filterAreaStatistic, ...filterOrder }),
		//enabled: areaDetail === 'area-statistic' || !isDesktop,
	})

	// const rows = useMemo(() => areaStatisticData?.data || [], [areaStatisticData?.data])

	const rows = useMemo(() => {
		const data: GetAreaStatisticDtoOut[] = areaStatisticData?.data || []
		data?.sort((a, b) => {
			return filterOrder.sortType === SortType.ASC
				? a[filterOrder?.sort][areaUnit] - b[filterOrder?.sort][areaUnit]
				: b[filterOrder?.sort][areaUnit] - a[filterOrder?.sort][areaUnit]
		})

		let rowNum = 1

		for (let i = 0; i < (data?.length || 0); i++) {
			if (i === 0) {
				data[i].order = 1
			} else {
				if (
					filterOrder.sortType === SortType.ASC
						? data[i]?.[filterOrder?.sort][areaUnit] > data?.[i - 1]?.[filterOrder?.sort][areaUnit]
						: data[i]?.[filterOrder?.sort][areaUnit] < data?.[i - 1]?.[filterOrder?.sort][areaUnit]
				) {
					rowNum = rowNum + 1
				} else {
					rowNum
				}
				data[i].order = rowNum
			}
		}
		return data || []
	}, [areaStatisticData?.data, filterOrder, areaUnit])

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
		<div
			className={classNames(
				'box-border flex h-full flex-1 flex-col gap-4 bg-white p-4 max-lg:rounded lg:gap-3 lg:overflow-hidden lg:p-6 lg:pb-0',
				{
					'lg:hidden': areaDetail !== 'area-statistic',
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
					{t('disasterDamageRank', { ns: 'field-loss' })}
				</Typography>
			</div>
			{isAreaStatisticData ? (
				<div className='flex h-60 flex-col items-center justify-center bg-white lg:h-full'>
					<CircularProgress size={80} color='primary' />
				</div>
			) : (
				<TableContainer>
					<Table aria-labelledby='tableTitle'>
						<TableHead>
							<TableRow className='[&_th]:border-gray [&_th]:p-2.5 [&_th]:text-base [&_th]:font-semibold'>
								<TableCell className='text-black' align='left'>
									{t('total')}
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
									{areaStatisticData?.dataTotal?.totalPredicted[areaUnit]?.toLocaleString()}
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
									{areaStatisticData?.dataTotal?.droughtPredicted[areaUnit]?.toLocaleString()}
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
									{areaStatisticData?.dataTotal?.floodPredicted[areaUnit]?.toLocaleString()}
								</TableCell>
							</TableRow>
							<TableRow className='[&_th]:border-gray [&_th]:px-2.5 [&_th]:py-2 [&_th]:text-sm [&_th]:font-semibold [&_th]:text-black'>
								<TableCell align='left'>{t('rank')}</TableCell>
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
											{row.totalPredicted[areaUnit]?.toLocaleString()}
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
											{row.droughtPredicted[areaUnit]?.toLocaleString()}
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
											{row.floodPredicted[areaUnit]?.toLocaleString()}
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
