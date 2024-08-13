'use client'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Slider from 'react-slick'
import { Divider, IconButton } from '@mui/material'
import Icon from '@mdi/react'
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'
import { getDateInRange } from '@/utils/date'

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

interface DatePickerHorizontalProps {
	startDate: Date
	endDate: Date
}

const DatePickerHorizontal: React.FC<DatePickerHorizontalProps> = ({ startDate, endDate }) => {
	let monthSliderRef = useRef(null)
	let dateSliderRef = useRef(null)
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

	// const dateSliderWidth = useMemo(() => {
	// 	return document.getElementsByClassName('calendar-slider')?.[0]?.offsetWidth
	// }, [])

	return (
		<div className='w-full rounded-lg bg-white p-1'>
			<div className='rounded bg-[#F5F5F5]'>
				<Slider
					{...settings}
					className='slider variable-width px-[25px]'
					draggable={false}
					ref={(slider) => {
						monthSliderRef = slider
					}}
				>
					{dateRanges.map((date, index) => (
						<div
							key={index}
							className='flex h-[40px] items-center justify-center'
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
									<span className='my-auto ml-2 text-sm text-[#7A7A7A]'>{date.getMonth()}</span>
								</div>
							)}
						</div>
					))}
				</Slider>

				<div className='relative border border-solid border-[#D6D6D6] px-6'>
					<Slider
						{...settings}
						className='slider variable-width calendar-slider min-w-0'
						ref={(slider) => {
							dateSliderRef = slider
						}}
						afterChange={(index) => {
							setSlideIndex(index)
							monthSliderRef.slickGoTo(index, true)
						}}
					>
						{dateRanges.map((date, index) => (
							<div
								key={index}
								className='!flex h-[40px] items-center justify-center border-0 border-l border-r border-solid border-[#D6D6D6] bg-white'
								style={{ width: '48px' }}
							>
								<span className='text-xs font-medium text-black'>{date.getDate()}</span>
							</div>
						))}
					</Slider>
					{slideIndex !== 0 && (
						<IconButton
							className='absolute bottom-0 left-0 top-0 rounded-none border-0 border-r border-solid border-[#D6D6D6] bg-white p-0'
							onClick={() => dateSliderRef.slickPrev()}
						>
							<Icon path={mdiChevronLeft} size={1} className='text-black' />
						</IconButton>
					)}
					{slideIndex < dateRanges.length - 1 && (
						<IconButton
							className='absolute bottom-0 right-0 top-0 rounded-none border-0 border-l border-solid border-[#D6D6D6] bg-white p-0'
							onClick={() => dateSliderRef.slickNext()}
						>
							<Icon path={mdiChevronRight} size={1} className='text-black' />
						</IconButton>
					)}
				</div>
			</div>
		</div>
	)
}

export default DatePickerHorizontal
