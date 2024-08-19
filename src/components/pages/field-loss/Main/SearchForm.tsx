'use client'

import {
	Autocomplete,
	Box,
	Button,
	Divider,
	FormControl,
	IconButton,
	Input,
	InputAdornment,
	OutlinedInput,
	Paper,
	Popper,
	Typography,
} from '@mui/material'
import {
	SearchOutlined,
	GroupAddOutlined,
	SystemUpdateAlt,
	StarBorder,
	Clear,
	Remove,
	Fullscreen,
} from '@mui/icons-material'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'
import React, { ChangeEvent, ReactNode, useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import service from '@/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocalStorage } from '@/hook/local-storage'
import { useSession } from 'next-auth/react'
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { Dayjs } from 'dayjs'
import DateRangePicker from '@/components/shared/DateRangePicker'
import useResponsive from '@/hook/responsive'
import useSearchFieldLoss from './context'
import { onCapture } from '@/utils/screenshot'

interface OptionType {
	name: string
	id: string
	searchType: string
}

interface HistoryType {
	[key: string]: OptionType[]
}

interface SearchFormProps {}

const FavoriteLengthMax = 5
const HistoryLengthMax = 5

const SearchForm: React.FC<SearchFormProps> = () => {
	const queryClient = useQueryClient()
	const { isDesktop } = useResponsive()
	const { queryParams, setQueryParams } = useSearchFieldLoss()
	const [isFocused, setIsFocused] = useState<boolean>(false)
	const [isPopperOpened, setPopperOpened] = useState<boolean>(false)
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
						.map((data) => ({ ...data, searchType: 'zzz' }))
				: []
			return [...historyList, ...favoriteList, ...searchDataList]
		}
		return []
	}, [history, favorite, userId, searchData])

	// const highlightText = (text: string, highlight: string): ReactNode => {
	// 	const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
	// 	return (
	// 		<>
	// 			{parts.map((part, index) =>
	// 				part.toLowerCase() === highlight.toLowerCase() ? (
	// 					<span key={index} className='font-semibold text-primary'>
	// 						{part}
	// 					</span>
	// 				) : (
	// 					part
	// 				),
	// 			)}
	// 		</>
	// 	)
	// }

	useEffect(() => {
		console.log('provinceIdtooption', queryParams.provinceId)
		console.log('districtIdtooption', queryParams.districtId)
		const provinceOption = optionList.find((item) => parseInt(item.id) === queryParams.provinceId) || null
		console.log('optionprovinceId', provinceOption)
		const districtOption = optionList.find((item) => parseInt(item.id) === queryParams.districtId) || null
		console.log('optiondistrictId', districtOption)
		if (selectedOption?.id) {
			if (queryParams.provinceId === parseInt(selectedOption.id)) {
				console.log('setoptionDistrict')
				setSeletedOption(districtOption)
			} else {
				console.log('setoptionProvince again')
				setSeletedOption(provinceOption)
			}
		} else {
			console.log('setoptionProvince')
			setSeletedOption(provinceOption)
		}
	}, [queryParams.provinceId, queryParams.districtId])

	const handleSelectOption = (_event: ChangeEvent<{}>, newSelectedValue: OptionType | null) => {
		//setSeletedOption(newSelectedValue)
		setQueryParams({ ...queryParams, provinceId: newSelectedValue?.id ? parseInt(newSelectedValue.id) : undefined })
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
		<>
			<Paper className='mx-4 flex gap-1.5 bg-gray-dark4 p-1.5'>
				<FormControl
					fullWidth
					variant='standard'
					className={clsx('[&_.MuiInputBase-root.Mui-focused]:border-primary', {
						'[&_.MuiInputBase-root.Mui-focused]:rounded-b-none [&_.MuiInputBase-root.Mui-focused]:border-b-0':
							isPopperOpened && isDesktop,
					})}
				>
					<Autocomplete
						blurOnSelect
						options={optionList.sort((a, b) => a.searchType.localeCompare(b.searchType))}
						groupBy={(option) => (!inputValue ? option.searchType : '')}
						getOptionLabel={(option) => option.name}
						isOptionEqualToValue={(option, value) => option.id === value.id}
						PopperComponent={(props) => {
							return isDesktop ? (
								<Popper
									{...props}
									className='z-50 rounded-lg rounded-t-none border-2 border-t-0 border-solid border-primary bg-white [&_.MuiPaper-root]:rounded-t-none [&_ul]:max-h-full [&_ul]:p-0'
								>
									{props.children}
								</Popper>
							) : (
								<Popper
									{...props}
									className='z-50 h-full !w-full !translate-y-[124px] rounded-none bg-white [&_.MuiAutocomplete-listbox]:divide-x-0 [&_.MuiAutocomplete-listbox]:divide-y [&_.MuiAutocomplete-listbox]:divide-solid [&_.MuiAutocomplete-listbox]:divide-gray [&_.MuiPaper-root]:h-full [&_.MuiPaper-root]:rounded-none [&_ul]:max-h-full [&_ul]:p-0'
								>
									{props.children}
								</Popper>
							)
						}}
						//open={true}
						inputValue={inputValue}
						value={selectedOption}
						onInputChange={(_event, newInputValue) => setInputValue(newInputValue)}
						onChange={handleSelectOption}
						onOpen={() => setPopperOpened(true)}
						onClose={() => setPopperOpened(false)}
						renderInput={(params) => {
							const { InputLabelProps, InputProps, ...otherParams } = params
							return (
								<Input
									{...otherParams}
									{...params.InputProps}
									className='flex h-10 items-center gap-2 rounded-lg border-2 border-solid border-transparent bg-white px-3 py-2 [&_.MuiInputAdornment-positionEnd]:m-0 [&_.MuiInputAdornment-positionStart]:m-0 [&_.MuiInputBase-input]:p-0'
									startAdornment={
										<InputAdornment position='start'>
											<SearchOutlined className='h-6 w-6 text-black' />
										</InputAdornment>
									}
									endAdornment={
										<InputAdornment position='end'>
											{isFocused ? (
												<div className='flex items-center'>
													{/* {inputValue && (
														<IconButton className='rounded-[8px]'>
														<span className='text-sm text-[#7A7A7A]'>ล้าง</span>
														</IconButton>
														)}
														{inputValue && (
															<Divider
															orientation='vertical'
															variant='middle'
															className='mx-[4px] h-[28px] border-gray'
															flexItem
															/>
															)} */}
													{inputValue && (
														<IconButton className='p-1' onClick={handleClear}>
															<Clear className='h-6 w-6 text-gray-dark2' />
														</IconButton>
													)}
												</div>
											) : (
												inputValue && (
													<IconButton
														className='p-1'
														onClick={(event) => handleSelectFavorite(event, selectedOption)}
													>
														<StarBorder
															className={clsx('h-6 w-6', {
																'text-yellow': optionList
																	.filter(
																		(option) => option.searchType === 'favorite',
																	)
																	.map((option) => option.id)
																	.includes(selectedOption?.id || ''),
																'text-black': !optionList
																	.filter(
																		(option) => option.searchType === 'favorite',
																	)
																	.map((option) => option.id)
																	.includes(selectedOption?.id || ''),
															})}
														/>
													</IconButton>
												)
											)}
										</InputAdornment>
									}
									disableUnderline={true}
									id='standard-search'
									placeholder='จังหวัด อำเภอ ตำบล'
									onFocus={() => setIsFocused(true)}
									onBlur={() => setIsFocused(false)}
								/>
							)
						}}
						renderGroup={(params) => {
							return inputValue ? (
								<li
									key={params.key}
									className='flex flex-col gap-2 p-4 max-lg:px-6 lg:border-0 lg:border-t lg:border-solid lg:border-gray'
								>
									<div className='text-sm font-medium text-gray-dark2'>{'ผลลัพธ์การค้นหา'}</div>
									<ul className='flex flex-col gap-0 p-0 lg:gap-2 [&_li]:p-0 max-lg:[&_li]:min-h-10'>
										{params.children}
									</ul>
								</li>
							) : (
								<li
									key={params.key}
									className='flex flex-col gap-2 p-4 max-lg:px-6 lg:border-0 lg:border-t lg:border-solid lg:border-gray'
								>
									<div className='text-sm font-medium text-gray-dark2'>
										{params.group === 'favorite' ? 'พื้นที่ในรายการโปรด' : 'ค้นหาล่าสุด'}
									</div>
									<ul className='flex flex-col gap-0 p-0 lg:gap-2 [&_li]:p-0 max-lg:[&_li]:min-h-10'>
										{params.children}
									</ul>
								</li>
							)
						}}
						renderOption={(props, option, { inputValue }) => {
							const { key, ...optionProps } = props
							const matches = match(option.name, inputValue, { insideWords: true })
							const parts = parse(option.name, matches)
							return selectedOption?.name === inputValue ? (
								option === selectedOption ? (
									<li key={`selected-${key}`} {...optionProps}>
										<div className='flex w-full items-center justify-between'>
											<div>
												{parts.map((part, index) => (
													<span
														key={index}
														className={clsx('text-md', {
															'font-bold text-primary': part.highlight,
															'font-normal text-black': !part.highlight,
														})}
													>
														{part.text}
													</span>
												))}
											</div>
										</div>
									</li>
								) : null
							) : option.searchType === 'favorite' ? (
								<li key={`favorite-${key}`} {...optionProps}>
									<div className='flex w-full items-center justify-between'>
										<div className='flex items-center gap-2'>
											<IconButton className='p-0'>
												<StarBorder className='h-5 w-5 text-yellow' />
											</IconButton>
											<div>
												{parts.map((part, index) => (
													<span
														key={index}
														className={clsx('text-md', {
															'font-bold text-primary': part.highlight,
															'font-normal text-black': !part.highlight,
														})}
													>
														{part.text}
													</span>
												))}
											</div>
										</div>
										{!inputValue && (
											<IconButton
												className='p-0'
												onClick={(event) => handleRemoveFavorite(event, option.id)}
											>
												<Remove className='h-5 w-5 font-light text-gray-light4' />
											</IconButton>
										)}
									</div>
								</li>
							) : (
								<li key={`history-${key}`} {...optionProps}>
									<div className='flex w-full items-center justify-between'>
										<div>
											{parts.map((part, index) => (
												<span
													key={index}
													className={clsx('text-md', {
														'font-bold text-primary': part.highlight,
														'font-normal text-black': !part.highlight,
													})}
												>
													{part.text}
												</span>
											))}
										</div>
										{!inputValue && (
											<IconButton
												className='p-0'
												onClick={(event) => handleRemoveHistory(event, option.id)}
											>
												<Clear className='h-5 w-5 font-light text-gray-light4' />
											</IconButton>
										)}
									</div>
								</li>
							)
						}}
					/>
				</FormControl>
				<DateRangePicker />
				<Button
					className='h-10 min-w-10 bg-white p-2 text-sm font-medium text-black [&_.MuiButton-startIcon]:m-0'
					variant='contained'
					color='primary'
					startIcon={<Fullscreen className='h-6 w-6' />}
					onClick={() => onCapture()}
				></Button>
			</Paper>
		</>
	)
}

export default SearchForm
