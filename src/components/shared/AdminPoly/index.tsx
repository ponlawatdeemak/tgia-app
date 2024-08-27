'use client'

import React from 'react'
import AutocompleteInput from '@/components/common/input/AutocompleteInput'
import { Box, Divider } from '@mui/material'
import { FormikProps } from 'formik'
import service from '@/api'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import FormInput from '@/components/common/input/FormInput'

export interface AdminPolyProps {
	formik?: FormikProps<any>
	loading?: boolean
	isShowActivityId?: boolean
	isShowFileType?: boolean
}

const AdminPoly: React.FC<AdminPolyProps> = ({
	formik,
	loading = false,
	isShowActivityId = false,
	isShowFileType = false,
}) => {
	const { t, i18n } = useTranslation(['default', 'plot-monitoring'])

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
		queryKey: ['getSubDistrict', formik?.values?.districtCode],
		queryFn: () => service.lookup.get(`sub-districts/${formik?.values?.districtCode}`),
		enabled: !!formik?.values?.districtCode,
	})

	const { data: yearLookupData, isLoading: isYearDataLoading } = useQuery({
		queryKey: ['getYear'],
		queryFn: () => service.lookup.get('years'),
	})

	return (
		<div className='flex flex-col gap-4 [&_*>label]:text-sm [&_*>label]:font-medium [&_*>label]:text-black'>
			<Box className='flex flex-col gap-4 [&_*>input]:text-md [&_*>input]:font-medium [&_*>input]:text-black'>
				<div className='flex gap-4 max-lg:flex-col lg:gap-3'>
					<AutocompleteInput
						className='w-full lg:w-60 [&_.MuiInputBase-root]:rounded-lg'
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
						placeholder={t('allProvinces')}
					/>
					<AutocompleteInput
						className='w-full lg:w-60 [&_.MuiInputBase-root]:rounded-lg'
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
				<div className='flex gap-4 max-lg:flex-col lg:gap-3'>
					<AutocompleteInput
						className='w-full lg:w-60 [&_.MuiInputBase-root]:rounded-lg'
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
			<Divider className='border-gray' />
			<Box className='flex flex-col gap-4 [&_*>input]:text-md [&_*>input]:font-medium [&_*>input]:text-black'>
				<div className='flex gap-4 max-lg:flex-col lg:gap-3'>
					{isShowActivityId && (
						<FormInput
							className='w-full text-sm font-medium lg:w-60 [&_.MuiInputBase-root]:rounded-lg'
							name='activityId'
							label={`${t('referenceCode', { ns: 'plot-monitoring' })} (Activity ID)`}
							formik={formik}
							placeholder={t('referenceCode', { ns: 'plot-monitoring' })}
						/>
					)}
					<AutocompleteInput
						className='w-full lg:w-60 [&_.MuiInputBase-root]:rounded-lg'
						options={
							yearLookupData?.data?.map((item) => ({
								...item,
								value: item.code,
							})) || []
						}
						getOptionLabel={(option) => option.name?.[i18n.language]}
						name='year'
						label={t('dataYear')}
						formik={formik}
						required
					/>

					{isShowFileType && (
						<AutocompleteInput
							className='w-full lg:w-60 [&_.MuiInputBase-root]:rounded-lg'
							options={[
								{ label: 'CSV', value: 'csv' },
								{ label: 'PDF', value: 'pdf' },
							]}
							getOptionLabel={(option) => option.label}
							name='format'
							label='ประเภทไฟล์'
							formik={formik}
							required
						/>
					)}
				</div>
			</Box>
		</div>
	)
}

export default AdminPoly
