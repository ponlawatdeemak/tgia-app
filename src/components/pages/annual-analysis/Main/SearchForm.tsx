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
import YearPicker from '../YearPicker'
import { useSearchAnnualAnalysis } from './context'

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
	const { queryParams, setQueryParams } = useSearchAnnualAnalysis()
	const [inputValue, setInputValue] = useState<string>('')
	const [selectedOption, setSeletedOption] = useState<OptionType | null>(null)
	const [history, setHistory] = useLocalStorage<HistoryType>('fieldLoss.history', {})
	const [favorite, setFavorite] = useLocalStorage<HistoryType>('fieldLoss.favorite', {})
	const { data: session } = useSession()
	const userId = session?.user.id ?? null

	const { data: searchData, isLoading: isSearchDataLoading } = useQuery({
		queryKey: ['getSearchAdminPoly', inputValue],
		queryFn: async () => {
			const res = await service.fieldLoss.getSearchAdminPoly({ keyword: inputValue })
			return res
		},
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

	useEffect(() => {
		const displaySearchOption = async () => {
			if (queryParams.provinceCode && queryParams.districtCode && queryParams.subDistrictCode) {
				try {
					const subDistrict = (
						await service.fieldLoss.getSearchAdminPoly({ id: queryParams.subDistrictCode })
					).data?.[0]
					const subDistrictOption: OptionType | null = subDistrict
						? { name: subDistrict.name, id: subDistrict.id, searchType: 'search' }
						: null
					setSeletedOption(subDistrictOption)
				} catch (error) {
					console.log('error: ', error)
				}
			} else if (queryParams.provinceCode && queryParams.districtCode) {
				try {
					const district = (await service.fieldLoss.getSearchAdminPoly({ id: queryParams.districtCode }))
						.data?.[0]
					const districtOption: OptionType | null = district
						? { name: district.name, id: district.id, searchType: 'search' }
						: null
					setSeletedOption(districtOption)
				} catch (error) {
					console.log('error: ', error)
				}
			} else if (queryParams.provinceCode) {
				try {
					const province = (await service.fieldLoss.getSearchAdminPoly({ id: queryParams.provinceCode }))
						.data?.[0]
					const provinceOption: OptionType | null = province
						? { name: province.name, id: province.id, searchType: 'search' }
						: null
					setSeletedOption(provinceOption)
				} catch (error) {
					console.log('error: ', error)
				}
			} else {
				setSeletedOption(null)
			}
		}

		displaySearchOption()
	}, [queryParams.provinceCode, queryParams.districtCode, queryParams.subDistrictCode])

	const handleSelectOption = (_event: ChangeEvent<{}>, newSelectedValue: OptionType | null) => {
		setSeletedOption(newSelectedValue)
		if (newSelectedValue?.id) {
			if (newSelectedValue.id.length === ProvinceCodeLength) {
				setQueryParams({
					...queryParams,
					provinceCode: parseInt(newSelectedValue.id),
					districtCode: undefined,
					subDistrictCode: undefined,
					layerName: 'province',
				})
			} else if (newSelectedValue.id.length === DistrictCodeLength) {
				const provinceCode = parseInt(newSelectedValue.id.substring(0, 2))
				setQueryParams({
					...queryParams,
					provinceCode: provinceCode,
					districtCode: parseInt(newSelectedValue.id),
					subDistrictCode: undefined,
					layerName: 'district',
				})
			} else if (newSelectedValue.id.length === SubDistrictCodeLength) {
				const provinceCode = parseInt(newSelectedValue.id.substring(0, 2))
				const districtCode = parseInt(newSelectedValue.id.substring(0, 4))
				setQueryParams({
					...queryParams,
					provinceCode: provinceCode,
					districtCode: districtCode,
					subDistrictCode: parseInt(newSelectedValue.id),
					layerName: 'subdistrict',
				})
			}
		}

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
	// console.log(selectedOption)
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
