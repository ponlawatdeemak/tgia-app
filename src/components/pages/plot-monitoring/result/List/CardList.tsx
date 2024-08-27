'use client'

import { ResponseLanguage } from '@/api/interface'
import useResponsive from '@/hook/responsive'
import useAreaType from '@/store/area-type'
import useAreaUnit from '@/store/area-unit'
import { Box, CircularProgress, Typography } from '@mui/material'
import classNames from 'classnames'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSearchPlotMonitoring from '../Main/context'
import { useInfiniteQuery, useQuery, QueryFunctionContext } from '@tanstack/react-query'
import { GetSearchPlotDtoIn } from '@/api/plot-monitoring/dto-in.dto'
import service from '@/api'
import InfiniteScroll from 'react-infinite-scroll-component'
import { SortType } from '@/enum'
import { GetSearchPlotDtoOut } from '@/api/plot-monitoring/dto-out.dto'
import CardDetail from '../Card'

interface Item {
	id: number
	name: string
}

interface queryParams {
	keyword: string
	firstName: string
	sortField: string
	sortOrder: SortType
	respLang: string
	limit: number
}

interface CardListProps {
	areaDetail: string
}

const CardList: React.FC<CardListProps> = ({ areaDetail }) => {
	const { queryParams } = useSearchPlotMonitoring()
	const { isDesktop } = useResponsive()
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['default', 'field-loss'])
	const language = i18n.language as keyof ResponseLanguage

	const [items, setItems] = useState<GetSearchPlotDtoOut[]>([])
	const [hasMore, setHasMore] = useState(true)
	const [index, setIndex] = useState(2)

	// const filterSearchPlot = useMemo(() => {
	// 	const filter: GetSearchPlotDtoIn = {
	// 		activityId: queryParams.activityId || undefined,
	// 		year: queryParams.year,
	// 		provinceCode: queryParams.provinceCode || undefined,
	// 		districtCode: queryParams.districtCode || undefined,
	// 		subDistrictCode: queryParams.subDistrictCode || undefined,
	// 		lossType: queryParams.lossType || undefined,
	// 		insuredType: queryParams.insuredType || undefined,
	// 		publicStatus: queryParams.publicStatus || undefined,
	// 		riskType: queryParams.riskType || undefined,
	// 		riceType: queryParams.riceType || undefined,
	// 		detailType: queryParams.detailType || undefined,
	// 		orderBy: queryParams.orderBy,
	// 		offset: queryParams.offset,
	// 		limit: queryParams.limit || 2,
	// 	}
	// 	return filter
	// }, [queryParams])

	// const {
	// 	data: searchPlotData,
	// 	isLoading: isSearchPlotDataLoading,
	// 	error,
	// 	fetchNextPage,
	// 	hasNextPage,
	// 	isFetching,
	// 	isFetchingNextPage,
	// 	status,
	// } = useInfiniteQuery({
	// 	queryKey: ['getSearchPlot', filterSearchPlot],
	// 	queryFn: () => service.plotMonitoring.getSearchPlot(filterSearchPlot),
	// 	initialPageParam: 2,
	// 	getNextPageParam: (lastPage, pages) => lastPage.dataTotal?.total,
	// })

	useEffect(() => {
		const initialSearchPlotData = async () => {
			try {
				const response = await service.plotMonitoring.getSearchPlot({
					activityId: queryParams.activityId,
					year: queryParams.year,
					provinceCode: queryParams.provinceCode,
					districtCode: queryParams.districtCode,
					subDistrictCode: queryParams.subDistrictCode,
					offset: 0,
					limit: 10,
				})
				setItems(response.data || [])
			} catch (error) {
				console.log('error: ', error)
			}
		}
		initialSearchPlotData()
	}, [])

	const fetchSearchPlotData = async () => {
		try {
			const response = await service.plotMonitoring.getSearchPlot({
				activityId: queryParams.activityId,
				year: queryParams.year,
				provinceCode: queryParams.provinceCode,
				districtCode: queryParams.districtCode,
				subDistrictCode: queryParams.subDistrictCode,
				offset: parseInt(`${index}0`),
				limit: 10,
			})
			setItems((prevItems) => [...prevItems, ...(response.data || [])])
			response.data?.length || 0 > 0 ? setHasMore(true) : setHasMore(false)
		} catch (error) {
			console.log('error: ', error)
		}
		setIndex((prevIndex) => prevIndex + 1)
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
			<div className='flex flex-col gap-2'>
				<Typography className='text-lg font-semibold text-black-dark lg:text-md'>CardList</Typography>
				<Box>
					<InfiniteScroll
						dataLength={items.length}
						next={fetchSearchPlotData}
						hasMore={hasMore}
						loader={<h4>Loading...</h4>}
					>
						<div className='container'>
							<div className='row flex flex-col gap-3 py-2'>
								{items &&
									items.map((item, index) => {
										return <CardDetail />
									})}
							</div>
						</div>
					</InfiniteScroll>
				</Box>
			</div>
		</div>
	)
}

export default CardList
