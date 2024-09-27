'use client'

import {
	Box,
	Button,
	CircularProgress,
	FormControl,
	FormControlLabel,
	LinearProgress,
	ListItemIcon,
	ListItemText,
	MenuItem,
	Radio,
	RadioGroup,
	Select,
	SelectChangeEvent,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from '@mui/material'
import { ExpandMore, Check, ExpandLess } from '@mui/icons-material'
import classNames from 'classnames'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSearchPlotMonitoring from '../Main/context'
import { useInfiniteQuery } from '@tanstack/react-query'
import { GetSearchPlotDtoIn } from '@/api/plot-monitoring/dto-in.dto'
import service from '@/api'
import CardDetail from '../Card'
import { useInView } from 'react-intersection-observer'
import { AppPath } from '@/config/app'
import { useRouter } from 'next/navigation'
import { OrderBy } from '@/enum/plot-monitoring.enum'
import clsx from 'clsx'
import FilterButtonMain from '../Filter'
import useAreaType from '@/store/area-type'
import { toPolygon } from '@/utils/geometry'

const LimitCardsPerPage = 10

interface CardListProps {
	areaDetail: string
}

const CardList: React.FC<CardListProps> = ({ areaDetail }) => {
	const router = useRouter()
	const { queryParams, setQueryParams } = useSearchPlotMonitoring()
	const { areaType } = useAreaType()
	const [isOrderByOpen, setIsOrderByOpen] = useState<boolean>(false)
	const [selectedToggle, setSelectedToggle] = useState<string>('')
	const [isSelectedToggleOpen, setIsSelectedToggleOpen] = useState<boolean>(false)
	const { t } = useTranslation(['default', 'plot-monitoring'])
	const { ref, inView } = useInView({})

	const filterSearchPlot = useMemo(() => {
		const filter: GetSearchPlotDtoIn = {
			activityId: queryParams.activityId || undefined,
			year: queryParams.year,
			registrationAreaType: areaType,
			provinceCode: queryParams.provinceCode || undefined,
			districtCode: queryParams.districtCode || undefined,
			subDistrictCode: queryParams.subDistrictCode || undefined,
			lossType: typeof queryParams.lossType === 'number' ? Number(queryParams.lossType) : undefined,
			insuredType: typeof queryParams.insuredType === 'number' ? Number(queryParams.insuredType) : undefined,
			publicStatus: typeof queryParams.publicStatus === 'number' ? Number(queryParams.publicStatus) : undefined,
			riskType: queryParams.riskType || undefined,
			riceType: queryParams.riceType || undefined,
			detailType: queryParams.detailType || undefined,
			orderBy: queryParams.orderBy || OrderBy.ActivityId,
			limit: queryParams.limit || LimitCardsPerPage,
		}
		return filter
	}, [queryParams, areaType])

	const {
		data: searchPlotData,
		isLoading: isSearchPlotDataLoading,
		status,
		error,
		fetchNextPage,
		isFetchingNextPage,
		hasNextPage,
	} = useInfiniteQuery({
		queryKey: ['getSearchPlot', filterSearchPlot],
		queryFn: async ({ pageParam }: { pageParam: number }) => {
			try {
				const response = await service.plotMonitoring.getSearchPlot({
					...filterSearchPlot,
					offset: pageParam * (queryParams.limit || LimitCardsPerPage),
				})
				return response
			} catch (error) {
				console.log('error: ', error)
			}
		},
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages) => {
			const nextPage = lastPage?.data?.length ? allPages.length : undefined
			return nextPage
		},
		enabled: !!queryParams.provinceCode,
	})

	useEffect(() => {
		if (inView && hasNextPage) {
			fetchNextPage()
		}
	}, [inView, hasNextPage, fetchNextPage])

	const handleSelectOrderBy = useCallback(
		(event: SelectChangeEvent) => {
			setQueryParams({ ...queryParams, orderBy: event.target.value })
		},
		[queryParams, setQueryParams],
	)

	const handleSelectedToggle = useCallback(
		(_event: React.MouseEvent<HTMLElement>, newSelectedValue: string | null) => {
			if (!newSelectedValue) {
				setIsSelectedToggleOpen(false)
				setSelectedToggle('')
			} else {
				setIsSelectedToggleOpen(true)
			}
			setSelectedToggle((prev) => newSelectedValue || prev)
		},
		[],
	)

	return (
		<div
			className={classNames(
				'box-border flex h-full flex-1 flex-col gap-4 bg-white px-4 max-lg:rounded max-lg:bg-gray-light lg:gap-3 lg:overflow-hidden lg:px-6 lg:pt-16',
				{
					hidden: areaDetail !== 'cards',
				},
			)}
		>
			<div className='flex h-full flex-col'>
				<Box className='flex flex-col gap-2 py-2 lg:hidden'>
					<ToggleButtonGroup
						size='small'
						exclusive
						color='primary'
						className='flex gap-2 [&_button]:rounded [&_button]:py-2 [&_button]:pl-3 [&_button]:pr-2.5'
						value={selectedToggle}
						onChange={handleSelectedToggle}
					>
						<ToggleButton
							className={clsx('flex items-center gap-2 border-2 border-solid text-base', {
								'border-primary bg-gray-light': selectedToggle === 'filter',
								'border-transparent': selectedToggle !== 'filter',
							})}
							value={'filter'}
						>
							<span className='p-0 text-md font-medium text-black'>{t('filter')}</span>
							{selectedToggle === 'filter' && isSelectedToggleOpen ? (
								<ExpandLess className='h-6 w-6 text-black' />
							) : (
								<ExpandMore className='h-6 w-6 text-black' />
							)}
						</ToggleButton>
						<ToggleButton
							className={clsx('flex items-center gap-2 border-2 border-solid text-base', {
								'border-primary bg-gray-light font-semibold': selectedToggle === 'order',
								'border-transparent font-medium text-gray-dark2': selectedToggle !== 'order',
							})}
							value={'order'}
						>
							<span className='p-0 text-md font-medium text-black'>
								{t('orderBy', { ns: 'plot-monitoring' })}
							</span>
							{selectedToggle === 'order' && isSelectedToggleOpen ? (
								<ExpandLess className='h-6 w-6 text-black' />
							) : (
								<ExpandMore className='h-6 w-6 text-black' />
							)}
						</ToggleButton>
					</ToggleButtonGroup>
					<Box
						className={classNames('flex flex-col rounded bg-white px-3', {
							'max-lg:hidden': selectedToggle !== 'filter' || !isSelectedToggleOpen,
						})}
					>
						<FilterButtonMain />
					</Box>
					<Box
						className={classNames('flex flex-col rounded bg-white p-3', {
							'max-lg:hidden': selectedToggle !== 'order' || !isSelectedToggleOpen,
						})}
					>
						<FormControl>
							<RadioGroup
								className='[&_.MuiTypography-root]:text-sm [&_.MuiTypography-root]:font-medium [&_.MuiTypography-root]:text-black-dark'
								name='radio-order'
								value={queryParams.orderBy}
								onChange={handleSelectOrderBy}
							>
								<FormControlLabel
									className={classNames('m-0 flex gap-2 p-1', {
										'[&_.MuiTypography-root]:!font-semibold':
											queryParams.orderBy === OrderBy.ActivityId,
									})}
									value={OrderBy.ActivityId}
									control={<Radio className='p-0 [&_*>svg]:h-6 [&_*>svg]:w-6' />}
									label={t('referenceCode', { ns: 'plot-monitoring' })}
								/>
								<FormControlLabel
									className={classNames('m-0 flex gap-2 p-1', {
										'[&_.MuiTypography-root]:!font-semibold':
											queryParams.orderBy === OrderBy.PredictedRiceArea,
									})}
									value={OrderBy.PredictedRiceArea}
									control={<Radio className='p-0 [&_*>svg]:h-6 [&_*>svg]:w-6' />}
									label={t('riceCultivationArea')}
								/>
								<FormControlLabel
									className={classNames('m-0 flex gap-2 p-1', {
										'[&_.MuiTypography-root]:!font-semibold':
											queryParams.orderBy === OrderBy.LossPredicted,
									})}
									value={OrderBy.LossPredicted}
									control={<Radio className='p-0 [&_*>svg]:h-6 [&_*>svg]:w-6' />}
									label={t('riceLossPredictedArea', { ns: 'plot-monitoring' })}
								/>
							</RadioGroup>
						</FormControl>
					</Box>
				</Box>
				<Box className='flex items-center justify-between border-0 border-solid border-gray max-lg:border-t lg:border-b'>
					<div className='flex items-center'>
						<Typography className='p-2.5 text-base font-semibold text-black max-lg:py-0 max-lg:pt-3'>
							{searchPlotData?.pages[0]?.total && searchPlotData?.pages[0]?.total > 0 ? t('all') : ''}
						</Typography>
						<span className='p-2.5 text-base font-semibold text-black-light max-lg:py-0 max-lg:pt-3'>
							{searchPlotData?.pages[0]?.total && searchPlotData?.pages[0]?.total > 0
								? searchPlotData?.pages[0]?.total
								: ''}
						</span>
					</div>
					<FormControl
						variant='standard'
						className={classNames('min-w-[120px] rounded-lg max-lg:hidden', {
							'bg-[#0000001A]': isOrderByOpen,
						})}
					>
						<Select
							id='orderBy'
							className='flex gap-3 px-2 [&_svg]:right-2 [&_svg]:top-[calc(50%-9px)] [&_svg]:h-[18px] [&_svg]:w-[18px] [&_svg]:text-md [&_svg]:text-black'
							IconComponent={ExpandMore}
							SelectDisplayProps={{
								className:
									'bg-transparent py-1 pr-8 text-base font-medium text-black [&_.MuiListItemText-root]:m-0 [&_.MuiListItemIcon-root]:hidden',
							}}
							MenuProps={{
								className:
									'[&_.MuiPaper-root]:w-[200px] [&_.MuiPaper-root]:!left-auto [&_.MuiPaper-root]:!top-[245px] [&_.MuiPaper-root]:right-10 [&_.MuiPaper-root]:border [&_.MuiPaper-root]:border-solid [&_.MuiPaper-root]:border-gray',
							}}
							value={queryParams.orderBy}
							onChange={handleSelectOrderBy}
							onOpen={() => setIsOrderByOpen(true)}
							onClose={() => setIsOrderByOpen(false)}
							disableUnderline
						>
							<MenuItem
								className={classNames('flex items-center gap-2 bg-transparent p-2', {
									'!bg-gray-light2': queryParams.orderBy === OrderBy.ActivityId,
								})}
								value={OrderBy.ActivityId}
							>
								<ListItemIcon className='!min-w-4'>
									{queryParams.orderBy === OrderBy.ActivityId && (
										<Check className='h-4 w-4 font-normal text-black' />
									)}
								</ListItemIcon>
								<ListItemText
									className={classNames(
										'[&_span]:text-base [&_span]:font-normal [&_span]:text-black',
										{
											'[&_span]:!font-medium': queryParams.orderBy === OrderBy.ActivityId,
										},
									)}
									primary={t('referenceCode', { ns: 'plot-monitoring' })}
								/>
							</MenuItem>
							<MenuItem
								className={classNames('flex items-center gap-2 bg-transparent p-2', {
									'!bg-gray-light2': queryParams.orderBy === OrderBy.PredictedRiceArea,
								})}
								value={OrderBy.PredictedRiceArea}
							>
								<ListItemIcon className='!min-w-4'>
									{queryParams.orderBy === OrderBy.PredictedRiceArea && (
										<Check className='h-4 w-4 font-normal text-black' />
									)}
								</ListItemIcon>
								<ListItemText
									className={classNames(
										'[&_span]:text-base [&_span]:font-normal [&_span]:text-black',
										{
											'[&_span]:!font-medium': queryParams.orderBy === OrderBy.PredictedRiceArea,
										},
									)}
									primary={t('riceCultivationArea')}
								/>
							</MenuItem>
							<MenuItem
								className={classNames('flex items-center gap-2 bg-transparent p-2', {
									'!bg-gray-light2': queryParams.orderBy === OrderBy.LossPredicted,
								})}
								value={OrderBy.LossPredicted}
							>
								<ListItemIcon className='!min-w-4'>
									{queryParams.orderBy === OrderBy.LossPredicted && (
										<Check className='h-4 w-4 font-normal text-black' />
									)}
								</ListItemIcon>
								<ListItemText
									className={classNames(
										'[&_span]:text-base [&_span]:font-normal [&_span]:text-black',
										{
											'[&_span]:!font-medium': queryParams.orderBy === OrderBy.LossPredicted,
										},
									)}
									primary={t('riceLossArea', { ns: 'plot-monitoring' })}
								/>
							</MenuItem>
						</Select>
					</FormControl>
				</Box>
				<Box className='h-full'>
					<Box className='h-full overflow-auto lg:!h-[calc(100vh-261px)]'>
						{isSearchPlotDataLoading ? (
							<div className='flex h-[calc(100vh-261px)] flex-col items-center justify-center bg-transparent lg:h-full lg:bg-white'>
								<CircularProgress size={80} color='primary' />
							</div>
						) : searchPlotData?.pages[0]?.data?.length === 0 ? (
							<Box className='flex h-full items-center justify-center'>
								<span className='text-base font-normal text-gray-dark2'>
									{t('noSearchResultsFound', { ns: 'plot-monitoring' })}
								</span>
							</Box>
						) : (
							<div className='flex flex-col gap-2 py-3 lg:gap-3 lg:py-2'>
								{searchPlotData?.pages.map((details) =>
									details?.data?.map((detail, index) => {
										const geom = detail.geometry

										if (geom && geom.type == 'MultiPolygon') {
											detail.geometry = toPolygon(detail.geometry)
										}

										if (details.data?.length === index + 1) {
											return (
												<div
													className='border-0 border-solid border-gray lg:border-b'
													ref={ref}
													key={detail.order}
												>
													<Button
														className='w-full rounded p-0 hover:bg-transparent lg:rounded-lg'
														onClick={() =>
															router.push(
																`${AppPath.PlotMonitoringResult}/${detail.activityId}?count=${detail.count}`,
															)
														}
													>
														<CardDetail detail={detail} />
													</Button>
												</div>
											)
										}
										return (
											<div
												className='border-0 border-solid border-gray lg:border-b'
												key={detail.order}
											>
												<Button
													className='w-full rounded p-0 hover:bg-transparent lg:rounded-lg'
													onClick={() =>
														router.push(
															`${AppPath.PlotMonitoringResult}/${detail.activityId}?count=${detail.count}`,
														)
													}
												>
													<CardDetail detail={detail} />
												</Button>
											</div>
										)
									}),
								)}
								{isFetchingNextPage && (
									<Box className='w-full'>
										<LinearProgress />
									</Box>
								)}
							</div>
						)}
					</Box>
				</Box>
			</div>
		</div>
	)
}

export default CardList
