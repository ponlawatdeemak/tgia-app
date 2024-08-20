'use client'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Slider from 'react-slick'
import { Button, Divider, IconButton } from '@mui/material'
import Icon from '@mdi/react'
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'
import { formatDate, getDateInRange } from '@/utils/date'
import { ResponseDto } from '@/api/interface'
import { GetCalendarDtoOut, LossPredictedType } from '@/api/calendar/dto-out.dto'
import { format } from 'date-fns'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import useSearchFieldLoss from '@/components/pages/field-loss/Main/context'

// const data = [
// 	{
// 		date: 25,
// 		month: 9,
// 	},
// 	{
// 		date: 26,
// 		month: 9,
// 	},
// 	{
// 		date: 27,
// 		month: 9,
// 	},
// 	{
// 		date: 28,
// 		month: 9,
// 	},
// 	{
// 		date: 29,
// 		month: 9,
// 	},
// 	{
// 		date: 30,
// 		month: 9,
// 	},
// 	{
// 		date: 31,
// 		month: 9,
// 	},
// 	{
// 		date: 1,
// 		month: 10,
// 	},
// 	{
// 		date: 2,
// 		month: 10,
// 	},
// 	{
// 		date: 3,
// 		month: 10,
// 	},
// 	{
// 		date: 4,
// 		month: 10,
// 	},
// 	{
// 		date: 5,
// 		month: 10,
// 	},
// 	{
// 		date: 6,
// 		month: 10,
// 	},
// 	{
// 		date: 7,
// 		month: 10,
// 	},
// 	{
// 		date: 8,
// 		month: 10,
// 	},
// 	{
// 		date: 9,
// 		month: 10,
// 	},
// 	{
// 		date: 10,
// 		month: 10,
// 	},
// 	{
// 		date: 11,
// 		month: 10,
// 	},
// 	{
// 		date: 12,
// 		month: 10,
// 	},
// 	{
// 		date: 13,
// 		month: 10,
// 	},
// 	{
// 		date: 14,
// 		month: 10,
// 	},
// 	{
// 		date: 15,
// 		month: 10,
// 	},
// ]

enum LossType {
	Drought = 'drought',
	Flood = 'flood',
	NoData = 'noData',
}

interface MappedDataType {
	[key: string]: {
		[LossType.Drought]?: LossPredictedType
		[LossType.Flood]?: LossPredictedType
		[LossType.NoData]?: boolean
	}
}

interface DatePickerHorizontalProps {
	startDate: Date
	endDate: Date
	calendarData?: ResponseDto<GetCalendarDtoOut[]>
}

