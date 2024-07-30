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
import React, { ChangeEvent, ReactNode, useState } from 'react'
import clsx from 'clsx'
import service from '@/api'
import { useQuery } from '@tanstack/react-query'

interface OptionType {
	title: string
	value: string
	type: string
}

const options: OptionType[] = [
	{ title: 'นครราชสีมา', value: 'นครราชสีมา', type: 'favorite' },
	{ title: 'สุพรรณบุรี', value: 'สุพรรณบุรี', type: 'favorite' },
	{ title: 'อ่างทอง', value: 'อ่างทอง', type: 'favorite' },
	{ title: 'ร้อยเอ็ด', value: 'ร้อยเอ็ด', type: 'favorite' },
	{ title: 'บุรีรัมย์', value: 'บุรีรัมย์', type: 'favorite' },
	{ title: 'นครศรีธรรมราช', value: 'นครศรีธรรมราช', type: 'history' },
	{ title: 'พระนครศรีอยุธยา', value: 'พระนครศรีอยุธยา', type: 'history' },
	{ title: 'กำแพงเพชร', value: 'กำแพงเพชร', type: 'history' },
]

const SearchForm = () => {
	//const [clicked, setClicked] = useState<boolean>(false)
	const [isFocused, setIsFocused] = useState<boolean>(false)
	const [optionList, setOptionList] = useState<OptionType[]>(options)
	const [inputValue, setInputValue] = useState<string>('')

	const handleClear = () => {
		setInputValue('')
	}

	// const { data: userData, isLoading: isUserDataLoading } = useQuery({
	// 	queryKey: ['search'],
	// 	queryFn: () => service.um.getSearch({ keyword: 'ปักธงชัย' }),
	// })

	// console.log('userData', userData)

	// const handleOpen = () => {
	// 	if (!clicked) {
	// 		setClicked(true)
	// 	}
	// }

	const handleRemove = (event: any, value: string) => {
		event.stopPropagation()
		setOptionList((prev) => prev.filter((option) => option.value !== value))
	}

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

	//console.log('inputValue', inputValue)

	return (
		<>
			<Paper className='flex gap-[6px] bg-[#D9E0EB] p-[6px]'>
				<FormControl fullWidth variant='standard' className='h-[40px] rounded-[8px] bg-white'>
					<Autocomplete
						//freeSolo
						blurOnSelect
						options={optionList}
						getOptionLabel={(option) => (typeof option === 'string' ? option : option.title)}
						groupBy={(option) => option.type}
						PaperComponent={({ children }) => (
							<Paper className='border-[1px] border-solid border-gray'>{children}</Paper>
						)}
						inputValue={inputValue}
						onInputChange={(_event, newInputValue) => setInputValue(newInputValue)}
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
													{inputValue && (
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
													)}
													<IconButton className='p-[4px]' onClick={handleClear}>
														<Clear className='h-[24px] w-[24px] text-[#7A7A7A]' />
													</IconButton>
												</div>
											) : (
												inputValue && (
													<IconButton className='p-[4px]'>
														<StarBorder className='h-[24px] w-[24px] text-black' />
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
							console.log('params', params)
							return inputValue ? (
								<li key={params.key}>
									<ul className='p-0'>{params.children}</ul>
								</li>
							) : (
								<li key={params.key}>
									<div className='sticky top-[-8px] bg-primary px-[10px] py-[4px] text-gray'>
										{params.group}
									</div>
									<ul className='p-0'>{params.children}</ul>
								</li>
							)
						}}
						renderOption={(props, option) => {
							return option.type === 'favorite' ? (
								<li {...props}>
									<div className='flex w-full items-center justify-between'>
										<div className='flex'>
											<IconButton size='small'>
												<StarBorder />
											</IconButton>
											<Typography>{highlightText(option.title, inputValue)}</Typography>
										</div>
										{!inputValue && (
											<IconButton
												className=''
												size='small'
												onClick={(event) => handleRemove(event, option.value)}
											>
												<Remove />
											</IconButton>
										)}
									</div>
								</li>
							) : (
								<li {...props}>
									<div className='flex w-full items-center justify-between'>
										<Typography>{highlightText(option.title, inputValue)}</Typography>
										{!inputValue && (
											<IconButton
												className=''
												size='small'
												onClick={(event) => handleRemove(event, option.value)}
											>
												<Clear />
											</IconButton>
										)}
									</div>
								</li>
							)
						}}
						//onOpen={handleOpen}
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
