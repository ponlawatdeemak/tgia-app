'use client'

import React from 'react'
import AutocompleteInput from '@/components/common/input/AutocompleteInput'
import FormInput from '@/components/common/input/FormInput'
import UploadImage from '@/components/common/upload/UploadImage'
import { Box } from '@mui/material'
import { FormikProps } from 'formik'
import { useEffect } from 'react'
import service from '@/api'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

export interface AdminPolyProps {
	formik: FormikProps<any>
	loading?: boolean
}

const AdminPoly: React.FC<AdminPolyProps> = ({ formik, loading = false }) => {
	const { t, i18n } = useTranslation(['default'])

	const { data: provinceLookupData, isLoading: isProvinceDataLoading } = useQuery({
		queryKey: ['getProvince'],
		queryFn: () => service.lookup.get('provinces'),
	})

	const {
		data: districtLookupData,
		isLoading: isDistricDataLoading,
		refetch: refetchDistricts,
	} = useQuery({
		queryKey: ['getDistrict'],
		queryFn: () => service.lookup.get(`districts/${formik?.values?.provinceCode}`),
		enabled: !!formik?.values?.provinceCode,
	})

	const {
		data: subDistrictLookupData,
		isLoading: isSubDistricDataLoading,
		refetch: refetchSubDistricts,
	} = useQuery({
		queryKey: ['getSubDistrict'],
		queryFn: () => service.lookup.get(`sub-districts/${formik?.values?.districtCode}`),
		enabled: !!formik?.values?.districtCode,
	})

	useEffect(() => {
		if (formik?.values?.provinceCode) {
			refetchDistricts()
		}
	}, [formik?.values?.provinceCode, refetchDistricts])

	useEffect(() => {
		if (formik?.values?.districtCode) {
			refetchSubDistricts()
		}
	}, [formik?.values?.districtCode, refetchSubDistricts])

	return (
		<>
			<div className='flex flex-col gap-[16px]'>
				<Box className='flex flex-col gap-[16px] lg:gap-[12px]'>
					<div className='flex gap-[16px] max-lg:flex-col lg:gap-[12px]'>
						<AutocompleteInput
							className='w-full text-sm font-medium lg:w-[240px]'
							options={
								provinceLookupData?.data?.map((item) => ({
									...item,
									value: String(item.code),
								})) || []
							}
							getOptionLabel={(option) => option.name[i18n.language]}
							name='provinceCode'
							label={t('province')}
							formik={formik || null}
							disabled={isProvinceDataLoading || loading}
							required
						/>
						<AutocompleteInput
							className='w-full text-sm font-medium lg:w-[240px]'
							options={
								districtLookupData?.data?.map((item) => ({
									...item,
									value: String(item.code),
								})) || []
							}
							getOptionLabel={(option) => option.name?.[i18n.language]}
							name='districtCode'
							label={t('district')}
							formik={formik}
							disabled={isDistricDataLoading || loading}
						/>
					</div>
				</Box>
				<Box className='flex flex-col gap-[16px] lg:gap-[12px]'>
					<div className='flex gap-[16px] max-lg:flex-col lg:gap-[12px]'>
						<AutocompleteInput
							className='w-full text-sm font-medium lg:w-[240px]'
							options={
								subDistrictLookupData?.data?.map((item) => ({
									...item,
									value: String(item.code),
								})) || []
							}
							getOptionLabel={(option) => option.name?.[i18n.language]}
							name='subDistrictCode'
							label={t('subDistrict')}
							formik={formik}
							disabled={isSubDistricDataLoading || loading}
						/>
					</div>
				</Box>
			</div>
		</>
	)
}

export default AdminPoly
