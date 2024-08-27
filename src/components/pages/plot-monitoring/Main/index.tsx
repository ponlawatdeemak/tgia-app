'use client'

import AdminPoly from '@/components/shared/AdminPoly'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useCallback, useEffect } from 'react'
import * as yup from 'yup'
import { Button, Paper, Typography } from '@mui/material'
import { AppPath } from '@/config/app'
import useSearchPlotMonitoring from '../result/Main/context'

interface SearchFormType {
	provinceCode?: number
	districtCode?: number
	subDistrictCode?: number
	activityId?: number
	year: number
}

const defaultFormValues: SearchFormType = {
	provinceCode: undefined,
	districtCode: undefined,
	subDistrictCode: undefined,
	activityId: undefined,
	year: new Date().getFullYear(),
}

export const PlotMonitoringSearchMain = () => {
	const { queryParams, setQueryParams } = useSearchPlotMonitoring()
	const router = useRouter()
	const { t, i18n } = useTranslation(['default', 'plot-monitoring'])

	const validationSchema = yup.object({
		year: yup.number().required(t('warning.inputDataYear')),
	})

	const onSubmit = useCallback(async (values: SearchFormType) => {
		try {
			setQueryParams({
				...queryParams,
				provinceCode: values.provinceCode,
				districtCode: values.districtCode,
				subDistrictCode: values.subDistrictCode,
				activityId: values.activityId,
				year: values.year,
			})
			router.push(AppPath.PlotMonitoringResult)
		} catch (error) {
			console.log('error: ', error)
		}
	}, [])

	const formik = useFormik<SearchFormType>({
		enableReinitialize: true,
		initialValues: defaultFormValues,
		validationSchema: validationSchema,
		onSubmit,
	})

	useEffect(() => {
		if (!formik.values.districtCode) {
			formik.setFieldValue('subDistrictCode', null)
		} else if (!formik.values.provinceCode) {
			formik.setFieldValue('districtCode', null)
		}
	}, [formik.values.provinceCode, formik.values.districtCode])

	return (
		<div className='flex h-full w-full items-center justify-center'>
			<Paper className='flex flex-col gap-4 p-6 shadow-xl'>
				<Typography className='text-xl font-bold text-black-dark'>
					{t('searchPlotInfo', { ns: 'plot-monitoring' })}
				</Typography>
				<form noValidate onSubmit={formik.handleSubmit} className='flex flex-col gap-4'>
					<AdminPoly formik={formik} isShowActivityId />
					<Button className='py-2' fullWidth variant='contained' type='submit'>
						<span className='font-semibold'>{t('search')}</span>
					</Button>
				</form>
			</Paper>
		</div>
	)
}
