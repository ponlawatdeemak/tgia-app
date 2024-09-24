'use client'

import AdminPoly from '@/components/shared/AdminPoly'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import * as yup from 'yup'
import { Button, Paper, Typography } from '@mui/material'

interface SearchFormType {
	provinceCode?: number
	districtCode?: number
	subDistrictCode?: number
	year: number
	format?: string
}

const defaultFormValues: SearchFormType = {
	provinceCode: undefined,
	districtCode: undefined,
	subDistrictCode: undefined,
	year: new Date().getFullYear(),
	format: 'csv',
}

const ReportMain = () => {
	const { t } = useTranslation(['default', 'report'])

	const validationSchema = yup.object({
		year: yup.number().required(t('warning.inputDataYear')),
	})

	const onSubmit = useCallback((values: SearchFormType) => {
		console.log('Submit!!!')
	}, [])

	const formik = useFormik<SearchFormType>({
		enableReinitialize: true,
		initialValues: defaultFormValues,
		validationSchema: validationSchema,
		onSubmit,
	})

	return (
		<div className='flex justify-center max-lg:p-4 lg:h-full lg:items-center'>
			<Paper className='flex flex-col gap-4 p-4 shadow-xl max-lg:w-full max-lg:rounded lg:p-6'>
				<Typography className='text-xl font-semibold text-black-dark lg:font-bold'>
					{t('downloadReportTitle', { ns: 'report' })}
				</Typography>
				<form noValidate onSubmit={formik.handleSubmit} className='flex flex-col gap-4'>
					<AdminPoly formik={formik} isShowFileType />
					<Button className='py-2 max-lg:rounded' fullWidth variant='contained' type='submit'>
						<span className='font-semibold'>{t('download', { ns: 'report' })}</span>
					</Button>
				</form>
			</Paper>
		</div>
	)
}

export default ReportMain
