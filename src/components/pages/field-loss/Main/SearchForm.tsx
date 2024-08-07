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
import React, { ChangeEvent, ReactNode, useMemo, useState } from 'react'
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

interface OptionType {
	name: string
	id: string
	searchType: string
}

interface HistoryType {
	[key: string]: OptionType[]
}

interface SearchFormProps {
	selectedOption: OptionType | null
	startDate: Dayjs | null
	endDate: Dayjs | null
	setSeletedOption: React.Dispatch<React.SetStateAction<OptionType | null>>
	setStartDate: React.Dispatch<React.SetStateAction<Dayjs | null>>
	setEndDate: React.Dispatch<React.SetStateAction<Dayjs | null>>
}

// const options: OptionType[] = [
// 	{ name: 'นครราชสีมา', id: '30', searchType: 'favorite' },
// 	{ name: 'สุพรรณบุรี', id: '72', searchType: 'favorite' },
// 	{ name: 'อ่างทอง', id: '15', searchType: 'favorite' },
// 	{ name: 'ร้อยเอ็ด', id: '45', searchType: 'favorite' },
// 	{ name: 'บุรีรัมย์', id: '31', searchType: 'favorite' },
// 	{ name: 'นครศรีธรรมราช', id: '80', searchType: 'history' },
// 	{ name: 'พระนครศรีอยุธยา', id: '14', searchType: 'history' },
// 	{ name: 'กำแพงเพชร', id: '62', searchType: 'history' },
// ]

