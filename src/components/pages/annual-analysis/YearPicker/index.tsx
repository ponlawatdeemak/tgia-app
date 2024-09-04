'use client'
import React from 'react'

import useResponsive from '@/hook/responsive'
import { mdiCalendarMonthOutline } from '@mdi/js'
import Icon from '@mdi/react'
import { Button, Checkbox, IconButton, Menu, MenuItem } from '@mui/material'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchAnnualAnalysis } from '../Main/context'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'
import { GetLookupOutDto } from '@/api/lookup/dto-out.dto'
import { useYearPicker } from './context'
import useAreaType from '@/store/area-type'
import clsx from 'clsx'

interface YearPickerProps {}

const YearPicker: React.FC<YearPickerProps> = () => {
	const { open, setOpen } = useYearPicker()
	const { areaType } = useAreaType()
	const { queryParams, setQueryParams } = useSearchAnnualAnalysis()
	const { isDesktop } = useResponsive()
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
	const [selectedYear, setSelectedYear] = useState<number[]>([])

	const { data: yearData } = useQuery({
		queryKey: ['getLookupYears'],
		queryFn: async () => {
			const res = await service.lookup.get('years')
			return res
		},
		enabled: true,
	})

	useEffect(() => {
		if (selectedYear.length > 0) {
			setQueryParams({ ...queryParams, years: selectedYear })
		} else {
			setQueryParams({ ...queryParams, years: [] })
		}
	}, [selectedYear])

	useEffect(() => {
		setQueryParams({ ...queryParams, registrationAreaType: areaType })
	}, [areaType])

	const handleClose = () => {
		setAnchorEl(null)
		setOpen(false)
	}

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
		setOpen(!open)
	}

	const handleSelectYear = (year: number) => {
		setSelectedYear((prevSelectedYear) => {
			const updatedSelectedYear = prevSelectedYear.includes(year)
				? prevSelectedYear.filter((y) => y !== year)
				: [...prevSelectedYear, year]

			return updatedSelectedYear.sort((a, b) => a - b)
		})
	}

	const isYearSelected = (year: number) => selectedYear.includes(year)

	const formatYears = (years: number[]) => {
		if (years.length === 0) return ''

		const sortedYears = years.map(Number).sort((a, b) => a - b)
		const ranges: string[] = []

		let start = sortedYears[0]
		let end = start
		for (let i = 1; i < sortedYears.length; i++) {
			const currentYear = sortedYears[i]

			if (currentYear === end + 1) {
				end = currentYear
			} else {
				ranges.push(start === end ? `${start}` : `${start} - ${end}`)
				start = currentYear
				end = currentYear
			}
		}
		ranges.push(start === end ? `${start}` : `${start} - ${end}`)
		return ranges.join(', ')
	}

	return (
		<>
			{/* Mobile */}
			<IconButton color='secondary' className='btn-shadow lg:hidden' onClick={handleClick}>
				<Icon path={mdiCalendarMonthOutline} size={1} />
			</IconButton>

			{/* Desktop */}
			<Button
				variant='contained'
				color='secondary'
				className={clsx('hidden max-h-[40px] min-h-[40px] min-w-[200px] max-w-[200px] lg:flex', {
					'[&_.MuiButton-startIcon]:mr-0': !(selectedYear.length > 0),
					'border-2 border-solid border-primary': open,
				})}
				startIcon={<Icon path={mdiCalendarMonthOutline} size={1} />}
				onClick={handleClick}
			>
				<div className='truncate'>{selectedYear.length > 0 && formatYears(selectedYear)}</div>
			</Button>

			<Menu
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: -4,
					horizontal: 'right',
				}}
				PaperProps={{
					style: {
						width: isDesktop ? 200 : '',
						boxShadow: '0 0px 6px 0 rgb(0 0 0 / 0.2)',
					},
				}}
			>
				{yearData?.data?.map((item: GetLookupOutDto) => (
					<MenuItem
						disableRipple
						key={item.code}
						onClick={() => handleSelectYear(item.code)} // Handle year selection
					>
						<Checkbox
							color='primary'
							checked={isYearSelected(item.code)} // Check the checkbox if the year is selected
						/>
						{item.code}
					</MenuItem>
				))}
			</Menu>
		</>
	)
}

export default YearPicker
