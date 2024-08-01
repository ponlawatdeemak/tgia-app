'use client'

import AdminPoly from '@/components/shared/AdminPoly'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useCallback, useState } from 'react'
import * as yup from 'yup'

const PlotMonitoringSearchMain = () => {
	const { t } = useTranslation(['default', 'fieldloss'])

	const validationSchema = yup.object({
		firstName: yup.string().required(t('warning.inputFirstName')),
		lastName: yup.string().required(t('warning.inputLastName')),
		email: yup.string().email(t('warning.invalidEmailFormat')).required(t('warning.inputEmail')),
		responsibleProvinceCode: yup.string().required(t('warning.inputProvince')),
	})

	// แก้ any
	const onSubmit = useCallback(async (values: any) => {
		try {
		} catch (error: any) {
		} finally {
		}
	}, [])

	// แก้ any
	const formik = useFormik<any>({
		enableReinitialize: true,
		initialValues: {},
		validationSchema: validationSchema,
		onSubmit,
	})

	return (
		<>
			xxx22
			<div>PlotMonitoringSearchMain</div>
			<AdminPoly formik={formik}></AdminPoly>  
		</>
	)
}

export default PlotMonitoringSearchMain