const SearchForm: React.FC<SearchFormProps> = ({
	selectedOption,
	startDate,
	endDate,
	setSeletedOption,
	setStartDate,
	setEndDate,
}) => {
	const queryClient = useQueryClient()
	const [isFocused, setIsFocused] = useState<boolean>(false)
	const [inputValue, setInputValue] = useState<string>('')

	const [history, setHistory] = useLocalStorage<HistoryType>('fieldLoss.history', {})
	const [favorite, setFavorite] = useLocalStorage<HistoryType>('fieldLoss.favorite', {})
	//const [optionList, setOptionList] = useState<OptionType[]>(options)
	const { data: session } = useSession()
	const userId = session?.user.id ?? null

	const { data: searchData, isLoading: isSearchDataLoading } = useQuery({
		queryKey: ['getSearchAdminPoly', inputValue],
		queryFn: () => service.fieldLoss.getSearchAdminPoly({ keyword: inputValue }),
		enabled: !!inputValue,
	})

	//console.log('searchData', searchData?.data)
	// console.log('status', status)
	// console.log('fetchStatus', fetchStatus)

	const combinedOptions = useMemo(() => {
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

	//console.log('combinedOptions', combinedOptions)

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

	const handleSelectOption = (_event: ChangeEvent<{}>, newSelectedValue: OptionType | null) => {
		setSeletedOption(newSelectedValue)
		if (userId) {
			const favoriteList = favorite[userId] || []
			const historyList = history[userId] || []
			if (newSelectedValue) {
				const isFavoriteDuplicate = favoriteList.map((item) => item.id).includes(newSelectedValue.id)
				const isHistoryDuplicate = historyList.map((item) => item.id).includes(newSelectedValue.id)
				if (!isHistoryDuplicate && !isFavoriteDuplicate) {
					if (historyList.length === 5) {
						historyList.pop()
						historyList.unshift(newSelectedValue)
						setHistory({
							...history,
							[userId]: historyList.map((history) => ({ ...history, searchType: 'history' })),
						})
					} else if (historyList.length < 5) {
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

	//console.log('selectedOption', selectedOption)

	const handleSelectFavorite = (event: React.MouseEvent, selectedFavorite: OptionType | null) => {
		event.stopPropagation()
		if (userId) {
			const favoriteList = favorite[userId] || []
			const historyList = history[userId] || []
			if (selectedFavorite) {
				const isFavoriteDuplicate = favoriteList.map((item) => item.id).includes(selectedFavorite.id)
				const isHistoryDuplicate = historyList.map((item) => item.id).includes(selectedFavorite.id)
				if (!isFavoriteDuplicate) {
					if (favoriteList.length === 5) return
					if (favoriteList.length < 5) {
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

	// console.log('startDate', startDate?.toISOString().split('T')[0])
	// console.log('endDate', endDate?.toISOString().split('T')[0])

	return (
		<>
			<Paper className='mx-4 flex gap-[6px] bg-[#D9E0EB] p-[6px]'>
				<FormControl fullWidth variant='standard' className='h-[40px] rounded-[8px] bg-white'>
					<Autocomplete
						blurOnSelect
						options={combinedOptions.sort((a, b) => a.searchType.localeCompare(b.searchType))}
						groupBy={(option) => (!inputValue ? option.searchType : '')}
						getOptionLabel={(option) => option.name}
						isOptionEqualToValue={(option, value) => option.id === value.id}
						PaperComponent={({ children }) => (
							<Paper className='border-[1px] border-solid border-gray'>{children}</Paper>
						)}
						inputValue={inputValue}
						value={selectedOption}
						onInputChange={(_event, newInputValue) => setInputValue(newInputValue)}
						onChange={handleSelectOption}
						renderInput={(params) => {
							const { InputLabelProps, InputProps, ...otherParams } = params
							return (
								<Input
									{...otherParams}
									{...params.InputProps}
									className='flex h-[40px] items-center gap-[8px] px-[12px] py-[8px] [&_.MuiInputAdornment-positionEnd]:m-0 [&_.MuiInputAdornment-positionStart]:m-0 [&_.MuiInputBase-input]:p-0'
									startAdornment={
										<InputAdornment position='start'>
											<SearchOutlined className='h-[24px] w-[24px] text-black' />
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
														<IconButton className='p-[4px]' onClick={handleClear}>
															<Clear className='h-[24px] w-[24px] text-[#7A7A7A]' />
														</IconButton>
													)}
												</div>
											) : (
												inputValue && (
													<IconButton
														className='p-[4px]'
														onClick={(event) => handleSelectFavorite(event, selectedOption)}
													>
														<StarBorder
															className={clsx('h-[24px] w-[24px]', {
																'text-[#DCBA09]': combinedOptions
																	.filter(
																		(option) => option.searchType === 'favorite',
																	)
																	.map((option) => option.id)
																	.includes(selectedOption?.id || ''),
																'text-black': !combinedOptions
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
									className='border-t-[2px] border-solid border-transparent border-t-black'
								>
									<div className='sticky top-[-8px] bg-primary px-[10px] py-[4px] text-gray'>
										{'ผลลัพธ์การค้นหา'}
									</div>
									<ul className='p-0'>{params.children}</ul>
								</li>
							) : (
								<li
									key={params.key}
									className='border-t-[2px] border-solid border-transparent border-t-black'
								>
									<div className='sticky top-[-8px] bg-primary px-[10px] py-[4px] text-gray'>
										{params.group === 'favorite' ? 'พื้นที่ในรายการโปรด' : 'ค้นหาล่าสุด'}
									</div>
									<ul className='p-0'>{params.children}</ul>
								</li>
							)
						}}
						renderOption={(props, option, { inputValue }) => {
							const { key, ...optionProps } = props
							const matches = match(option.name, inputValue, { insideWords: true })
							const parts = parse(option.name, matches)
							console.log('selectedOption', selectedOption?.name)
							console.log('inputValue', inputValue)
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
										<div className='flex'>
											<IconButton size='small'>
												<StarBorder className='text-[#DCBA09]' />
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
												className=''
												size='small'
												onClick={(event) => handleRemoveFavorite(event, option.id)}
											>
												<Remove />
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
												className=''
												size='small'
												onClick={(event) => handleRemoveHistory(event, option.id)}
											>
												<Clear />
											</IconButton>
										)}
									</div>
								</li>
							)
						}}
					/>
				</FormControl>
				{/* <Button
					className='flex h-[40px] shrink-0 gap-[8px] bg-white py-[8px] pl-[12px] pr-[16px] text-sm font-medium text-black [&_.MuiButton-startIcon]:m-0'
					variant='contained'
					startIcon={<GroupAddOutlined className='h-[24px] w-[24px]' />}
				>
					เพิ่มผู้ใช้งาน
				</Button> */}
				<div className='h-[40px] w-[250px] rounded-lg bg-white [&_.MuiStack-root]:p-0'>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DemoContainer
							components={['DatePicker', 'DatePicker']}
							sx={{ display: 'flex', flexDirection: 'row', width: '250px' }}
						>
							<div className='flex flex-row [&_.MuiInputBase-root>input]:h-[40px] [&_.MuiInputBase-root>input]:py-0 [&_.MuiInputBase-root]:h-[40px]'>
								<Box className='[&_.MuiOutlinedInput-notchedOutline]:border-none'>
									<DatePicker
										//label='Start Date'
										value={startDate}
										onChange={(newValue) => setStartDate(newValue)}
									/>
								</Box>
								<Box className='[&_.MuiOutlinedInput-notchedOutline]:border-none'>
									<DatePicker
										//label='End Date'
										value={endDate}
										onChange={(newValue) => setEndDate(newValue)}
										sx={{ margin: 0 }}
									/>
								</Box>
							</div>
						</DemoContainer>
					</LocalizationProvider>
				</div>
				<Button
					className='h-[40px] min-w-[40px] bg-white p-[8px] text-sm font-medium text-black [&_.MuiButton-startIcon]:m-0'
					variant='contained'
					color='primary'
					startIcon={<Fullscreen className='h-[24px] w-[24px]' />}
				></Button>
			</Paper>
		</>
	)
}

export default SearchForm
