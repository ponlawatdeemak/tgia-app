'use client'
import service from '@/api'
import { Box, Button, Tab, Tabs, Paper } from '@mui/material'
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import FavoriteSearchForm from '@/components/shared/FavoriteSearchForm'
import { useQuery } from '@tanstack/react-query'
import { useLocalStorage } from '@/hook/local-storage'
import { useSession } from 'next-auth/react'
import { ResponseLanguage } from '@/api/interface'
import DateRangePicker from '@/components/shared/DateRangePicker'
import { Fullscreen } from '@mui/icons-material'
import { onCapture } from '@/utils/screenshot'
import YearPicker from './YearPicker'

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

const SearchFormAnnualAnalysis = () => {
	const [inputValue, setInputValue] = useState<string>('')
	const [selectedOption, setSeletedOption] = useState<OptionType | null>(null)
	const [history, setHistory] = useLocalStorage<HistoryType>('fieldLoss.history', {})
	const [favorite, setFavorite] = useLocalStorage<HistoryType>('fieldLoss.favorite', {})
	const { data: session } = useSession()
	const userId = session?.user.id ?? null

	const { data: searchData, isLoading: isSearchDataLoading } = useQuery({
		queryKey: ['getSearchAdminPoly', inputValue],
		queryFn: () => service.fieldLoss.getSearchAdminPoly({ keyword: inputValue }),
		enabled: !!inputValue,
	})

	const optionList = useMemo(() => {
		if (userId) {
			const historyList = history[userId] || []
			const favoriteList = favorite[userId] || []
			const searchDataList: OptionType[] = searchData?.data
				? searchData.data
						.filter((data) => {
							const historyIdList = historyList.map((history) => history.id)
							const favoriteIdList = favoriteList.map((favorite) => favorite.id)
							if (historyIdList.includes(data.id) || favoriteIdList.includes(data.id)) {
								return false
							} else {
								return true
							}
						})
						.map((data) => ({ ...data, id: data.id, name: data.name, searchType: 'search' }))
				: []
			return [...historyList, ...favoriteList, ...searchDataList]
		}
		return []
	}, [history, favorite, userId, searchData])

	const handleSelectOption = (_event: ChangeEvent<{}>, newSelectedValue: OptionType | null) => {
		setSeletedOption(newSelectedValue)

		if (userId) {
			const favoriteList = favorite[userId] || []
			const historyList = history[userId] || []
			if (newSelectedValue) {
				const isFavoriteDuplicate = favoriteList.map((item) => item.id).includes(newSelectedValue.id)
				const isHistoryDuplicate = historyList.map((item) => item.id).includes(newSelectedValue.id)
				if (!isHistoryDuplicate && !isFavoriteDuplicate) {
					if (historyList.length === HistoryLengthMax) {
						historyList.pop()
						historyList.unshift(newSelectedValue)
						setHistory({
							...history,
							[userId]: historyList.map((history) => ({ ...history, searchType: 'history' })),
						})
					} else if (historyList.length < HistoryLengthMax) {
						historyList.unshift(newSelectedValue)
						setHistory({
							...history,
							[userId]: historyList.map((history) => ({ ...history, searchType: 'history' })),
						})
					}
				}
			}
		}
	}

	const handleSelectFavorite = (event: React.MouseEvent, selectedFavorite: OptionType | null) => {
		event.stopPropagation()
		if (userId) {
			const favoriteList = favorite[userId] || []
			const historyList = history[userId] || []
			if (selectedFavorite) {
				const isFavoriteDuplicate = favoriteList.map((item) => item.id).includes(selectedFavorite.id)
				const isHistoryDuplicate = historyList.map((item) => item.id).includes(selectedFavorite.id)
				if (!isFavoriteDuplicate) {
					if (favoriteList.length === FavoriteLengthMax) return
					if (favoriteList.length < FavoriteLengthMax) {
						if (isHistoryDuplicate) {
							const newhistoryList = historyList.filter((item) => item.id !== selectedFavorite.id)
							setHistory({
								...history,
								[userId]: newhistoryList,
							})
						}
						favoriteList.push(selectedFavorite)
						setFavorite({
							...favorite,
							[userId]: favoriteList.map((favorite) => ({ ...favorite, searchType: 'favorite' })),
						})
					}
				}
			}
		}
	}

	const handleRemoveHistory = (event: React.MouseEvent, value: string) => {
		event.stopPropagation()
		if (userId) {
			const historyList = history[userId] || []
			const newHistoryList = historyList.filter((option) => option.id !== value)
			setHistory({
				...history,
				[userId]: newHistoryList,
			})
		}
	}

	const handleRemoveFavorite = (event: React.MouseEvent, value: string) => {
		event.stopPropagation()
		if (userId) {
			const favoriteList = favorite[userId] || []
			const newFavoriteList = favoriteList.filter((option) => option.id !== value)
			setFavorite({
				...favorite,
				[userId]: newFavoriteList,
			})
		}
	}

	const handleClear = () => {
		setInputValue('')
		setSeletedOption(null)
	}
	return (
		<Paper className='mx-4 flex gap-1.5 bg-gray-dark4 p-1.5'>
			<FavoriteSearchForm
				optionList={optionList}
				inputValue={inputValue}
				selectedOption={selectedOption}
				setInputValue={setInputValue}
				handleSelectOption={handleSelectOption}
				handleSelectFavorite={handleSelectFavorite}
				handleRemoveHistory={handleRemoveHistory}
				handleRemoveFavorite={handleRemoveFavorite}
				handleClear={handleClear}
			/>
			<YearPicker />
			<Button
				className='h-10 min-w-10 bg-white p-2 text-sm font-medium text-black [&_.MuiButton-startIcon]:m-0'
				variant='contained'
				color='primary'
				startIcon={<Fullscreen className='h-6 w-6' />}
				onClick={() => onCapture()}
			></Button>
		</Paper>
	)
}

export default SearchFormAnnualAnalysis
