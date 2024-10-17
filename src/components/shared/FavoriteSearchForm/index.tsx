'use client'

import { Autocomplete, FormControl, IconButton, Input, InputAdornment, Paper, Popper } from '@mui/material'
import { SearchOutlined, StarBorder, Clear, Remove, Fullscreen } from '@mui/icons-material'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'
import React, { ChangeEvent, useState } from 'react'
import clsx from 'clsx'
import useResponsive from '@/hook/responsive'
import { useTranslation } from 'react-i18next'
import { ResponseLanguage } from '@/api/interface'

interface OptionType {
	name: ResponseLanguage
	id: string
	searchType: string
}

interface FavoriteSearchFormProp {
	optionList: OptionType[]
	inputValue: string
	selectedOption: OptionType | null
	setInputValue: React.Dispatch<React.SetStateAction<string>>
	handleSelectOption: (_event: ChangeEvent<{}>, newSelectedValue: OptionType | null) => void
	handleSelectFavorite: (event: React.MouseEvent, selectedFavorite: OptionType | null) => void
	handleRemoveHistory: (event: React.MouseEvent, value: string) => void
	handleRemoveFavorite: (event: React.MouseEvent, value: string) => void
	handleClear: () => void
}

const FavoriteSearchForm: React.FC<FavoriteSearchFormProp> = ({
	optionList,
	inputValue,
	selectedOption,
	setInputValue,
	handleSelectOption,
	handleSelectFavorite,
	handleRemoveHistory,
	handleRemoveFavorite,
	handleClear,
}) => {
	const { isDesktop } = useResponsive()
	const [isFocused, setIsFocused] = useState<boolean>(false)
	const [isPopperOpened, setPopperOpened] = useState<boolean>(false)
	const { t, i18n } = useTranslation(['default', 'field-loss'])
	const language = i18n.language as keyof ResponseLanguage

	return (
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
				getOptionLabel={(option) => option.name[language]}
				isOptionEqualToValue={(option, value) => option.id === value.id}
				PopperComponent={(props) => {
					return isDesktop ? (
						<Popper
							{...props}
							className='z-50 max-h-[500px] overflow-auto rounded-lg rounded-t-none border-2 border-t-0 border-solid border-primary bg-white [&_.MuiPaper-root]:rounded-t-none [&_ul]:max-h-full [&_ul]:p-0'
						>
							{props.children}
						</Popper>
					) : (
						<Popper
							{...props}
							className='z-50 h-[calc(100vh-124px)] !w-full !translate-y-[124px] rounded-none bg-white [&_.MuiAutocomplete-listbox]:divide-x-0 [&_.MuiAutocomplete-listbox]:divide-y [&_.MuiAutocomplete-listbox]:divide-solid [&_.MuiAutocomplete-listbox]:divide-gray [&_.MuiPaper-root]:h-full [&_.MuiPaper-root]:rounded-none [&_ul]:max-h-full [&_ul]:p-0'
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
															.filter((option) => option.searchType === 'favorite')
															.map((option) => option.id)
															.includes(selectedOption?.id || ''),
														'text-black': !optionList
															.filter((option) => option.searchType === 'favorite')
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
							placeholder={
								isFocused ? `${t('province')} ${t('district')} ${t('subDistrict')}` : t('thailand')
							}
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
							<div className='text-sm font-medium text-gray-dark2'>{t('searchResults')}</div>
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
								{params.group === 'favorite' ? t('favoriteAreas') : t('recentSearches')}
							</div>
							<ul className='flex flex-col gap-0 p-0 lg:gap-2 [&_li]:p-0 max-lg:[&_li]:min-h-10'>
								{params.children}
							</ul>
						</li>
					)
				}}
				renderOption={(props, option, { inputValue }) => {
					const { key, ...optionProps } = props
					const matches = match(option.name[language], inputValue, { insideWords: true })
					const parts = parse(option.name[language], matches)
					return selectedOption?.name[language] === inputValue ? (
						option.id === selectedOption.id ? (
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
							<div className='flex w-full items-start justify-between'>
								<div className='flex items-start gap-2'>
									<IconButton className='mt-1 p-0'>
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
										className='mt-1 p-0'
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
	)
}

export default FavoriteSearchForm
