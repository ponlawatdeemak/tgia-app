'use client'
import service from '@/api'
import DatePickerHorizontal from '@/components/shared/DatePickerHorizontal'
import { Box, Button, FormControl, MenuItem, Select, Tab, Tabs, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { addDays, addYears } from 'date-fns'
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import LossStatistic from './LossStatistic'
import PlantStatistic from './PlantStatistic'
import RiceStatistic from './RiceStatistic'
import { useQuery } from '@tanstack/react-query'
import { useLocalStorage } from '@/hook/local-storage'
import { useSession } from 'next-auth/react'
import { ResponseLanguage } from '@/api/interface'
import SearchFormAnnualAnalysis from './SearchForm'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useSearchAnnualAnalysis } from './context'
import { LossType, SortType } from '@/enum'
import useAreaType from '@/store/area-type'
import useResponsive from '@/hook/responsive'

interface TabPanelProps {
	children?: React.ReactNode
	index: number
	value: number
	isDesktop: boolean
}

interface OptionType {
	name: ResponseLanguage
	id: string
	searchType: string
}

interface HistoryType {
	[key: string]: OptionType[]
}

const FavoriteLengthMax = 5
const HistoryLengthMax = 5
const ProvinceCodeLength = 2
const DistrictCodeLength = 4
const SubDistrictCodeLength = 6

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, isDesktop } = props

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
		>
			{value === index && (
				<Box className={clsx('p-[24px]', { 'pt-[12px]': index === 2, 'px-0 pt-0': !isDesktop })}>
					{children}
				</Box>
			)}
		</div>
	)
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	}
}

const AnnualAnalysisMain = () => {
	const [value, setValue] = useState<number>(0)
	const { isDesktop } = useResponsive()

	const { data: session } = useSession()
	const { t, i18n } = useTranslation(['default', 'annual-analysis'])

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue)
	}

	return (
		<>
			<div className='flex flex-col justify-center'>
				<SearchFormAnnualAnalysis />
				<Box>
					{/* <div>{JSON.stringify(queryParams)}</div> */}
					{/* Tab group */}
					{isDesktop ? (
						<Box className='ml-[24px] mr-[24px]'>
							<Tabs
								variant='scrollable'
								scrollButtons='auto'
								value={value}
								onChange={handleChange}
								aria-label='basic tabs example'
								className='[&_.MuiTabs-scroller]:border-0 [&_.MuiTabs-scroller]:border-b-[1px] [&_.MuiTabs-scroller]:border-solid [&_.MuiTabs-scroller]:border-[#C2C5CC]'
							>
								<Tab label={t('farmerRegisteredArea', { ns: 'annual-analysis' })} {...a11yProps(0)} />
								<Tab label={t('riceCultivationArea', { ns: 'annual-analysis' })} {...a11yProps(1)} />
								<Tab
									label={t('damagedAreaFromDisaster', { ns: 'annual-analysis' })}
									{...a11yProps(2)}
								/>
							</Tabs>
						</Box>
					) : (
						<Box className='mt-[12px] pb-[12px]'>
							<FormControl className='h-[40px] w-full p-0'>
								<Select
									value={value}
									onChange={(e) => {
										const value = e.target.value as number
										setValue(value)
									}}
									displayEmpty
									inputProps={{ 'aria-label': 'Without label' }}
									className='mx-[16px] flex h-[40px] items-center bg-white p-0 text-md font-normal'
								>
									<MenuItem value={0}>
										{t('farmerRegisteredArea', { ns: 'annual-analysis' })}
									</MenuItem>
									<MenuItem value={1}>{t('riceCultivationArea', { ns: 'annual-analysis' })}</MenuItem>
									<MenuItem value={2}>
										{t('damagedAreaFromDisaster', { ns: 'annual-analysis' })}
									</MenuItem>
								</Select>
							</FormControl>
						</Box>
					)}

					<Box className='h-[calc(100vh-194px)] overflow-y-auto'>
						<CustomTabPanel value={value} index={0} isDesktop={isDesktop}>
							<PlantStatistic />
						</CustomTabPanel>
						<CustomTabPanel value={value} index={1} isDesktop={isDesktop}>
							<RiceStatistic />
						</CustomTabPanel>
						<CustomTabPanel value={value} index={2} isDesktop={isDesktop}>
							<LossStatistic />
						</CustomTabPanel>
					</Box>
				</Box>
			</div>
		</>
	)
}

export default AnnualAnalysisMain