const DatePickerHorizontal: React.FC<DatePickerHorizontalProps> = ({ startDate, endDate, calendarData }) => {
	const { i18n } = useTranslation()
	const { queryParams, setQueryParams } = useSearchFieldLoss()
	let monthSliderRef = useRef<Slider | null>(null)
	let dateSliderRef = useRef<Slider | null>(null)
	const [slideIndex, setSlideIndex] = useState(0)

	const settings = {
		infinite: false,
		slidesToShow: 1,
		swipeToSlide: true,
		slidesToScroll: 4,
		variableWidth: true,
		arrows: false,
	}

	const dateRanges = useMemo(() => getDateInRange(startDate, endDate), [startDate, endDate])

	const mappedData = useMemo(() => {
		const mappedData: MappedDataType = {}
		calendarData?.data?.forEach((item: GetCalendarDtoOut) => {
			if (!mappedData[item.dateTime]) {
				mappedData[item.dateTime] = {}
			}
			const lossType = item.lossType as LossType
			if (lossType === LossType.NoData) {
				mappedData[item.dateTime][lossType] = true
			} else {
				mappedData[item.dateTime][lossType] = item.lossPredicted
			}
		})
		return mappedData
	}, [calendarData])

	// const dateSliderWidth = useMemo(() => {
	// 	return document.getElementsByClassName('calendar-slider')?.[0]?.offsetWidth
	// }, [])

	const handleDateClick = (date: Date) => {
		if (queryParams.selectedDateHorizontal !== date) {
			setQueryParams({ ...queryParams, selectedDateHorizontal: date })
		} else {
			setQueryParams({ ...queryParams, selectedDateHorizontal: undefined })
		}
	}

	return (
		<div className='w-full rounded-lg bg-white p-1'>
			<div className='rounded bg-[#F5F5F5] p-1'>
				<Slider
					{...settings}
					className='slider variable-width h-[30px] [&_.slick-track]:h-[30px]'
					draggable={false}
					ref={monthSliderRef}
				>
					{dateRanges.map((date, index) => (
						<div
							key={index}
							className='flex h-[30px] items-center justify-center'
							style={{ width: '48px' }}
						>
							{(index === 0 ||
								slideIndex === index ||
								dateRanges[index - 1].getMonth() !== dateRanges[index].getMonth()) && (
								<div className='relative flex h-full'>
									<Divider
										orientation='vertical'
										variant='middle'
										flexItem
										className='border-r bg-[#C2C5CC]'
									/>
									<span className='my-auto ml-2 whitespace-nowrap text-sm text-[#7A7A7A]'>
										{formatDate(date, 'MMMM yyyy', i18n.language)}
									</span>
								</div>
							)}
						</div>
					))}
				</Slider>

				<div className='relative border border-solid border-[#D6D6D6] px-6'>
					<Slider
						{...settings}
						className='slider variable-width calendar-slider min-w-0 [&_.slick-track]:divide-x [&_.slick-track]:divide-y-0 [&_.slick-track]:divide-solid [&_.slick-track]:divide-gray'
						ref={dateSliderRef}
						afterChange={(index) => {
							setSlideIndex(index)
							monthSliderRef.current?.slickGoTo(index, true)
						}}
					>
						{dateRanges.map((date, index) => {
							const data = mappedData[format(date, 'yyyy-MM-dd')]
							const drought = data?.[LossType.Drought]
							const flood = data?.[LossType.Flood]
							const noData = data?.[LossType.NoData] || false
							return (
								<Button
									key={index}
									className={classNames(
										'!flex h-8 min-w-12 flex-col items-center justify-center gap-0.5 rounded-none bg-white p-0',
										{ '!bg-[#F5F5F5] [&_span]:!text-[#959595]': noData },
										{
											'border-2 border-solid border-primary':
												queryParams.selectedDateHorizontal === date,
										},
									)}
									onClick={() => handleDateClick(date)}
									disabled={noData}
								>
									<div className='flex items-center gap-0.5'>
										{drought && <div className='size-1.5 rounded-full bg-[#E34A33]' />}
										{flood && <div className='size-1.5 rounded-full bg-[#3182BD]' />}
									</div>
									<span className='text-xs font-medium text-black'>{date.getDate()}</span>
								</Button>
							)
						})}
					</Slider>
					<IconButton
						className='absolute bottom-0 left-0 top-0 rounded-none border-0 border-r border-solid border-gray bg-white p-0'
						onClick={() => dateSliderRef.current?.slickPrev()}
						disabled={slideIndex === 0}
					>
						<Icon
							path={mdiChevronLeft}
							size={1}
							className={classNames('text-black', {
								'text-gray': slideIndex === 0,
							})}
						/>
					</IconButton>
					<IconButton
						className='absolute bottom-0 right-0 top-0 rounded-none border-0 border-l border-solid border-gray bg-white p-0'
						onClick={() => dateSliderRef.current?.slickNext()}
						disabled={slideIndex >= dateRanges.length - 1}
					>
						<Icon
							path={mdiChevronRight}
							size={1}
							className={classNames('text-black', {
								'text-gray': slideIndex >= dateRanges.length - 1,
							})}
						/>
					</IconButton>
				</div>
			</div>
		</div>
	)
}

export default DatePickerHorizontal
