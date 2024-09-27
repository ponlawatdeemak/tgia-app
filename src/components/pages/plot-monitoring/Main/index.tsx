'use client'

import AdminPoly from '@/components/shared/AdminPoly'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import React, { useCallback, useEffect } from 'react'
import * as yup from 'yup'
import { Button, Paper, Typography } from '@mui/material'
import { AppPath } from '@/config/app'
import useSearchPlotMonitoring from '../result/Main/context'
import useSearchForm from './context'

interface SearchFormType {
	provinceCode?: number
	districtCode?: number
	subDistrictCode?: number
	activityId?: number
	year: number
}

interface PlotMonitoringSearchMain {
	isEditAdminPoly?: boolean
}

export const PlotMonitoringSearchMain: React.FC<PlotMonitoringSearchMain> = ({ isEditAdminPoly = false }) => {
	const { setOpen } = useSearchForm()
	const { queryParams, setQueryParams } = useSearchPlotMonitoring()
	const router = useRouter()
	const { t } = useTranslation(['default', 'plot-monitoring'])

	const defaultFormValues: SearchFormType = {
		provinceCode: queryParams.provinceCode || undefined,
		districtCode: queryParams.districtCode || undefined,
		subDistrictCode: queryParams.subDistrictCode || undefined,
		activityId: queryParams.activityId || undefined,
		year: queryParams.year || new Date().getFullYear(),
	}

	const validationSchema = yup.object({
		provinceCode: yup.number().required(t('warning.inputProvince')),
		year: yup.number().required(t('warning.inputDataYear')),
	})

	const onSubmit = useCallback(
		async (values: SearchFormType) => {
			try {
				setQueryParams({
					...queryParams,
					provinceCode: values.provinceCode,
					districtCode: values.districtCode,
					subDistrictCode: values.subDistrictCode,
					activityId: values.activityId,
					year: values.year,
				})
				setOpen(false)
				router.push(`${AppPath.PlotMonitoringResult}?provinceCode=${values.provinceCode}`)
			} catch (error) {
				console.log('error: ', error)
			}
		},
		[queryParams, setQueryParams, setOpen, router],
	)

	const formik = useFormik<SearchFormType>({
		enableReinitialize: true,
		initialValues: defaultFormValues,
		validationSchema: validationSchema,
		onSubmit,
	})

	useEffect(() => {
		if (
			!formik.values.districtCode ||
			formik.values.districtCode.toString() !== formik.values.subDistrictCode?.toString().substring(0, 4)
		) {
			formik.setFieldValue('subDistrictCode', null)
		} else if (
			!formik.values.provinceCode ||
			formik.values.provinceCode.toString() !== formik.values.districtCode?.toString().substring(0, 2)
		) {
			formik.setFieldValue('districtCode', null)
		}
	}, [formik.values.provinceCode, formik.values.districtCode])

	return (
		<div className='flex justify-center max-lg:p-4 lg:h-full lg:items-center'>
			<Paper className='flex flex-col gap-4 p-4 shadow-xl max-lg:w-full max-lg:rounded lg:p-6'>
				<Typography className='text-xl font-semibold text-black-dark lg:font-bold'>
					{t('searchPlotInfo', { ns: 'plot-monitoring' })}
				</Typography>
				<form noValidate onSubmit={formik.handleSubmit} className='flex flex-col gap-4'>
					<AdminPoly formik={formik} isShowActivityId isEditAdminPoly={isEditAdminPoly} />
					<Button className='py-2 max-lg:rounded' fullWidth variant='contained' type='submit'>
						<span className='font-semibold'>{t('search')}</span>
					</Button>
				</form>
			</Paper>
		</div>
	)
}
