'use client'

import AdminPoly from '@/components/shared/AdminPoly'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as yup from 'yup'
import { Alert, CircularProgress, Paper, Snackbar, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'
import { AlertInfoType } from '@/components/shared/ProfileForm/interface'
import * as report from '@/utils/export-pdf'
import { GetTableLossDtoIn } from '@/api/annual-analysis/dto-in.dto'
import useAreaType from '@/store/area-type'
import { ResponseAnnualAnalysisBarDto, ResponseAnnualAnalysisLineDto, ResponseLanguage } from '@/api/interface'
import useAreaUnit from '@/store/area-unit'
import bb, { bar, line } from 'billboard.js'
import { DataLossStatisticDtoOut, LegendLossStatisticDtoOut } from '@/api/annual-analysis/dto-out.dto'
import LoadingButton from '@mui/lab/LoadingButton'

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

	const chartBarRef = useRef<HTMLDivElement | null>(null)
	const chartLineRef = useRef<HTMLDivElement | null>(null)

	const { data: userData, isLoading: isUserDataLoading } = useQuery({
		queryKey: ['getProfile'],
		queryFn: async () => await service.um.getProfile(),
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
					years,
					registrationAreaType: areaType,
				}
				if (values.format === 'csv') {
					setCsvLoading(true)
					service.report
						.download(params)
						.then((res) => {
							if (res?.data?.urls instanceof Array) {
								if (res?.data?.urls.length > 0) {
									res?.data?.urls.map((item) => {
										window.open(item)
									})
								} else {
									setAlertInfo({
										open: true,
										severity: 'error',
										message: t('error.noResultsFound', { ns: 'report' }),
									})
								}
							} else if (typeof res?.data?.urls === 'string') {
								window.open(res?.data?.urls)
							}
						})
						.catch((error) => {
							console.log(error)
							setAlertInfo({
								open: true,
								severity: 'error',
								message: t('error.somethingWrong'),
							})
						})
						.finally(() => {
							setCsvLoading(false)
						})
				} else {
					handleClickExport(values)
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

	const generateBarChart = (
		chartBarData: ResponseAnnualAnalysisBarDto<DataLossStatisticDtoOut[], LegendLossStatisticDtoOut>,
		chartBarRef: React.RefObject<HTMLDivElement>,
	) => {
		const lossBarColumns: (string | number)[][] = [['x']]
		const lossBarColorArr: { [key: string]: string } = {}
		const lossBarGroupArr: string[][] = [[]]
		const isBarInteger = true
		if (chartBarData?.data && chartBarData?.legend) {
			lossBarColumns[0] = ['x', ...chartBarData.data.map((item) => item.name[language])]

			chartBarData.legend.items.forEach((legendItem) => {
				const row: (string | number)[] = [legendItem.label[language]]
				chartBarData.data?.forEach((dataItem) => {
					const category = dataItem.categories.find(
						(cat) => cat.label[language] === legendItem.label[language],
					)
					if (category) {
						row.push(isBarInteger ? category.value.area[areaUnit] : category.value.percent[areaUnit])
					}
				})
				lossBarColumns.push(row)
				lossBarColorArr[legendItem.label[language]] = legendItem.color
				lossBarGroupArr[0].push(legendItem.label[language])
			})
		}
		if (chartBarRef.current) {
			bb.generate({
				size: {
					height: 442,
				},
				data: {
					x: 'x',
					columns: lossBarColumns,
					order: 'asc' as const,
					groups: lossBarGroupArr,
					type: bar(),
					labels: {
						centered: true,
						colors: 'white' as string,
						backgroundColors: lossBarColorArr,
						format: (x: number) => {
							return isBarInteger
								? Number(x?.toFixed(2) || 0)?.toLocaleString()
								: Number(x?.toFixed(2) || 0)?.toLocaleString() + ' %'
						},
						position: function (type, v, id, i, texts) {
							let pos = 0
							if (type === 'y') {
								pos = -(
									texts
										.data()
										.filter((item) => item.index === i)
										.map((subItem) => subItem.id)
										.indexOf(id) * 20
								)
							}
							return pos
						},
					},
					colors: lossBarColorArr,
				},
				bar: {
					width: {
						ratio: 0.85,
					},
				},
				axis: {
					x: {
						type: 'category' as const,
						tick: {
							format: function (index: number, categoryName: string) {
								return categoryName
							},
						},
					},
					y: {
						tick: {
							format: function (x: number) {
								const usformatter = Intl.NumberFormat('en-US', {
									notation: 'compact',
									compactDisplay: 'short',
								})
								return isBarInteger ? usformatter.format(x) : usformatter.format(x) + '%'
							},
						},
					},
				},
				legend: {
					show: true,
					padding: 8,
				},
				grid: {
					y: {
						show: true,
					},
				},
				padding: {
					bottom: 60,
				},
				bindto: chartBarRef.current,
			})
		}
	}

	const generateLineChart = (
		chartLineData: ResponseAnnualAnalysisLineDto,
		chartLineRef: React.RefObject<HTMLDivElement>,
	) => {
		const lossLineColumns: (number | string)[][] = []
		const lossLineColorArr: { [key: string]: string } = {}
		const lossCategoriesArr: string[] = []
		if (chartLineData?.values && chartLineData?.data && chartLineData?.legend) {
			for (let i = 0; i < chartLineData?.values?.length; i++) {
				const label: string = chartLineData.values[i].label[language]
				const areas: number[] = chartLineData.values[i].area[areaUnit]
				const tempArr: (number | string)[] = [label, ...areas]
				lossLineColumns.push(tempArr)
			}
			for (let i = 0; i < chartLineData.data.length; i++) {
				lossCategoriesArr.push(chartLineData.data[i].name[language])
			}
			for (let i = 0; i < chartLineData.legend.items.length; i++) {
				const label: string = chartLineData.legend.items[i].label[language]
				if (label) {
					lossLineColorArr[label] = chartLineData.legend.items[i].color
				} else {
					// some error handling
				}
			}
		}
		if (chartLineRef.current) {
			bb.generate({
				size: {
					height: 462,
				},
				data: {
					columns: lossLineColumns,
					type: line(),
					colors: lossLineColorArr,
				},
				point: {
					pattern: [
						"<g><circle cx='6' cy='6' r='6'></circle><circle cx='6' cy='6' r='3' style='fill:#fff'></circle></g>",
					],
				},
				axis: {
					x: {
						type: 'category' as const,
						categories: lossCategoriesArr,
					},
					y: {
						tick: {
							format: (x: number) => {
								return x.toLocaleString()
							},
						},
					},
				},
				line: {
					classes: ['line-chart'],
				},
				grid: {
					y: {
						show: true,
					},
				},
				padding: {
					bottom: 50,
				},
				legend: {
					position: 'bottom',
					padding: 8,
				},
				bindto: chartLineRef.current,
			})
		}
	}

	// Utility function to wait for the next animation frame
	const waitForRender = () => {
		return new Promise<void>((resolve) => {
			requestAnimationFrame(() => resolve())
		})
	}

	// Function to capture the chart image
	const captureChartImage = async (chartDiv: HTMLDivElement | null) => {
		if (!chartDiv) return ''

		const svgElement = chartDiv.querySelector('svg')
		if (!svgElement) return ''

		const svgData = new XMLSerializer().serializeToString(svgElement)
		const canvas = document.createElement('canvas')
		const context = canvas.getContext('2d')
		const image = new Image()

		const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
		const url = URL.createObjectURL(svgBlob)

		return new Promise<string>((resolve) => {
			image.onload = () => {
				canvas.width = image.width
				canvas.height = image.height
				context?.drawImage(image, 0, 0)
				URL.revokeObjectURL(url)

				const imgData = canvas.toDataURL('image/png')
				resolve(imgData)
			}

			image.src = url
		})
	}

	const styleChartSVG = (chartDiv: HTMLDivElement | null) => {
		if (!chartDiv) return

		const paths = chartDiv.querySelectorAll('.bb-axis path, .bb-shapes path')
		paths.forEach((element) => {
			element.setAttribute('fill', 'none')
			element.setAttribute('stroke', '#000')
		})
	}

	const handleClickExport = useCallback(
		async (values: SearchFormType) => {
			setPdfLoading(true)

			try {
				const params: GetTableLossDtoIn = {
					provinceCode: values.provinceCode,
					districtCode: values.districtCode,
					subDistrictCode: values.subDistrictCode,
					registrationAreaType: areaType,
					years: values.year,
				}

				const tableData = await service.annualAnalysis.getTableLossStatistic(params)
				const chartBarData = await service.annualAnalysis.getBarLossStatistic(params)
				const chartLineData = await service.annualAnalysis.getLineLossStatistic(params)

				let imgBarData = ''
				let imgLineData = ''

				if (chartBarData?.data && chartBarData?.data?.length > 0) {
					generateBarChart(chartBarData, chartBarRef)
					await waitForRender()
					styleChartSVG(chartBarRef.current)
					imgBarData = await captureChartImage(chartBarRef.current)
				}

				if (chartLineData?.data && chartLineData?.data.length > 0) {
					generateLineChart(chartLineData, chartLineRef)
					await waitForRender()
					styleChartSVG(chartLineRef.current)
					imgLineData = await captureChartImage(chartLineRef.current)
				}

				let district, subDistrict
				const province = (await service.lookup.get('provinces'))?.data
				if (values.provinceCode) {
					district = (await service.lookup.get(`districts/${values?.provinceCode}`))?.data
				}
				if (values.subDistrictCode) {
					subDistrict = (await service.lookup.get(`sub-districts/${values?.districtCode}`))?.data
				}
				const years = (await service.lookup.get('years'))?.data
				const lookups = {
					province,
					district,
					subDistrict,
					years,
				}
				const blob = await report.exportPdf(
					tableData.data,
					values,
					lookups,
					userData?.data,
					settings,
					imgBarData,
					imgLineData,
				)
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
			} catch (error: any) {
				console.log('error', error)
				setAlertInfo({
					open: true,
					severity: 'error',
					message: error?.title ? error.title : t('error.somethingWrong'),
				})
			} finally {
				setPdfLoading(false)
			}
		},
		[userData, settings],
	)

	useEffect(() => {
		if (
			!formik.values.districtCode ||
			(formik.values.subDistrictCode &&
				formik.values.districtCode.toString() !== formik.values.subDistrictCode?.toString().substring(0, 4))
		) {
			formik.setFieldValue('subDistrictCode', null)
		} else if (
			!formik.values.provinceCode ||
			(formik.values.districtCode &&
				formik.values.provinceCode.toString() !== formik.values.districtCode?.toString().substring(0, 2))
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
					<LoadingButton
						fullWidth
						loading={csvLoading || pdfLoading}
						loadingPosition='start'
						startIcon={<CircularProgress size={0} />}
						variant='contained'
						type='submit'
						className='py-2 max-lg:rounded [&_.MuiButton-startIcon]:m-0'
					>
						<span className='font-semibold'>{t('download', { ns: 'report' })}</span>
					</LoadingButton>
				</form>
			</Paper>
			{/* Static hidden divs for charts */}
			<div ref={chartBarRef} className='!absolute left-[-9999px] top-[-9999px] w-[600px]'></div>
			<div ref={chartLineRef} className='!absolute left-[-9999px] top-[-9999px] w-[600px]'></div>
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
