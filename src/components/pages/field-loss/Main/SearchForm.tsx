'use client'

import {
	Autocomplete,
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
import { SearchOutlined, GroupAddOutlined, SystemUpdateAlt, StarBorder, Clear, Remove } from '@mui/icons-material'
import React, { ChangeEvent, ReactNode, useMemo, useState } from 'react'
import clsx from 'clsx'
import service from '@/api'
import { useQuery } from '@tanstack/react-query'
import { useLocalStorage } from '@/hook/local-storage'
import { useSession } from 'next-auth/react'

interface OptionType {
	name: string
	id: string
	searchType: string
}

interface HistoryType {
	[key: string]: OptionType[]
}

const options: OptionType[] = [
	{ name: 'นครราชสีมา', id: '30', searchType: 'favorite' },
	{ name: 'สุพรรณบุรี', id: '72', searchType: 'favorite' },
	{ name: 'อ่างทอง', id: '15', searchType: 'favorite' },
	{ name: 'ร้อยเอ็ด', id: '45', searchType: 'favorite' },
	{ name: 'บุรีรัมย์', id: '31', searchType: 'favorite' },
	{ name: 'นครศรีธรรมราช', id: '80', searchType: 'history' },
	{ name: 'พระนครศรีอยุธยา', id: '14', searchType: 'history' },
	{ name: 'กำแพงเพชร', id: '62', searchType: 'history' },
]

const SearchForm = () => {
	const [isFocused, setIsFocused] = useState<boolean>(false)
	const [inputValue, setInputValue] = useState<string>('')
	const [selectedOption, setSeletedOption] = useState<OptionType | null>(null)
	const [history, setHistory] = useLocalStorage<HistoryType>('fieldLoss.history', {})
	const [favorite, setFavorite] = useLocalStorage<HistoryType>('fieldLoss.favorite', {})
	const [optionList, setOptionList] = useState<OptionType[]>(options)
	const { data: session } = useSession()
	const userId = session?.user.id ?? null

	const combinedOptions = useMemo(() => {
		if (userId) {
			const historyList = history[userId] || []
			const favoriteList = favorite[userId] || []
			return [...historyList, ...favoriteList]
		}
		return []
	}, [history, favorite, userId])

	const highlightText = (text: string, highlight: string): ReactNode => {
		const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
		return (
			<>
				{parts.map((part, index) =>
					part.toLowerCase() === highlight.toLowerCase() ? (
						<span key={index} className='font-semibold text-primary'>
							{part}
						</span>
					) : (
						part
					),
				)}
			</>
		)
	}

	const handleSelectOption = (_event: ChangeEvent<{}>, newSelectedValue: OptionType | null) => {
		setSeletedOption(newSelectedValue)
		if (userId) {
			const historyList = history[userId] || []
			if (newSelectedValue) {
				const isDuplicate = historyList.map((item) => item.id).includes(newSelectedValue.id)
				if (!isDuplicate) {
					if (historyList.length === 5) {
						historyList.shift()
						historyList.push(newSelectedValue)
						setHistory({
							...history,
							[userId]: historyList.map((history) => ({ ...history, searchType: 'history' })),
						})
					} else if (historyList.length < 5) {
						historyList.push(newSelectedValue)
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
			if (selectedFavorite) {
				const isDuplicate = favoriteList.map((item) => item.id).includes(selectedFavorite.id)
				if (!isDuplicate) {
					if (favoriteList.length === 5) return
					if (favoriteList.length < 5) {
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
			<Paper className='flex gap-[6px] bg-[#D9E0EB] p-[6px]'>
				<FormControl fullWidth variant='standard' className='h-[40px] rounded-[8px] bg-white'>
					<Autocomplete
						blurOnSelect
						options={combinedOptions.sort((a, b) => a.searchType.localeCompare(b.searchType))}
						groupBy={(option) => (!inputValue ? option.searchType : '')}
						getOptionLabel={(option) => option.name}
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
															className={clsx('h-[24px] w-[24px] text-black', {
																'text-[#DCBA09]': combinedOptions
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
								<li key={params.key}>
									<div className='sticky top-[-8px] bg-primary px-[10px] py-[4px] text-gray'>
										{'ผลลัพธ์การค้นหา'}
									</div>
									<ul className='p-0'>{params.children}</ul>
								</li>
							) : (
								<li key={params.key}>
									<div className='sticky top-[-8px] bg-primary px-[10px] py-[4px] text-gray'>
										{params.group === 'favorite' ? 'พื้นที่ในรายการโปรด' : 'ค้นหาล่าสุด'}
									</div>
									<ul className='p-0'>{params.children}</ul>
								</li>
							)
						}}
						renderOption={(props, option) => {
							return option.searchType === 'favorite' ? (
								<li {...props} key={`favorite-${option.id}`}>
									<div className='flex w-full items-center justify-between'>
										<div className='flex'>
											<IconButton size='small'>
												<StarBorder className='text-[#DCBA09]' />
											</IconButton>
											<Typography>{highlightText(option.name, inputValue)}</Typography>
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
								<li {...props} key={`history-${option.id}`}>
									<div className='flex w-full items-center justify-between'>
										<Typography>{highlightText(option.name, inputValue)}</Typography>
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
				<Button
					className='flex h-[40px] shrink-0 gap-[8px] bg-white py-[8px] pl-[12px] pr-[16px] text-sm font-medium text-black [&_.MuiButton-startIcon]:m-0'
					variant='contained'
					startIcon={<GroupAddOutlined className='h-[24px] w-[24px]' />}
				>
					เพิ่มผู้ใช้งาน
				</Button>
				<Button
					className='flex h-[40px] shrink-0 gap-[8px] bg-white py-[8px] pl-[12px] pr-[16px] text-sm font-medium text-black [&_.MuiButton-startIcon]:m-0'
					variant='contained'
					color='primary'
					startIcon={<SystemUpdateAlt className='h-[24px] w-[24px]' />}
				>
					นำเข้าผู้ใช้งาน
				</Button>
			</Paper>
		</>
	)
}

export default SearchForm
