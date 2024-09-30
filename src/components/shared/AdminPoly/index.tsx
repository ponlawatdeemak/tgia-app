'use client'

import React from 'react'
import AutocompleteInput from '@/components/common/input/AutocompleteInput'
import { Box, Divider, FormControl, FormHelperText, FormLabel, InputAdornment } from '@mui/material'
import { FormikProps } from 'formik'
import service from '@/api'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import FormInput from '@/components/common/input/FormInput'
import { CalendarMonthOutlined, Check, ExpandMore } from '@mui/icons-material'
import { ResponseLanguage } from '@/api/interface'
import classNames from 'classnames'
import YearPicker from '@/components/pages/annual-analysis/YearPicker'

export interface AdminPolyProps {
	formik?: FormikProps<any>
	loading?: boolean
	isShowActivityId?: boolean
	isShowFileType?: boolean
	isYearMultiple?: boolean
	isEditAdminPoly?: boolean
}

const AdminPoly: React.FC<AdminPolyProps> = ({
	formik,
	loading = false,
	isShowActivityId = false,
	isShowFileType = false,
	isYearMultiple = false,
	isEditAdminPoly = false,
}) => {
	const { t, i18n } = useTranslation(['default', 'plot-monitoring', 'report'])
	const language = i18n.language as keyof ResponseLanguage

	const { data: provinceLookupData, isLoading: isProvinceDataLoading } = useQuery({
		queryKey: ['getProvince'],
		queryFn: () => service.lookup.get('provinces'),
	})

	const { data: districtLookupData, isLoading: isDistricDataLoading } = useQuery({
		queryKey: ['getDistrict', formik?.values?.provinceCode],
		queryFn: () => service.lookup.get(`districts/${formik?.values?.provinceCode}`),
		enabled: !!formik?.values?.provinceCode,
	})

	const { data: subDistrictLookupData, isLoading: isSubDistricDataLoading } = useQuery({
		queryKey: ['getSubDistrict', formik?.values?.provinceCode, formik?.values?.districtCode],
		queryFn: () => service.lookup.get(`sub-districts/${formik?.values?.districtCode}`),
		enabled: !!formik?.values?.districtCode,
	})

	console.log('subDistrictLookupData ::', subDistrictLookupData)
	console.log('districtLookupData ::', districtLookupData)

	const { data: yearLookupData, isLoading: isYearDataLoading } = useQuery({
		queryKey: ['getYear'],
		queryFn: () => service.lookup.get('years'),
	})

	const errorMessageYear = formik?.touched['year'] && formik?.errors['year']

	return (
		<div className='flex flex-col gap-4 [&_*>label]:text-sm [&_*>label]:font-medium [&_*>label]:text-black'>
			<Box className='flex flex-col gap-3 lg:gap-4 [&_*>input]:p-0 [&_*>input]:text-md [&_*>input]:font-medium [&_*>input]:text-black'>
				<div className='flex gap-3 max-lg:flex-col'>
					<AutocompleteInput
						className='w-full lg:w-60 [&_.MuiAutocomplete-endAdornment]:right-2.5 [&_.MuiAutocomplete-endAdornment]:flex [&_.MuiAutocomplete-endAdornment]:!h-full [&_.MuiAutocomplete-endAdornment]:items-center [&_.MuiAutocomplete-endAdornment]:gap-0.5 [&_.MuiAutocomplete-hasClearIcon>.MuiInputBase-root]:pr-[68px] [&_.MuiAutocomplete-hasClearIcon>div>div>button]:text-black [&_.MuiInputBase-root]:rounded-lg [&_.MuiInputBase-root]:py-2 [&_.MuiInputBase-root]:pl-3 [&_.MuiInputBase-root]:pr-[42px]'
						slotProps={{
							popper: {
								className: '!top-1.5 [&_ul>li]:p-0 aria-selected:[&_ul>li]:!bg-gray-light2',
							},
							popupIndicator: {
								className: 'h-6 m-0 p-0 [&_svg]:w-6 [&_svg]:h-6',
							},
							clearIndicator: {
								className: classNames('w-6 h-6 m-0 p-0.5 [&_svg]:w-5 [&_svg]:h-5', {
									'max-lg:hidden': isEditAdminPoly,
								}),
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
						options={
							provinceLookupData?.data?.map((item) => ({
								...item,
								value: item.code,
							})) || []
						}
						getOptionLabel={(option) => option.name[i18n.language]}
						name='provinceCode'
						label={t('province')}
						formik={formik}
						disabled={isProvinceDataLoading || loading}
						required={isShowActivityId}
						placeholder={t('allProvinces')}
					/>
					<AutocompleteInput
						className='w-full lg:w-60 [&_.MuiAutocomplete-endAdornment]:right-2.5 [&_.MuiAutocomplete-endAdornment]:flex [&_.MuiAutocomplete-endAdornment]:!h-full [&_.MuiAutocomplete-endAdornment]:items-center [&_.MuiAutocomplete-endAdornment]:gap-0.5 [&_.MuiAutocomplete-hasClearIcon>.MuiInputBase-root]:pr-[68px] [&_.MuiAutocomplete-hasClearIcon>div>div>button]:text-black [&_.MuiInputBase-root]:rounded-lg [&_.MuiInputBase-root]:py-2 [&_.MuiInputBase-root]:pl-3 [&_.MuiInputBase-root]:pr-[42px]'
						slotProps={{
							popper: {
								className: '!top-1.5 [&_ul>li]:p-0 aria-selected:[&_ul>li]:!bg-gray-light2',
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
						options={
							districtLookupData?.data?.map((item) => ({
								...item,
								value: item.code,
							})) || []
						}
						getOptionLabel={(option) => option.name?.[i18n.language]}
						name='districtCode'
						label={t('district')}
						formik={formik}
						disabled={isDistricDataLoading || loading || !formik?.values?.provinceCode}
						placeholder={t('allDistricts')}
					/>
				</div>
				<div className='flex gap-3 max-lg:flex-col'>
					<AutocompleteInput
						className='w-full lg:w-60 [&_.MuiAutocomplete-endAdornment]:right-2.5 [&_.MuiAutocomplete-endAdornment]:flex [&_.MuiAutocomplete-endAdornment]:!h-full [&_.MuiAutocomplete-endAdornment]:items-center [&_.MuiAutocomplete-endAdornment]:gap-0.5 [&_.MuiAutocomplete-hasClearIcon>.MuiInputBase-root]:pr-[68px] [&_.MuiAutocomplete-hasClearIcon>div>div>button]:text-black [&_.MuiInputBase-root]:rounded-lg [&_.MuiInputBase-root]:py-2 [&_.MuiInputBase-root]:pl-3 [&_.MuiInputBase-root]:pr-[42px]'
						slotProps={{
							popper: {
								className: '!top-1.5 [&_ul>li]:p-0 aria-selected:[&_ul>li]:!bg-gray-light2',
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
						options={
							subDistrictLookupData?.data?.map((item) => ({
								...item,
								value: item.code,
							})) || []
						}
						getOptionLabel={(option) => option.name?.[i18n.language]}
						name='subDistrictCode'
						label={t('subDistrict')}
						formik={formik}
						disabled={isSubDistricDataLoading || loading || !formik?.values?.districtCode}
						placeholder={t('allSubDistricts')}
					/>
				</div>
			</Box>
			<Divider className={classNames('border-gray', { '!border-white': isEditAdminPoly })} />
			{!isEditAdminPoly && (
				<Box className='flex flex-col gap-3 lg:gap-4 [&_*>input]:p-0 [&_*>input]:text-md [&_*>input]:font-medium [&_*>input]:text-black'>
					<div className='flex gap-3 max-lg:flex-col'>
						{isShowActivityId && (
							<FormInput
								className='w-full text-sm font-medium lg:w-60 [&_.MuiInputBase-root]:rounded-lg [&_.MuiInputBase-root]:px-3 [&_.MuiInputBase-root]:py-2'
								name='activityId'
								label={`${t('referenceCode', { ns: 'plot-monitoring' })} (Activity ID)`}
								formik={formik}
								placeholder={t('referenceCode', { ns: 'plot-monitoring' })}
							/>
						)}
						{isYearMultiple ? (
							<>
								<FormControl
									className='w-full lg:w-60 [&_.MuiAutocomplete-endAdornment]:right-2.5 [&_.MuiAutocomplete-endAdornment]:flex [&_.MuiAutocomplete-endAdornment]:!h-full [&_.MuiAutocomplete-endAdornment]:items-center [&_.MuiAutocomplete-endAdornment]:gap-0.5 [&_.MuiAutocomplete-hasClearIcon>.MuiInputBase-root]:pr-[68px] [&_.MuiAutocomplete-hasClearIcon>div>div>button]:text-black [&_.MuiInputBase-root]:rounded-lg [&_.MuiInputBase-root]:py-2 [&_.MuiInputBase-root]:pl-3 [&_.MuiInputBase-root]:pr-[42px]'
									required
									disabled={loading}
								>
									<FormLabel id={`year-label`} className='mb-2 [&_.MuiFormLabel-asterisk]:text-error'>
										{t('dataYear')}
									</FormLabel>
									<YearPicker formik={formik} isFullOnMobile disabled={loading} />
									{typeof errorMessageYear === 'string' && (
										<FormHelperText error>{errorMessageYear}</FormHelperText>
									)}
								</FormControl>
							</>
						) : (
							<AutocompleteInput
								className='w-full lg:w-60 [&_.MuiAutocomplete-endAdornment]:right-2.5 [&_.MuiAutocomplete-endAdornment]:flex [&_.MuiAutocomplete-endAdornment]:!h-full [&_.MuiAutocomplete-endAdornment]:items-center [&_.MuiAutocomplete-endAdornment]:gap-0.5 [&_.MuiAutocomplete-hasClearIcon>.MuiInputBase-root]:pr-[68px] [&_.MuiAutocomplete-hasClearIcon>div>div>button]:text-black [&_.MuiInputBase-root]:rounded-lg [&_.MuiInputBase-root]:py-2 [&_.MuiInputBase-root]:pl-3 [&_.MuiInputBase-root]:pr-[42px]'
								slotProps={{
									popper: {
										className: '!top-1.5 [&_ul>li]:p-0 aria-selected:[&_ul>li]:!bg-gray-light2',
									},
									popupIndicator: {
										className: 'h-6 m-0 p-0 [&_svg]:w-6 [&_svg]:h-6',
									},
									clearIndicator: {
										className: 'hidden w-6 h-6 m-0 p-0.5 [&_svg]:w-5 [&_svg]:h-5',
									},
								}}
								startAdornment={
									<InputAdornment position='start' className='mr-1 h-6 w-6'>
										<CalendarMonthOutlined className='h-6 w-6 text-black' />
									</InputAdornment>
								}
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
								options={
									yearLookupData?.data?.map((item) => ({
										...item,
										value: item.code,
									})) || []
								}
								getOptionLabel={(option) => {
									return option.name?.[i18n.language]
								}}
								name='year'
								label={t('dataYear')}
								formik={formik}
								required
								disabled={loading}
							/>
						)}

						{isShowFileType && (
							<AutocompleteInput
								className='w-full lg:w-60 [&_.MuiAutocomplete-endAdornment]:right-2.5 [&_.MuiAutocomplete-endAdornment]:flex [&_.MuiAutocomplete-endAdornment]:!h-full [&_.MuiAutocomplete-endAdornment]:items-center [&_.MuiAutocomplete-endAdornment]:gap-0.5 [&_.MuiAutocomplete-hasClearIcon>.MuiInputBase-root]:pr-[68px] [&_.MuiAutocomplete-hasClearIcon>div>div>button]:text-black [&_.MuiInputBase-root]:rounded-lg [&_.MuiInputBase-root]:py-2 [&_.MuiInputBase-root]:pl-3 [&_.MuiInputBase-root]:pr-[42px]'
								slotProps={{
									popper: {
										className: '!top-1.5 [&_ul>li]:p-0 aria-selected:[&_ul>li]:!bg-gray-light2',
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
													{option.label === inputValue && (
														<Check className='h-4 w-4 font-normal text-black' />
													)}
												</Box>
												<span
													className={classNames('text-base font-normal text-black', {
														'!font-medium': option.label === inputValue,
													})}
												>
													{option.label}
												</span>
											</div>
										</li>
									)
								}}
								popupIcon={<ExpandMore />}
								options={[
									{ label: 'CSV', value: 'csv' },
									{ label: 'PDF', value: 'pdf' },
								]}
								getOptionLabel={(option) => option.label}
								name='format'
								label={t('fileType', { ns: 'report' })}
								formik={formik}
								required
								disabled={loading}
							/>
						)}
					</div>
				</Box>
			)}
		</div>
	)
}

export default AdminPoly
