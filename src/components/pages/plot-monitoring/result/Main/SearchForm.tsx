'use client'

import { Autocomplete, FormControl, Input, Paper } from '@mui/material'
import React, { ChangeEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'
import { useTranslation } from 'react-i18next'
import { ResponseLanguage } from '@/api/interface'
import useSearchPlotMonitoring from './context'
import { GetLookupOutDto } from '@/api/lookup/dto-out.dto'

const PlotMonitoringSearchForm = () => {
	const { queryParams, setQueryParams } = useSearchPlotMonitoring()
	const { t, i18n } = useTranslation(['default', 'plot-monitoring'])
	const language = i18n.language as keyof ResponseLanguage

	const { data: provinceLookupData, isLoading: isProvinceDataLoading } = useQuery({
		queryKey: ['getPlotMonitoringProvince'],
		queryFn: () => service.lookup.get('provinces'),
	})

	const { data: districtLookupData, isLoading: isDistricDataLoading } = useQuery({
		queryKey: ['getPlotMonitoringDistrict', queryParams.provinceCode],
		queryFn: () => service.lookup.get(`districts/${queryParams.provinceCode}`),
		enabled: !!queryParams.provinceCode,
	})

	const { data: subDistrictLookupData, isLoading: isSubDistricDataLoading } = useQuery({
		queryKey: ['getPlotMonitoringSubDistrict', queryParams.districtCode],
		queryFn: () => service.lookup.get(`sub-districts/${queryParams.districtCode}`),
		enabled: !!queryParams.districtCode,
	})

	const { data: yearLookupData, isLoading: isYearDataLoading } = useQuery({
		queryKey: ['getPlotMonitoringYear'],
		queryFn: () => service.lookup.get('years'),
	})

	const handleSelectProvince = (
		_event: ChangeEvent<{}>,
		newSelectedValue: GetLookupOutDto | null,
		AutocompleteCloseReason: string,
	) => {
		if (AutocompleteCloseReason === 'selectOption') {
			if (newSelectedValue) {
				setQueryParams({ ...queryParams, provinceCode: newSelectedValue.code })
			}
		} else if (AutocompleteCloseReason === 'clear') {
			setQueryParams({
				...queryParams,
				provinceCode: undefined,
				districtCode: undefined,
				subDistrictCode: undefined,
			})
		}
	}

	const handleSelectDistrict = (
		_event: ChangeEvent<{}>,
		newSelectedValue: GetLookupOutDto | null,
		AutocompleteCloseReason: string,
	) => {
		if (AutocompleteCloseReason === 'selectOption') {
			if (newSelectedValue) {
				setQueryParams({ ...queryParams, districtCode: newSelectedValue.code })
			}
		} else if (AutocompleteCloseReason === 'clear') {
			setQueryParams({ ...queryParams, districtCode: undefined, subDistrictCode: undefined })
		}
	}

	const handleSelectSubDistrict = (
		_event: ChangeEvent<{}>,
		newSelectedValue: GetLookupOutDto | null,
		AutocompleteCloseReason: string,
	) => {
		if (AutocompleteCloseReason === 'selectOption') {
			if (newSelectedValue) {
				setQueryParams({ ...queryParams, subDistrictCode: newSelectedValue.code })
			}
		} else if (AutocompleteCloseReason === 'clear') {
			setQueryParams({ ...queryParams, subDistrictCode: undefined })
		}
	}

	const handleSelectYear = (_event: ChangeEvent<{}>, newSelectedValue: GetLookupOutDto | null) => {
		if (newSelectedValue) {
			setQueryParams({ ...queryParams, year: newSelectedValue.code })
		}
	}

	return (
		<Paper className='mx-4 flex gap-1.5 bg-gray-dark4 p-1.5'>
			<FormControl fullWidth variant='standard' className='[&_.MuiInputBase-root.Mui-focused]:border-primary'>
				<Autocomplete
					options={provinceLookupData?.data || []}
					getOptionLabel={(option) => option.name[language]}
					isOptionEqualToValue={(option, value) => option.code === value.code}
					PaperComponent={({ children }) => (
						<Paper className='border border-solid border-gray'>{children}</Paper>
					)}
					value={
						provinceLookupData?.data?.find((province) => province.code === queryParams.provinceCode) || null
					}
					onChange={handleSelectProvince}
					renderInput={(params) => {
						const { InputLabelProps, InputProps, ...otherParams } = params
						return (
							<Input
								{...otherParams}
								{...params.InputProps}
								className='h-10 rounded-lg border-2 border-solid border-transparent bg-white px-3 py-2 [&_.MuiInputBase-input]:p-0'
								disableUnderline={true}
								id='provinceCode'
								placeholder={t('allProvinces')}
							/>
						)
					}}
					disabled={isProvinceDataLoading}
				/>
			</FormControl>
			<FormControl fullWidth variant='standard' className='[&_.MuiInputBase-root.Mui-focused]:border-primary'>
				<Autocomplete
					options={districtLookupData?.data || []}
					getOptionLabel={(option) => option.name[language]}
					isOptionEqualToValue={(option, value) => option.code === value.code}
					PaperComponent={({ children }) => (
						<Paper className='border border-solid border-gray'>{children}</Paper>
					)}
					value={
						districtLookupData?.data?.find((district) => district.code === queryParams.districtCode) || null
					}
					onChange={handleSelectDistrict}
					renderInput={(params) => {
						const { InputLabelProps, InputProps, ...otherParams } = params
						return (
							<Input
								{...otherParams}
								{...params.InputProps}
								className='h-10 rounded-lg border-2 border-solid border-transparent bg-white px-3 py-2 [&_.MuiInputBase-input]:p-0'
								disableUnderline={true}
								id='districtCode'
								placeholder={t('allDistricts')}
							/>
						)
					}}
					disabled={isDistricDataLoading || !queryParams.provinceCode}
				/>
			</FormControl>
			<FormControl fullWidth variant='standard' className='[&_.MuiInputBase-root.Mui-focused]:border-primary'>
				<Autocomplete
					options={subDistrictLookupData?.data || []}
					getOptionLabel={(option) => option.name[language]}
					isOptionEqualToValue={(option, value) => option.code === value.code}
					PaperComponent={({ children }) => (
						<Paper className='border border-solid border-gray'>{children}</Paper>
					)}
					value={
						subDistrictLookupData?.data?.find(
							(subDistrict) => subDistrict.code === queryParams.subDistrictCode,
						) || null
					}
					onChange={handleSelectSubDistrict}
					renderInput={(params) => {
						const { InputLabelProps, InputProps, ...otherParams } = params
						return (
							<Input
								{...otherParams}
								{...params.InputProps}
								className='h-10 rounded-lg border-2 border-solid border-transparent bg-white px-3 py-2 [&_.MuiInputBase-input]:p-0'
								disableUnderline={true}
								id='subDistrict'
								placeholder={t('allSubDistricts')}
							/>
						)
					}}
					disabled={isSubDistricDataLoading || !queryParams.districtCode}
				/>
			</FormControl>
			<FormControl fullWidth variant='standard' className='[&_.MuiInputBase-root.Mui-focused]:border-primary'>
				<Autocomplete
					options={yearLookupData?.data || []}
					getOptionLabel={(option) => option.name[language]}
					isOptionEqualToValue={(option, value) => option.code === value.code}
					PaperComponent={({ children }) => (
						<Paper className='border border-solid border-gray'>{children}</Paper>
					)}
					value={yearLookupData?.data?.find((year) => year.code === queryParams.year) || null}
					onChange={handleSelectYear}
					renderInput={(params) => {
						const { InputLabelProps, InputProps, ...otherParams } = params
						return (
							<Input
								{...otherParams}
								{...params.InputProps}
								className='h-10 rounded-lg border-2 border-solid border-transparent bg-white px-3 py-2 [&_.MuiAutocomplete-clearIndicator]:hidden [&_.MuiInputBase-input]:p-0'
								disableUnderline={true}
								id='year'
								placeholder={t('dataYear')}
							/>
						)
					}}
					disabled={isYearDataLoading}
				/>
			</FormControl>
		</Paper>
	)
}

export default PlotMonitoringSearchForm
