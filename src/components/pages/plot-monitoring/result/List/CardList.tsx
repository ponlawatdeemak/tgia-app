'use client'

import { ResponseLanguage } from '@/api/interface'
import useResponsive from '@/hook/responsive'
import useAreaType from '@/store/area-type'
import useAreaUnit from '@/store/area-unit'
import {
	Box,
	Button,
	FormControl,
	LinearProgress,
	ListItemIcon,
	ListItemText,
	MenuItem,
	Select,
	SelectChangeEvent,
	Typography,
} from '@mui/material'
import { ExpandMore, Check } from '@mui/icons-material'
import classNames from 'classnames'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSearchPlotMonitoring from '../Main/context'
import { useInfiniteQuery, useQuery, QueryFunctionContext } from '@tanstack/react-query'
import { GetSearchPlotDtoIn } from '@/api/plot-monitoring/dto-in.dto'
import service from '@/api'
import { SortType } from '@/enum'
import { GetSearchPlotDtoOut } from '@/api/plot-monitoring/dto-out.dto'
import CardDetail from '../Card'
import { GetSearchUMDtoOut } from '@/api/um/dto-out.dto'
import { LastPage } from '@mui/icons-material'
import { useInView } from 'react-intersection-observer'
import { AppPath } from '@/config/app'
import { useRouter } from 'next/navigation'

const LimitCardsPerPage = 10

interface CardListProps {
	areaDetail: string
}

