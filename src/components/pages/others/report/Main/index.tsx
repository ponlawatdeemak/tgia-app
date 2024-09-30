'use client'

import AdminPoly from '@/components/shared/AdminPoly'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useState } from 'react'
import * as yup from 'yup'
import { Alert, Button, CircularProgress, Paper, Snackbar, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'
import { AlertInfoType } from '@/components/shared/ProfileForm/interface'

interface SearchFormType {
	provinceCode?: number
	districtCode?: number
	subDistrictCode?: number
	year: number[]
	format: string
}

const defaultFormValues: SearchFormType = {
	provinceCode: undefined,
	districtCode: undefined,
	subDistrictCode: undefined,
	year: [],
	format: 'csv',
}

const ReportMain = () => {
	const { t, i18n } = useTranslation(['default', 'report'])
	const [alertInfo, setAlertInfo] = useState<AlertInfoType>({
		open: false,
		severity: 'success',
		message: '',
	})
	const [csvLoading, setCsvLoading] = useState(false)

	const { data: userData, isLoading: isUserDataLoading } = useQuery({
		queryKey: ['getProfile'],
		queryFn: async () => await service.um.getProfile(),
	})

	const validationSchema = yup.object({
		year: yup.array().min(1, t('warning.inputDataYear')),
	})

	const onSubmit = useCallback(
		(values: SearchFormType) => {
			if (userData?.data?.orgCode) {
				const { year, subDistrictCode, ...props } = values
				const years = values.year.join(',')
				const params = {
					...props,
					subdistrictCode: subDistrictCode,
					orgCode: userData?.data?.orgCode,
					language: i18n.language,
					years: years,
				}
				console.log(params)
				if (values.format === 'csv') {
					setCsvLoading(true)
					service.report
						.download(params)
						.then((res) => {
							res?.data?.urls.map((item) => {
								window.open(item)
							})
						})
						.catch((error) => {
							console.log(error)
							setAlertInfo({
								open: true,
								severity: 'error',
								message: error?.title ? error.title : t('error.somethingWrong'),
							})
						})
						.finally(() => {
							setCsvLoading(false)
						})
				} else {
					console.log('pdf')
				}
			}
		},
		[userData, i18n.language],
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
					{t('downloadReportTitle', { ns: 'report' })}
				</Typography>
				<form noValidate onSubmit={formik.handleSubmit} className='flex flex-col gap-4'>
					<AdminPoly formik={formik} isShowFileType isYearMultiple loading={csvLoading} />
					<Button
						className='py-2 max-lg:rounded'
						fullWidth
						variant='contained'
						type='submit'
						disabled={csvLoading}
					>
						{csvLoading ? (
							<CircularProgress size='20px' className='py-[4px]' />
						) : (
							<span className='font-semibold'>{t('download', { ns: 'report' })}</span>
						)}
					</Button>
				</form>
			</Paper>
			<Snackbar
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				open={alertInfo.open}
				autoHideDuration={6000}
				onClose={() => setAlertInfo({ ...alertInfo, open: false })}
				className='w-content'
			>
				<Alert
					onClose={() => setAlertInfo({ ...alertInfo, open: false })}
					severity={alertInfo.severity}
					className='w-full'
				>
					{alertInfo.message}
				</Alert>
			</Snackbar>
		</div>
	)
}

export default ReportMain
