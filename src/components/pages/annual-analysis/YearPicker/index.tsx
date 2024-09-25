'use client'
import React from 'react'

import useResponsive from '@/hook/responsive'
import { mdiCalendarMonthOutline } from '@mdi/js'
import Icon from '@mdi/react'
import { Button, Checkbox, IconButton, Menu, MenuItem } from '@mui/material'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchAnnualAnalysis, useSelectOption } from '../Main/context'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'
import { GetLookupOutDto } from '@/api/lookup/dto-out.dto'
import { useYearPicker } from './context'
import useAreaType from '@/store/area-type'
import clsx from 'clsx'
import { ResponseLanguage } from '@/api/interface'
import { FormikProps } from 'formik'

interface YearPickerProps {
	formik?: FormikProps<any>
	isFullOnMobile?: boolean
}

const YearPicker: React.FC<YearPickerProps> = ({ formik, isFullOnMobile = false }) => {
	const { open, setOpen } = useYearPicker()
	const { areaType } = useAreaType()
	const { queryParams, setQueryParams } = useSearchAnnualAnalysis()
	const { isDesktop } = useResponsive()
	const { t, i18n } = useTranslation(['default'])
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
	const [selectedYear, setSelectedYear] = useState<number[]>([])
	const language = i18n.language as keyof ResponseLanguage
	const { selectOption, setSelectOption } = useSelectOption()

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
			setSelectOption({ ...selectOption, selectedYear: formatYears(selectedYear) })
			setQueryParams({ ...queryParams, years: selectedYear })
		} else {
			setSelectOption({ ...selectOption, selectedYear: '' })
			setQueryParams({ ...queryParams, years: [] })
		}
	}, [selectedYear, language])

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

			console.log('updatedSelectedYear', updatedSelectedYear)
			formik?.setFieldValue('year', updatedSelectedYear)
			return updatedSelectedYear.sort((a, b) => a - b)
		})
	}

	const isYearSelected = (year: number) => selectedYear.includes(year)

	const formatYears = (years: number[]) => {
		if (years.length === 0) return ''

		const sortedYears = years.map(Number).sort((a, b) => a - b)
		const ranges: string[] = []

		sortedYears.forEach((year) => {
			const yearName = yearData?.data?.find((item) => {
				return item.code === year
			})
			const tmpYear = yearName ? yearName.name[language] : String(year)
			ranges.push(tmpYear)
		})
		return ranges.join(', ')
	}

	return (
		<>
			{/* Mobile */}
			{isFullOnMobile ? (
				<IconButton
					color='secondary'
					className={clsx('btn-shadow flex max-h-[40px] min-h-[40px] min-w-[40px] justify-start lg:hidden', {
						'box-border border-2 border-solid border-primary': open,
					})}
					onClick={handleClick}
				>
					<Icon path={mdiCalendarMonthOutline} size={1} />
					<div className={clsx('truncate pl-2 text-[18px]', { 'pb-[2px]': !(selectedYear.length > 0) })}>
						{selectedYear.length > 0 ? formatYears(selectedYear) : `${t('dataYear')}`}
					</div>
				</IconButton>
			) : (
				<IconButton
					color='secondary'
					className={clsx('btn-shadow max-h-[40px] min-h-[40px] min-w-[40px] max-w-[40px] lg:hidden', {
						'box-border border-2 border-solid border-primary': open,
					})}
					onClick={handleClick}
				>
					<Icon path={mdiCalendarMonthOutline} size={1} />
				</IconButton>
			)}

			{/* Desktop */}
			<Button
				variant='contained'
				color='secondary'
				className={clsx('hidden max-h-[40px] min-h-[40px] min-w-[200px] lg:flex lg:justify-start', {
					'[&_.MuiButton-startIcon]:mr-0': !(selectedYear.length > 0),
					'border-2 border-solid border-primary': open,
					'max-w-[200px]': !isFullOnMobile,
				})}
				startIcon={<Icon path={mdiCalendarMonthOutline} size={1} />}
				onClick={handleClick}
			>
				<div className={clsx('truncate', { 'pl-2': !(selectedYear.length > 0) })}>
					{selectedYear.length > 0 ? formatYears(selectedYear) : `${t('dataYear')}`}
				</div>
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
						{item.name[language]}
					</MenuItem>
				))}
			</Menu>
		</>
	)
}

export default YearPicker