const CardList: React.FC<CardListProps> = ({ areaDetail }) => {
	const router = useRouter()
	const { queryParams } = useSearchPlotMonitoring()
	const { isDesktop } = useResponsive()
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const [orderBy, setOrderBy] = useState<string>('รหัสอ้างอิง')
	const [isOrderByOpen, setIsOrderByOpen] = useState<boolean>(false)
	const { t, i18n } = useTranslation(['default', 'field-loss'])
	const language = i18n.language as keyof ResponseLanguage
	const { ref, inView } = useInView({})

	const filterSearchPlot = useMemo(() => {
		const filter: GetSearchPlotDtoIn = {
			activityId: queryParams.activityId || undefined,
			year: queryParams.year,
			provinceCode: queryParams.provinceCode || undefined,
			districtCode: queryParams.districtCode || undefined,
			subDistrictCode: queryParams.subDistrictCode || undefined,
			lossType: typeof queryParams.lossType === 'number' ? Number(queryParams.lossType) : undefined,
			insuredType: queryParams.insuredType || undefined,
			publicStatus: queryParams.publicStatus || undefined,
			riskType: queryParams.riskType || undefined,
			riceType: queryParams.riceType || undefined,
			detailType: queryParams.detailType || undefined,
			orderBy: queryParams.orderBy,
			limit: queryParams.limit,
		}
		return filter
	}, [queryParams])

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
			//console.log({ lastPage, allPages })
			const nextPage = lastPage?.data?.length ? allPages.length : undefined
			return nextPage
		},
	})

	// const {
	// 	data: searchPlotData,
	// 	isLoading: isSearchPlotDataLoading,
	// 	status,
	// 	error,
	// 	fetchNextPage,
	// 	isFetchingNextPage,
	// 	hasNextPage,
	// } = useInfiniteQuery({
	// 	queryKey: ['todos'],
	// 	queryFn: async ({ pageParam }: { pageParam: number }) => {
	// 		try {
	// 			const response = await service.um.getSearchUM({
	// 				keyword: '',
	// 				firstName: '',
	// 				sortField: '',
	// 				sortOrder: SortType.ASC,
	// 				respLang: '',
	// 				offset: pageParam * 10,
	// 				limit: 10,
	// 			})
	// 			return response
	// 		} catch (error) {
	// 			console.log('error: ', error)
	// 		}
	// 	},
	// 	initialPageParam: 0,
	// 	getNextPageParam: (lastPage, allPages) => {
	// 		//console.log({ lastPage, allPages })
	// 		const nextPage = lastPage?.data?.length ? allPages.length : undefined
	// 		return nextPage
	// 	},
	// })

	useEffect(() => {
		if (inView && hasNextPage) {
			//console.log('Fire')
			fetchNextPage()
		}
	}, [inView, hasNextPage, fetchNextPage])

	// if (status === 'pending') {
	// 	return <p>Loading...</p>
	// }

	// if (status === 'error') {
	// 	return <p>Error: {error.message}</p>
	// }

	const handleSelectOrderBy = (event: SelectChangeEvent) => {
		setOrderBy(event.target.value)
	}

	return (
		<div
			className={classNames(
				'box-border flex h-full flex-1 flex-col gap-4 bg-white p-4 max-lg:rounded lg:gap-3 lg:overflow-hidden lg:p-6 lg:pb-0 lg:pt-16',
				{
					'lg:hidden': areaDetail !== 'cards',
				},
			)}
		>
			<div className='flex flex-col'>
				<Box className='flex items-center justify-between border-0 border-b border-solid border-gray'>
					<div className='flex items-center'>
						<Typography className='p-2.5 text-base font-semibold text-black'>ทั้งหมด</Typography>
						<span className='p-2.5 text-base font-semibold text-black-light'>
							{searchPlotData?.pages[0]?.total}
						</span>
					</div>
					<FormControl
						variant='standard'
						className={classNames('min-w-[120px] rounded-lg', {
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
							value={orderBy}
							onChange={handleSelectOrderBy}
							onOpen={() => setIsOrderByOpen(true)}
							onClose={() => setIsOrderByOpen(false)}
							disableUnderline
						>
							<MenuItem
								className={classNames('flex items-center gap-2 bg-transparent p-2', {
									'!bg-gray-light2': orderBy === 'รหัสอ้างอิง',
								})}
								value='รหัสอ้างอิง'
							>
								<ListItemIcon className='!min-w-4'>
									{orderBy === 'รหัสอ้างอิง' && <Check className='h-4 w-4 font-normal text-black' />}
								</ListItemIcon>
								<ListItemText
									className={classNames(
										'[&_span]:text-base [&_span]:font-normal [&_span]:text-black',
										{
											'[&_span]:!font-medium': orderBy === 'รหัสอ้างอิง',
										},
									)}
									primary='รหัสอ้างอิง'
								/>
							</MenuItem>
							<MenuItem
								className={classNames('flex items-center gap-2 bg-transparent p-2', {
									'!bg-gray-light2': orderBy === 'พื้นที่ปลูกข้าว',
								})}
								value='พื้นที่ปลูกข้าว'
							>
								<ListItemIcon className='!min-w-4'>
									{orderBy === 'พื้นที่ปลูกข้าว' && (
										<Check className='h-4 w-4 font-normal text-black' />
									)}
								</ListItemIcon>
								<ListItemText
									className={classNames(
										'[&_span]:text-base [&_span]:font-normal [&_span]:text-black',
										{
											'[&_span]:!font-medium': orderBy === 'พื้นที่ปลูกข้าว',
										},
									)}
									primary='พื้นที่ปลูกข้าว'
								/>
							</MenuItem>
							<MenuItem
								className={classNames('flex items-center gap-2 bg-transparent p-2', {
									'!bg-gray-light2': orderBy === 'พื้นที่ความเสียหาย',
								})}
								value='พื้นที่ความเสียหาย'
							>
								<ListItemIcon className='!min-w-4'>
									{orderBy === 'พื้นที่ความเสียหาย' && (
										<Check className='h-4 w-4 font-normal text-black' />
									)}
								</ListItemIcon>
								<ListItemText
									className={classNames(
										'[&_span]:text-base [&_span]:font-normal [&_span]:text-black',
										{
											'[&_span]:!font-medium': orderBy === 'พื้นที่ความเสียหาย',
										},
									)}
									primary='พื้นที่ความเสียหาย'
								/>
							</MenuItem>
						</Select>
					</FormControl>
				</Box>
				<Box>
					<Box className='!h-[calc(100vh-261px)] overflow-auto'>
						<div className='flex flex-col gap-3 py-2'>
							{searchPlotData?.pages.map((details) =>
								details?.data?.map((detail, index) => {
									if (details.data?.length === index + 1) {
										return (
											<Button
												className='rounded-lg p-0 hover:bg-transparent'
												ref={ref}
												key={detail.order}
												onClick={() =>
													router.push(`${AppPath.PlotMonitoring}/result/${detail.activityId}`)
												}
											>
												<CardDetail detail={detail} />
											</Button>
										)
									}
									return (
										<Button
											className='rounded-lg p-0 hover:bg-transparent'
											key={detail.order}
											onClick={() =>
												router.push(`${AppPath.PlotMonitoring}/result/${detail.activityId}`)
											}
										>
											<CardDetail detail={detail} />
										</Button>
									)
								}),
							)}
							{isFetchingNextPage && (
								<Box className='w-full'>
									<LinearProgress />
								</Box>
							)}
						</div>
					</Box>
				</Box>
			</div>
		</div>
	)
}

export default CardList
