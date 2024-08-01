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
import { useTranslation } from '@/i18n/client'
import useLanguage from '@/store/language'

export interface ProfileFormProps {
	formik: FormikProps<any>
	loading?: boolean
}

const ProfileForm: React.FC<ProfileFormProps> = ({ formik, loading = false }) => {
	const { language } = useLanguage()
	const { t } = useTranslation(language, 'appbar')

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
		queryFn: () => service.lookup.get(`districts/${formik.values.responsibleProvinceCode}`),
		enabled: !!formik.values.responsibleProvinceCode,
	})

	useEffect(() => {
		if (formik.values.responsibleProvinceCode) {
			refetchDistricts()
		}
	}, [formik.values.responsibleProvinceCode, refetchDistricts])

	const { data: organizationLookupData, isLoading: isOrganizationDataLoading } = useQuery({
		queryKey: ['getOrganization'],
		queryFn: () => service.lookup.get('organizations'),
	})

	const { data: roleLookupData, isLoading: isRoleDataLoading } = useQuery({
		queryKey: ['getRole'],
		queryFn: () => service.lookup.get('roles'),
	})

	return (
		<>
			<div className='w-full lg:w-[214px]'>
				<UploadImage
					name='image'
					formik={formik}
					className='flex flex-col items-center gap-[12px] py-[16px]'
					disabled={loading}
				/>
			</div>
			<div className='flex flex-col gap-[16px]'>
				<Box className='flex flex-col gap-[12px]'>
					<div className='flex gap-[12px] max-lg:flex-col'>
						<FormInput
							className='w-full text-sm font-medium lg:w-[240px]'
							name='firstName'
							label={t('default.firstName')}
							formik={formik}
							required
							disabled={loading}
						/>
						<FormInput
							className='w-full text-sm font-medium lg:w-[240px]'
							name='lastName'
							label={t('default.lastName')}
							formik={formik}
							required
							disabled={loading}
						/>
					</div>
					<div className='flex gap-[12px] max-lg:flex-col'>
						<FormInput
							className='w-full text-sm font-medium lg:w-[240px]'
							name='email'
							label={t('default.email')}
							formik={formik}
							required
							disabled
						/>
					</div>
				</Box>
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
							getOptionLabel={(option) => option.name[language]}
							name='responsibleProvinceCode'
							label={t('default.province')}
							formik={formik}
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
							getOptionLabel={(option) => option.name?.[language]}
							name='responsibleDistrictCode'
							label={t('default.amphor')}
							formik={formik}
							disabled={isDistricDataLoading || loading}
						/>
					</div>
					<div className='flex gap-[16px] max-lg:hidden max-lg:flex-col lg:gap-[12px]'>
						<AutocompleteInput
							className='w-full text-sm font-medium lg:w-[240px]'
							options={
								organizationLookupData?.data?.map((item) => ({
									...item,
									value: item.code,
								})) || []
							}
							getOptionLabel={(option) => option.name[language]}
							name='orgCode'
							label={t('default.org')}
							formik={formik}
							disabled
						/>
						<AutocompleteInput
							className='w-full text-sm font-medium lg:w-[240px]'
							options={
								roleLookupData?.data?.map((item) => ({
									...item,
									value: item.code,
								})) || []
							}
							getOptionLabel={(option) => option.name[language]}
							name='role'
							label={t('default.role')}
							formik={formik}
							disabled
						/>
					</div>
				</Box>
			</div>
		</>
	)
}

export default ProfileForm
