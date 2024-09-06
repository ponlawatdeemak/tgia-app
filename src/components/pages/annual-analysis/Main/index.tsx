'use client'
import service from '@/api'
import DatePickerHorizontal from '@/components/shared/DatePickerHorizontal'
import { Box, Button, Tab, Tabs, ToggleButton, ToggleButtonGroup } from '@mui/material'
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
				<Box className={clsx('p-[24px]', { 'pt-[12px]': index === 2, 'px-0': !isDesktop })}>{children}</Box>
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
	const [value, setValue] = useState(0)
	const { isDesktop } = useResponsive()

	const { data: session } = useSession()
	const { t, i18n } = useTranslation(['default', 'annual-analysis'])

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue)
	}

	// const optionList = useMemo(() => {
	// 	if (userId) {
	// 		const historyList = history[userId] || []
	// 		const favoriteList = favorite[userId] || []
	// 		const searchDataList: OptionType[] = searchData?.data
	// 			? searchData.data
	// 					.filter((data) => {
	// 						const historyIdList = historyList.map((history) => history.id)
	// 						const favoriteIdList = favoriteList.map((favorite) => favorite.id)
	// 						if (historyIdList.includes(data.id) || favoriteIdList.includes(data.id)) {
	// 							return false
	// 						} else {
	// 							return true
	// 						}
	// 					})
	// 					.map((data) => ({ ...data, id: data.id, name: data.name, searchType: 'search' }))
	// 			: []
	// 		return [...historyList, ...favoriteList, ...searchDataList]
	// 	}
	// 	return []
	// }, [history, favorite, userId, searchData])

	// const handleSelectOption = (_event: ChangeEvent<{}>, newSelectedValue: OptionType | null) => {
	// 	setSeletedOption(newSelectedValue)

	// 	if (userId) {
	// 		const favoriteList = favorite[userId] || []
	// 		const historyList = history[userId] || []
	// 		if (newSelectedValue) {
	// 			const isFavoriteDuplicate = favoriteList.map((item) => item.id).includes(newSelectedValue.id)
	// 			const isHistoryDuplicate = historyList.map((item) => item.id).includes(newSelectedValue.id)
	// 			if (!isHistoryDuplicate && !isFavoriteDuplicate) {
	// 				if (historyList.length === HistoryLengthMax) {
	// 					historyList.pop()
	// 					historyList.unshift(newSelectedValue)
	// 					setHistory({
	// 						...history,
	// 						[userId]: historyList.map((history) => ({ ...history, searchType: 'history' })),
	// 					})
	// 				} else if (historyList.length < HistoryLengthMax) {
	// 					historyList.unshift(newSelectedValue)
	// 					setHistory({
	// 						...history,
	// 						[userId]: historyList.map((history) => ({ ...history, searchType: 'history' })),
	// 					})
	// 				}
	// 			}
	// 		}
	// 	}
	// }

	// const handleSelectFavorite = (event: React.MouseEvent, selectedFavorite: OptionType | null) => {
	// 	event.stopPropagation()
	// 	if (userId) {
	// 		const favoriteList = favorite[userId] || []
	// 		const historyList = history[userId] || []
	// 		if (selectedFavorite) {
	// 			const isFavoriteDuplicate = favoriteList.map((item) => item.id).includes(selectedFavorite.id)
	// 			const isHistoryDuplicate = historyList.map((item) => item.id).includes(selectedFavorite.id)
	// 			if (!isFavoriteDuplicate) {
	// 				if (favoriteList.length === FavoriteLengthMax) return
	// 				if (favoriteList.length < FavoriteLengthMax) {
	// 					if (isHistoryDuplicate) {
	// 						const newhistoryList = historyList.filter((item) => item.id !== selectedFavorite.id)
	// 						setHistory({
	// 							...history,
	// 							[userId]: newhistoryList,
	// 						})
	// 					}
	// 					favoriteList.push(selectedFavorite)
	// 					setFavorite({
	// 						...favorite,
	// 						[userId]: favoriteList.map((favorite) => ({ ...favorite, searchType: 'favorite' })),
	// 					})
	// 				}
	// 			}
	// 		}
	// 	}
	// }

	// const handleRemoveHistory = (event: React.MouseEvent, value: string) => {
	// 	event.stopPropagation()
	// 	if (userId) {
	// 		const historyList = history[userId] || []
	// 		const newHistoryList = historyList.filter((option) => option.id !== value)
	// 		setHistory({
	// 			...history,
	// 			[userId]: newHistoryList,
	// 		})
	// 	}
	// }

	// const handleRemoveFavorite = (event: React.MouseEvent, value: string) => {
	// 	event.stopPropagation()
	// 	if (userId) {
	// 		const favoriteList = favorite[userId] || []
	// 		const newFavoriteList = favoriteList.filter((option) => option.id !== value)
	// 		setFavorite({
	// 			...favorite,
	// 			[userId]: newFavoriteList,
	// 		})
	// 	}
	// }

	// const handleClear = () => {
	// 	setInputValue('')
	// 	setSeletedOption(null)
	// }

	// const handleTypeClick = (_event: React.MouseEvent<HTMLElement>, newAlignment: LossType | null) => {
	// 	// let sortTypeField: keyof Data
	// 	// if (newAlignment) {
	// 	// 	if (newAlignment === LossType.Drought) {
	// 	// 		sortTypeField = 'droughtPredicted'
	// 	// 	} else {
	// 	// 		sortTypeField = 'floodPredicted'
	// 	// 	}
	// 	// } else {
	// 	// 	sortTypeField = 'totalPredicted'
	// 	// }
	// 	setQueryParams({})
	// }

	return (
		<>
			<div className='flex flex-col justify-center'>
				<SearchFormAnnualAnalysis />
				<Box>
					{/* <div>{JSON.stringify(queryParams)}</div> */}
					{/* Tab group */}
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
							<Tab label={t('damagedAreaFromDisaster', { ns: 'annual-analysis' })} {...a11yProps(2)} />
						</Tabs>
					</Box>
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
