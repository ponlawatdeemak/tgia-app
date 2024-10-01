'use client'

import AdminPoly from '@/components/shared/AdminPoly'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useMemo, useState } from 'react'
import * as yup from 'yup'
import { Alert, Button, CircularProgress, Paper, Snackbar, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'
import { AlertInfoType } from '@/components/shared/ProfileForm/interface'
import * as report from '@/utils/export-pdf'
import { GetTableLossDtoIn } from '@/api/annual-analysis/dto-in.dto'
import useAreaType from '@/store/area-type'
import { ResponseDto, ResponseLanguage } from '@/api/interface'
import useAreaUnit from '@/store/area-unit'

interface SearchFormType {
	provinceCode?: number
	districtCode?: number
	subDistrictCode?: number
	year: number[]
	format: string
}

interface NavigatorWithSaveBlob extends Navigator {
	msSaveOrOpenBlob?: (blob: Blob, defaultName?: string) => boolean
}

const defaultFormValues: SearchFormType = {
	provinceCode: undefined,
	districtCode: undefined,
	subDistrictCode: undefined,
	year: [],
	format: 'csv',
}

const ReportMain = () => {
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['default', 'report'])
	const [alertInfo, setAlertInfo] = useState<AlertInfoType>({
		open: false,
		severity: 'success',
		message: '',
	})
	const [csvLoading, setCsvLoading] = useState(false)
	const [pdfLoading, setPdfLoading] = useState(false)
	const language = i18n.language as keyof ResponseLanguage

	const { data: userData, isLoading: isUserDataLoading } = useQuery({
		queryKey: ['getProfile'],
		queryFn: async () => await service.um.getProfile(),
	})

	const onSubmit = useCallback(
		(values: SearchFormType) => {
			if (userData?.data?.orgCode) {
				const { year, subDistrictCode, format, ...props } = values
				const years = values.year.join(',')
				const params = {
					...props,
					subdistrictCode: subDistrictCode,
					orgCode: userData?.data?.orgCode,
					language: i18n.language,
					years,
					format,
				}
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
					const params: GetTableLossDtoIn = {
						...props,
						subDistrictCode: subDistrictCode,
						registrationAreaType: areaType,
						years: values.year,
					}
					setPdfLoading(true)
					service.annualAnalysis
						.getTableLossStatistic(params)
						.then((res) => {
							handleClickExport(values, res)
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
							setPdfLoading(false)
						})
				}
			}
		},
		[userData, i18n.language, areaType],
	)

	const validationSchema = yup.object({})

	const formik = useFormik<SearchFormType>({
		enableReinitialize: true,
		initialValues: defaultFormValues,
		validationSchema: validationSchema,
		onSubmit,
	})

	const settings = useMemo(() => {
		return {
			language: language,
			areaUnit: areaUnit,
			areaType: areaType,
		}
	}, [, language, areaType, areaUnit])

	const handleClickExport = useCallback(
		async (values: SearchFormType, response: ResponseDto) => {
			try {
				let district, subDistrict
				const province = (await service.lookup.get('provinces'))?.data
				if (values.provinceCode) {
					district = (await service.lookup.get(`districts/${values?.provinceCode}`))?.data
				}
				if (values.subDistrictCode) {
					subDistrict = (await service.lookup.get(`sub-districts/${values?.districtCode}`))?.data
				}
				const lookups = {
					province,
					district,
					subDistrict,
				}
				const blob = await report.exportPdf(response.data, values, lookups, userData?.data, settings)
				const fileName = `damaged_area_report.pdf`
				const navigator = window.navigator as NavigatorWithSaveBlob
				if (navigator && navigator.msSaveOrOpenBlob) {
					navigator.msSaveOrOpenBlob(
						new Blob([blob as Blob], {
							type: 'application/pdf',
						}),
						fileName,
					)
				} else {
					window.open(
						URL.createObjectURL(
							new Blob([blob as Blob], {
								type: 'application/pdf',
							}),
						),
						'_blank',
					)
				}
			} catch (error) {
				console.log('error', error)
			}
		},
		[userData, settings],
	)

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
					<AdminPoly formik={formik} isShowFileType isYearMultiple loading={csvLoading || pdfLoading} />
					<Button
						className='py-2 max-lg:rounded'
						fullWidth
						variant='contained'
						type='submit'
						disabled={csvLoading || pdfLoading}
					>
						{csvLoading || pdfLoading ? (
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
