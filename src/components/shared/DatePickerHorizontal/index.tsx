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
	const [slideIndex, setSlideIndex] = useState<number>(0)
	const [slidesToShow, setSlidesToShow] = useState<number>(0)

	const settings = {
		infinite: false,
		slidesToShow: 16,
		swipeToSlide: true,
		slidesToScroll: 2,
		arrows: false,
		responsive: [
			{
				breakpoint: 1919,
				settings: {
					slidesToShow: 15,
				},
			},
			{
				breakpoint: 1365,
				settings: {
					slidesToShow: 10,
				},
			},
		],
	}

	useEffect(() => {
		if (dateSliderRef.current) {
			const slidesToShowValue = (dateSliderRef.current as any).innerSlider.props.slidesToShow
			setSlidesToShow(slidesToShowValue)
		}
	}, [dateSliderRef.current, slideIndex])

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
		<div className='rounded-lg bg-white p-1'>
			<div className='rounded bg-[#F5F5F5] p-1'>
				<div className='px-6'>
					<Slider
						{...settings}
						className='slider variable-width left-[-26px] h-[30px] border-0 border-x border-solid border-transparent [&_.slick-track]:m-0 [&_.slick-track]:h-[30px]'
						draggable={false}
						ref={monthSliderRef}
					>
						{dateRanges.map((date, index) => {
							return (
								<div
									key={index}
									className='box-border flex h-[30px] min-w-12 items-center justify-center border-0 border-l border-solid border-transparent'
								>
									{(index === 0 ||
										slideIndex === index ||
										(dateRanges[index - 1].getMonth() !== dateRanges[index].getMonth() &&
											index >= slideIndex)) && (
										<div
											className={classNames('relative left-[25px] flex h-full', {
												'!left-[-1px]': index === 0 || slideIndex === index,
											})}
										>
											<Divider
												orientation='vertical'
												variant='middle'
												flexItem
												className='border-r bg-[#C2C5CC]'
											/>
											<span className='my-auto ml-2 whitespace-nowrap text-sm text-[#7A7A7A]'>
												{formatDate(date, 'MMM yyyy', i18n.language)}
											</span>
										</div>
									)}
								</div>
							)
						})}
					</Slider>
				</div>

				<div className='relative px-6 outline outline-1 outline-gray'>
					<Slider
						ref={dateSliderRef}
						{...settings}
						className='slider variable-width calendar-slider min-w-0 border-0 border-x border-solid border-gray [&_.slick-track]:m-0'
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
										'!flex h-8 min-w-12 flex-col items-center justify-center gap-0.5 rounded-none border-0 border-l border-solid border-gray bg-white p-0',
										{ '!bg-[#F5F5F5] [&_span]:!text-[#959595]': noData },
										{
											'border-l-0 !bg-primary [&_span]:text-white':
												queryParams.selectedDateHorizontal === date,
											'border-l-0': index === slideIndex,
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
						className='absolute bottom-0 left-0 top-0 rounded-none bg-white p-0'
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
						className='absolute bottom-0 right-0 top-0 rounded-none bg-white p-0'
						onClick={() => dateSliderRef.current?.slickNext()}
						disabled={slideIndex >= dateRanges.length - 1}
					>
						<Icon
							path={mdiChevronRight}
							size={1}
							className={classNames('text-black', {
								'text-gray': slideIndex >= dateRanges.length - slidesToShow,
							})}
						/>
					</IconButton>
				</div>
			</div>
		</div>
	)
}

export default DatePickerHorizontal
