'use client'

import { Autocomplete, Box, Button, FormControl, Input, InputAdornment, OutlinedInput, Paper } from '@mui/material'
import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'
import { useTranslation } from 'react-i18next'
import { ResponseLanguage } from '@/api/interface'
import useSearchPlotMonitoring from './context'
import { GetLookupOutDto } from '@/api/lookup/dto-out.dto'
import { CalendarMonthOutlined, Check, ExpandMore } from '@mui/icons-material'
import classNames from 'classnames'
import useResponsive from '@/hook/responsive'
import { mdiPencilOutline, mdiFileSearchOutline } from '@mdi/js'
import Icon from '@mdi/react'
import useSearchForm from '../../Main/context'
import { useRouter } from 'next/navigation'
import { AppPath } from '@/config/app'
import { useMap } from '@/components/common/map/context/map'

interface PlotMonitoringSearchFormProps {
	mapViewRef?: any
}

const PlotMonitoringSearchForm: React.FC<PlotMonitoringSearchFormProps> = ({ mapViewRef }) => {
	const router = useRouter()
	const { isDesktop } = useResponsive()
	const { setOpen } = useSearchForm()
	const { queryParams, setQueryParams } = useSearchPlotMonitoring()
	const { t, i18n } = useTranslation(['default', 'plot-monitoring'])
	const { setExtent } = useMap()
	const language = i18n.language as keyof ResponseLanguage

	const [inputActivityId, setInputActivityId] = useState('')
	const activityIdRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		setInputActivityId(queryParams?.activityId ? queryParams.activityId.toString() : '')
	}, [isDesktop])

	const { data: provinceLookupData, isLoading: isProvinceDataLoading } = useQuery({
		queryKey: ['getPlotMonitoringProvince'],
		queryFn: () => service.lookup.get('provinces'),
	})

	const selectedProvince = useMemo(() => {
		return provinceLookupData?.data?.find((province) => province.code === queryParams.provinceCode)
	}, [provinceLookupData, queryParams.provinceCode])

	const { data: districtLookupData, isLoading: isDistricDataLoading } = useQuery({
		queryKey: ['getPlotMonitoringDistrict', queryParams.provinceCode],
		queryFn: () => service.lookup.get(`districts/${queryParams.provinceCode}`),
		enabled: !!queryParams.provinceCode,
	})

	const selectedDistrict = useMemo(() => {
		return districtLookupData?.data?.find((district) => district.code === queryParams.districtCode)
	}, [districtLookupData, queryParams.districtCode])

	const { data: subDistrictLookupData, isLoading: isSubDistricDataLoading } = useQuery({
		queryKey: ['getPlotMonitoringSubDistrict', queryParams.districtCode],
		queryFn: () => service.lookup.get(`sub-districts/${queryParams.districtCode}`),
		enabled: !!queryParams.districtCode,
	})

	const selectedSubDistrict = useMemo(() => {
		return subDistrictLookupData?.data?.find((subDistrict) => subDistrict.code === queryParams.subDistrictCode)
	}, [subDistrictLookupData, queryParams.subDistrictCode])

	const { data: yearLookupData, isLoading: isYearDataLoading } = useQuery({
		queryKey: ['getPlotMonitoringYear'],
		queryFn: () => service.lookup.get('years'),
	})

	useEffect(() => {
		const displayMapExtent = async () => {
			let adminPolyCode = null
			switch (true) {
				case !!queryParams.subDistrictCode:
					adminPolyCode = queryParams.subDistrictCode
					break
				case !!queryParams.districtCode:
					adminPolyCode = queryParams.districtCode
					break
				case !!queryParams.provinceCode:
					adminPolyCode = queryParams.provinceCode
					break
				default:
					adminPolyCode = null
			}

			try {
				if (adminPolyCode === null) return

				const extentMapData = (await service.fieldLoss.getExtentAdminPoly({ id: adminPolyCode })).data
				if (extentMapData?.extent) {
					setExtent(extentMapData?.extent)
				}
			} catch (error) {
				console.log('error zoom extent: ', error)
			}
		}

		displayMapExtent()
	}, [queryParams.provinceCode, queryParams.districtCode, queryParams.subDistrictCode])

	const handleSelectProvince = useCallback(
		(_event: ChangeEvent<{}>, newSelectedValue: GetLookupOutDto | null, AutocompleteCloseReason: string) => {
			if (AutocompleteCloseReason === 'selectOption') {
				if (newSelectedValue) {
					setQueryParams({
						...queryParams,
						provinceCode: newSelectedValue.code,
						districtCode: undefined,
						subDistrictCode: undefined,
					})
					router.push(`${AppPath.PlotMonitoringResult}?provinceCode=${newSelectedValue.code}`)
				}
			}
		},
		[queryParams, setQueryParams],
	)

	const handleSelectDistrict = useCallback(
		(_event: ChangeEvent<{}>, newSelectedValue: GetLookupOutDto | null, AutocompleteCloseReason: string) => {
			if (AutocompleteCloseReason === 'selectOption') {
				if (newSelectedValue) {
					setQueryParams({ ...queryParams, districtCode: newSelectedValue.code, subDistrictCode: undefined })
				}
			} else if (AutocompleteCloseReason === 'clear') {
				setQueryParams({ ...queryParams, districtCode: undefined, subDistrictCode: undefined })
			}
		},
		[queryParams, setQueryParams],
	)

	const handleSelectSubDistrict = useCallback(
		(_event: ChangeEvent<{}>, newSelectedValue: GetLookupOutDto | null, AutocompleteCloseReason: string) => {
			if (AutocompleteCloseReason === 'selectOption') {
				if (newSelectedValue) {
					setQueryParams({ ...queryParams, subDistrictCode: newSelectedValue.code })
				}
			} else if (AutocompleteCloseReason === 'clear') {
				setQueryParams({ ...queryParams, subDistrictCode: undefined })
			}
		},
		[queryParams, setQueryParams],
	)

	const handleSelectYear = useCallback(
		(_event: ChangeEvent<{}>, newSelectedValue: GetLookupOutDto | null) => {
			if (newSelectedValue) {
				setQueryParams({ ...queryParams, year: newSelectedValue.code })
			}
		},
		[queryParams, setQueryParams],
	)

	const handleChangeActivityIdInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value
		const numericValue = inputValue.replace(/[^0-9]/g, '')
		setInputActivityId(numericValue)
	}, [])

	const handleSubmitActivityId = useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			setQueryParams({ ...queryParams, activityId: inputActivityId ? parseInt(inputActivityId) : undefined })
			if (activityIdRef.current) {
				activityIdRef.current.blur()
			}
		},
		[inputActivityId, queryParams, setQueryParams],
	)

	const handleBlurActivityId = useCallback(
		(event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
			event.preventDefault()
			setQueryParams({ ...queryParams, activityId: inputActivityId ? parseInt(inputActivityId) : undefined })
		},
		[inputActivityId, queryParams, setQueryParams],
	)

	return (
		<Paper className='mx-3 flex gap-1.5 bg-gray-dark4 p-1.5 lg:mx-4'>
			{isDesktop ? (
				<>
					<FormControl
						fullWidth
						variant='standard'
						className='[&_.MuiAutocomplete-hasClearIcon>.MuiInputBase-root]:pr-[68px] [&_.MuiAutocomplete-hasClearIcon>div>div>button]:text-black [&_.MuiInputBase-root.Mui-focused]:border-primary'
					>
						<Autocomplete
							className='[&_.MuiAutocomplete-endAdornment]:right-2.5 [&_.MuiAutocomplete-endAdornment]:flex [&_.MuiAutocomplete-endAdornment]:!h-full [&_.MuiAutocomplete-endAdornment]:items-center [&_.MuiAutocomplete-endAdornment]:gap-0.5'
							slotProps={{
								popper: {
									className: '!top-1.5 [&_ul>li]:p-0 aria-selected:[&_ul>li]:!bg-gray-light2',
								},
								paper: {
									className: 'border border-solid border-gray',
								},
								popupIndicator: {
									className: 'h-6 m-0 p-0 [&_svg]:w-6 [&_svg]:h-6',
								},
								clearIndicator: {
									className: 'hidden w-6 h-6 m-0 p-0.5 [&_svg]:w-5 [&_svg]:h-5',
								},
							}}
							renderOption={(props, option, { inputValue }) => {
								const { key, ...optionProps } = props
								return (
									<li key={key} {...optionProps}>
										<div className='flex w-full items-center gap-2 p-2'>
											<Box className='flex h-4 min-w-4 items-center justify-center'>
												{option.name[language] === inputValue && (
													<Check className='h-4 w-4 font-normal text-black' />
												)}
											</Box>
											<span
												className={classNames('text-base font-normal text-black', {
													'!font-medium': option.name[language] === inputValue,
												})}
											>
												{option.name[language]}
											</span>
										</div>
									</li>
								)
							}}
							popupIcon={<ExpandMore />}
							options={provinceLookupData?.data || []}
							getOptionLabel={(option) => option.name[language]}
							isOptionEqualToValue={(option, value) => option.code === value.code}
							value={selectedProvince || null}
							onChange={handleSelectProvince}
							renderInput={(params) => {
								const { InputLabelProps, InputProps, ...otherParams } = params
								return (
									<Input
										{...otherParams}
										{...params.InputProps}
										className='h-10 rounded-lg border-2 border-solid border-transparent bg-white py-2 pl-3 pr-[42px] [&_.MuiInputBase-input]:p-0 [&_input]:text-md [&_input]:font-medium [&_input]:text-black'
										disableUnderline={true}
										id='provinceCode'
										placeholder={t('allProvinces')}
									/>
								)
							}}
							disabled={isProvinceDataLoading}
						/>
					</FormControl>
					<FormControl
						fullWidth
						variant='standard'
						className='[&_.MuiAutocomplete-hasClearIcon>.MuiInputBase-root]:pr-[68px] [&_.MuiAutocomplete-hasClearIcon>div>div>button]:text-black [&_.MuiInputBase-root.Mui-focused]:border-primary'
					>
						<Autocomplete
							className='[&_.MuiAutocomplete-endAdornment]:right-2.5 [&_.MuiAutocomplete-endAdornment]:flex [&_.MuiAutocomplete-endAdornment]:!h-full [&_.MuiAutocomplete-endAdornment]:items-center [&_.MuiAutocomplete-endAdornment]:gap-0.5'
							slotProps={{
								popper: {
									className: '!top-1.5 [&_ul>li]:p-0 aria-selected:[&_ul>li]:!bg-gray-light2',
								},
								paper: {
									className: 'border border-solid border-gray',
								},
								popupIndicator: {
									className: 'h-6 m-0 p-0 [&_svg]:w-6 [&_svg]:h-6',
								},
								clearIndicator: {
									className: 'w-6 h-6 m-0 p-0.5 [&_svg]:w-5 [&_svg]:h-5',
								},
							}}
							renderOption={(props, option, { inputValue }) => {
								const { key, ...optionProps } = props
								return (
									<li key={key} {...optionProps}>
										<div className='flex w-full items-center gap-2 p-2'>
											<Box className='flex h-4 min-w-4 items-center justify-center'>
												{option.name[language] === inputValue && (
													<Check className='h-4 w-4 font-normal text-black' />
												)}
											</Box>
											<span
												className={classNames('text-base font-normal text-black', {
													'!font-medium': option.name[language] === inputValue,
												})}
											>
												{option.name[language]}
											</span>
										</div>
									</li>
								)
							}}
							popupIcon={<ExpandMore />}
							options={districtLookupData?.data || []}
							getOptionLabel={(option) => option.name[language]}
							isOptionEqualToValue={(option, value) => option.code === value.code}
							value={selectedDistrict || null}
							onChange={handleSelectDistrict}
							renderInput={(params) => {
								const { InputLabelProps, InputProps, ...otherParams } = params
								return (
									<Input
										{...otherParams}
										{...params.InputProps}
										className='h-10 rounded-lg border-2 border-solid border-transparent bg-white py-2 pl-3 pr-[42px] [&_.MuiInputBase-input]:p-0 [&_input]:text-md [&_input]:font-medium [&_input]:text-black'
										disableUnderline={true}
										id='districtCode'
										placeholder={t('allDistricts')}
									/>
								)
							}}
							disabled={isDistricDataLoading || !queryParams.provinceCode}
						/>
					</FormControl>
					<FormControl
						fullWidth
						variant='standard'
						className='[&_.MuiAutocomplete-hasClearIcon>.MuiInputBase-root]:pr-[68px] [&_.MuiAutocomplete-hasClearIcon>div>div>button]:text-black [&_.MuiInputBase-root.Mui-focused]:border-primary'
					>
						<Autocomplete
							className='[&_.MuiAutocomplete-endAdornment]:right-2.5 [&_.MuiAutocomplete-endAdornment]:flex [&_.MuiAutocomplete-endAdornment]:!h-full [&_.MuiAutocomplete-endAdornment]:items-center [&_.MuiAutocomplete-endAdornment]:gap-0.5'
							slotProps={{
								popper: {
									className: '!top-1.5 [&_ul>li]:p-0 aria-selected:[&_ul>li]:!bg-gray-light2',
								},
								paper: {
									className: 'border border-solid border-gray',
								},
								popupIndicator: {
									className: 'h-6 m-0 p-0 [&_svg]:w-6 [&_svg]:h-6',
								},
								clearIndicator: {
									className: 'w-6 h-6 m-0 p-0.5 [&_svg]:w-5 [&_svg]:h-5',
								},
							}}
							renderOption={(props, option, { inputValue }) => {
								const { key, ...optionProps } = props
								return (
									<li key={key} {...optionProps}>
										<div className='flex w-full items-center gap-2 p-2'>
											<Box className='flex h-4 min-w-4 items-center justify-center'>
												{option.name[language] === inputValue && (
													<Check className='h-4 w-4 font-normal text-black' />
												)}
											</Box>
											<span
												className={classNames('text-base font-normal text-black', {
													'!font-medium': option.name[language] === inputValue,
												})}
											>
												{option.name[language]}
											</span>
										</div>
									</li>
								)
							}}
							popupIcon={<ExpandMore />}
							options={subDistrictLookupData?.data || []}
							getOptionLabel={(option) => option.name[language]}
							isOptionEqualToValue={(option, value) => option.code === value.code}
							value={selectedSubDistrict || null}
							onChange={handleSelectSubDistrict}
							renderInput={(params) => {
								const { InputLabelProps, InputProps, ...otherParams } = params
								return (
									<Input
										{...otherParams}
										{...params.InputProps}
										className='h-10 rounded-lg border-2 border-solid border-transparent bg-white py-2 pl-3 pr-[42px] [&_.MuiInputBase-input]:p-0 [&_input]:text-md [&_input]:font-medium [&_input]:text-black'
										disableUnderline={true}
										id='subDistrict'
										placeholder={t('allSubDistricts')}
									/>
								)
							}}
							disabled={isSubDistricDataLoading || !queryParams.districtCode}
						/>
					</FormControl>
					<FormControl
						fullWidth
						variant='standard'
						className='[&_.MuiAutocomplete-hasClearIcon>.MuiInputBase-root]:pr-[68px] [&_.MuiAutocomplete-hasClearIcon>div>div>button]:text-black [&_.MuiInputBase-root.Mui-focused]:border-primary'
					>
						<Autocomplete
							className='[&_.MuiAutocomplete-endAdornment]:right-2.5 [&_.MuiAutocomplete-endAdornment]:flex [&_.MuiAutocomplete-endAdornment]:!h-full [&_.MuiAutocomplete-endAdornment]:items-center [&_.MuiAutocomplete-endAdornment]:gap-0.5'
							slotProps={{
								popper: {
									className: '!top-1.5 [&_ul>li]:p-0 aria-selected:[&_ul>li]:!bg-gray-light2',
								},
								paper: {
									className: 'border border-solid border-gray',
								},
								popupIndicator: {
									className: 'h-6 m-0 p-0 [&_svg]:w-6 [&_svg]:h-6',
								},
								clearIndicator: {
									className: 'hidden w-6 h-6 m-0 p-0.5 [&_svg]:w-5 [&_svg]:h-5',
								},
							}}
							renderOption={(props, option, { inputValue }) => {
								const { key, ...optionProps } = props
								return (
									<li key={key} {...optionProps}>
										<div className='flex w-full items-center gap-2 p-2'>
											<Box className='flex h-4 min-w-4 items-center justify-center'>
												{option.name[language] === inputValue && (
													<Check className='h-4 w-4 font-normal text-black' />
												)}
											</Box>
											<span
												className={classNames('text-base font-normal text-black', {
													'!font-medium': option.name[language] === inputValue,
												})}
											>
												{option.name[language]}
											</span>
										</div>
									</li>
								)
							}}
							popupIcon={<ExpandMore />}
							options={yearLookupData?.data || []}
							getOptionLabel={(option) => option.name[language]}
							isOptionEqualToValue={(option, value) => option.code === value.code}
							value={yearLookupData?.data?.find((year) => year.code === queryParams.year) || null}
							onChange={handleSelectYear}
							renderInput={(params) => {
								const { InputLabelProps, InputProps, ...otherParams } = params
								return (
									<Input
										{...otherParams}
										{...params.InputProps}
										className='h-10 rounded-lg border-2 border-solid border-transparent bg-white py-2 pl-3 pr-[42px] [&_.MuiInputBase-input]:p-0 [&_input]:text-md [&_input]:font-medium [&_input]:text-black'
										startAdornment={
											<InputAdornment position='start' className='mr-1 h-6 w-6'>
												<CalendarMonthOutlined className='h-6 w-6 text-black' />
											</InputAdornment>
										}
										disableUnderline={true}
										id='year'
										placeholder={t('dataYear')}
									/>
								)
							}}
							disabled={isYearDataLoading}
						/>
					</FormControl>
				</>
			) : (
				<Box className='flex w-full flex-col gap-3'>
					<Button
						className='flex h-10 w-full items-center justify-start gap-2 rounded bg-white px-3 py-2 shadow-lg'
						onClick={() => setOpen(true)}
					>
						<Icon path={mdiPencilOutline} className='h-6 w-6 font-light text-black' />
						<span className='text-base font-semibold text-black'>
							{`${selectedSubDistrict ? `${language === 'th' ? `${t('subDistrict')}` : ''}${selectedSubDistrict.name[language]} ` : ''}${selectedDistrict ? `${language === 'th' ? `${t('district')}` : ''}${selectedDistrict.name[language]} ` : ''}${selectedProvince ? selectedProvince.name[language] : ''}`}
						</span>
					</Button>
					<Box className='flex items-center gap-1.5'>
						<form
							noValidate
							className='w-full shadow-lg'
							onSubmit={handleSubmitActivityId}
							autoComplete='off'
						>
							<FormControl
								className='[&_.Mui-focused>fieldset]:border-primary'
								fullWidth
								variant='outlined'
							>
								<OutlinedInput
									className={classNames(
										'h-10 bg-white pl-3 text-base font-normal text-[#7A7A7A] [&_fieldset]:rounded [&_fieldset]:border-transparent [&_input]:box-border [&_input]:h-10 [&_input]:p-2 [&_input]:pr-3',
										{
											'!font-medium !text-black': !!inputActivityId,
										},
									)}
									startAdornment={
										<InputAdornment position='start' className='m-0 h-6 w-6'>
											<Icon path={mdiFileSearchOutline} size={1} className='text-black' />
										</InputAdornment>
									}
									id='activityId'
									value={inputActivityId}
									onChange={handleChangeActivityIdInput}
									onBlur={handleBlurActivityId}
									inputRef={activityIdRef}
									placeholder={t('referenceCode', { ns: 'plot-monitoring' })}
								/>
							</FormControl>
						</form>
						<FormControl
							fullWidth
							variant='standard'
							className='shadow-lg [&_.MuiAutocomplete-hasClearIcon>.MuiInputBase-root]:pr-[68px] [&_.MuiAutocomplete-hasClearIcon>div>div>button]:text-black [&_.MuiInputBase-root.Mui-focused]:border-primary'
						>
							<Autocomplete
								className='[&_.MuiAutocomplete-endAdornment]:right-2.5 [&_.MuiAutocomplete-endAdornment]:flex [&_.MuiAutocomplete-endAdornment]:!h-full [&_.MuiAutocomplete-endAdornment]:items-center [&_.MuiAutocomplete-endAdornment]:gap-0.5'
								slotProps={{
									popper: {
										className: '!top-1.5 [&_ul>li]:p-0 aria-selected:[&_ul>li]:!bg-gray-light2',
									},
									paper: {
										className: 'border border-solid border-gray',
									},
									popupIndicator: {
										className: 'h-6 m-0 p-0 [&_svg]:w-6 [&_svg]:h-6',
									},
									clearIndicator: {
										className: 'hidden w-6 h-6 m-0 p-0.5 [&_svg]:w-5 [&_svg]:h-5',
									},
								}}
								renderOption={(props, option, { inputValue }) => {
									const { key, ...optionProps } = props
									return (
										<li key={key} {...optionProps}>
											<div className='flex w-full items-center gap-2 p-2'>
												<Box className='flex h-4 min-w-4 items-center justify-center'>
													{option.name[language] === inputValue && (
														<Check className='h-4 w-4 font-normal text-black' />
													)}
												</Box>
												<span
													className={classNames('text-base font-normal text-black', {
														'!font-medium': option.name[language] === inputValue,
													})}
												>
													{option.name[language]}
												</span>
											</div>
										</li>
									)
								}}
								popupIcon={<ExpandMore />}
								options={yearLookupData?.data || []}
								getOptionLabel={(option) => option.name[language]}
								isOptionEqualToValue={(option, value) => option.code === value.code}
								value={yearLookupData?.data?.find((year) => year.code === queryParams.year) || null}
								onChange={handleSelectYear}
								renderInput={(params) => {
									const { InputLabelProps, InputProps, ...otherParams } = params
									return (
										<Input
											{...otherParams}
											{...params.InputProps}
											className='h-10 rounded border-2 border-solid border-transparent bg-white py-2 pl-3 pr-[42px] [&_.MuiInputBase-input]:p-0 [&_input]:text-base [&_input]:font-medium [&_input]:text-black'
											startAdornment={
												<InputAdornment position='start' className='mr-1 h-6 w-6'>
													<CalendarMonthOutlined className='h-6 w-6 text-black' />
												</InputAdornment>
											}
											disableUnderline={true}
											id='year'
											placeholder={t('dataYear')}
										/>
									)
								}}
								disabled={isYearDataLoading}
							/>
						</FormControl>
					</Box>
				</Box>
			)}
		</Paper>
	)
}

export default PlotMonitoringSearchForm
