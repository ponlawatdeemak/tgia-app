import moment from 'moment'

import pdfMake from 'pdfmake/build/pdfmake'
//import pdfFonts from 'pdfmake/build/vfs_fonts'
import pdfFonts from '@/components/pages/others/report/Main/vfs_fonts'
import { TDocumentDefinitions } from 'pdfmake/interfaces'
import { GetProfileDtoOut } from '@/api/um/dto-out.dto'
import { GetLookupOutDto } from '@/api/lookup/dto-out.dto'
import { ResponseLanguage } from '@/api/interface'
import { AreaTypeKey, AreaUnitKey } from '@/enum'
pdfMake.vfs = pdfFonts.vfs
pdfMake.fonts = {
	Anuphan: {
		normal: 'Anuphan-Regular.ttf',
		bold: 'Anuphan-Bold.ttf',
	},
}

type SearchFormType = {
	provinceCode?: number
	districtCode?: number
	subDistrictCode?: number
	year: number[]
	format: string
}

type LookupsType = {
	province?: GetLookupOutDto[]
	district?: GetLookupOutDto[]
	subDistrict?: GetLookupOutDto[]
	years?: GetLookupOutDto[]
}

type UserType = GetProfileDtoOut | undefined

type SettingsType = {
	language: keyof ResponseLanguage
	areaUnit: AreaUnitKey
	areaType: AreaTypeKey
}

export const exportPdf = (
	data: any,
	formData: SearchFormType,
	lookups: LookupsType,
	user: UserType,
	settings: SettingsType,
	imgBarData: string,
	imgLineData: string,
) => {
	return new Promise((resolve, reject) => {
		try {
			const docDefinition: any = {
				pageSize: 'A4',
				pageMargins: [30, 100, 30, 40],
				header: getPdfReportHeader(data, formData, lookups, settings),
				content: getPdfReportContent(data, formData, lookups, settings, imgBarData, imgLineData),
				footer: getPdfReportFooter(user, settings),
				defaultStyle: {
					font: 'Anuphan',
					fontSize: 12,
				},
				styles: {
					header: {
						fontSize: 14,
						margin: [0, 20, 0, 0],
					},
					table: {
						fontSize: 10,
					},
					tableHeader: {},
					predictedArea: {
						color: '#9F1853',
					},
					footer: {
						color: '#999999',
						fontSize: 10,
					},
				},
			}
			pdfMake.createPdf(docDefinition).getBlob((blob) => {
				resolve(blob)
			})
		} catch (error) {
			reject(error)
		}
	})
}

function getPdfReportHeader(data: any, formData: SearchFormType, lookups: LookupsType, settings: SettingsType) {
	const provinceName = formData?.provinceCode
		? `${settings?.language === 'en' ? '' : 'จังหวัด'}${lookups?.province?.find((item) => item.code === formData?.provinceCode)?.name?.[settings?.language]}`
		: ''
	const districtName = formData?.districtCode
		? `${settings?.language === 'en' ? '' : 'อำเภอ'}${lookups?.district?.find((item) => item.code === formData?.districtCode)?.name?.[settings?.language]}${settings?.language === 'en' ? ', ' : ''}`
		: ''
	const subDistrictName = formData?.subDistrictCode
		? `${settings?.language === 'en' ? '' : 'ตำบล'}${lookups?.subDistrict?.find((item) => item.code === formData?.subDistrictCode)?.name?.[settings?.language]}${settings?.language === 'en' ? ', ' : ''}`
		: ''
	const header = [
		{
			stack: [
				{
					text: settings?.language === 'en' ? 'Damaged Area Report' : 'รายงานพื้นที่เสียหายจากภัยพิบัติ',
					bold: true,
					style: 'header',
				},
				{
					text: !provinceName
						? settings?.language === 'en'
							? 'All Provinces'
							: 'ทุกจังหวัด'
						: !districtName
							? provinceName
							: !subDistrictName
								? `${districtName} ${provinceName}`
								: `${subDistrictName} ${districtName} ${provinceName}`,
					margin: [0, 4, 0, 0],
				},
				{
					text:
						formData?.year.length === 0
							? settings?.language === 'en'
								? 'All Years'
								: 'ทุกปี'
							: `${settings?.language === 'en' ? 'Year' : 'ปี'} ${lookups?.years
									?.filter((year) => formData?.year?.includes(year.code))
									?.map((year) => year?.name?.[settings?.language])
									?.join(', ')}`,
					margin: [0, 4, 0, 0],
				},
			],
			alignment: 'center',
		},
		// Divider (Horizontal Line)
		{
			margin: [0, 8, 0, 12],
			canvas: [
				{
					type: 'line',
					x1: 0,
					y1: 0,
					x2: 515,
					y2: 0,
					lineWidth: 1,
					lineColor: '#C2C5CC',
				},
			],
			alignment: 'center',
		},
	]
	return header
}

function getPdfReportContent(
	data: any,
	formData: SearchFormType,
	lookups: LookupsType,
	settings: SettingsType,
	imgBarData: string,
	imgLineData: string,
) {
	let content = [
		{
			alignment: 'justify',
			columns: [
				{
					layout: {
						hLineWidth: function () {
							return 1
						},
						vLineWidth: function () {
							return 1
						},
						hLineColor: function () {
							return '#D6D6D6'
						},
						vLineColor: function () {
							return '#D6D6D6'
						},
					},
					table: {
						widths: ['*'],
						body: [
							[
								{
									stack: [
										{
											text:
												settings?.language === 'en'
													? 'Compare Damaged Areas (Only with Plot Boundaries)'
													: 'เปรียบเทียบพื้นที่เสียหาย (เฉพาะที่มีขอบแปลงเท่านั้น)',
											fontSize: settings?.language === 'en' ? 9 : 10,
										},
										data?.length === 0
											? {
													text: 'ไม่พบข้อมูล',
													alignment: 'center',
													fontSize: 10,
													color: '#202020',
													margin: [0, 90, 0, 90],
												}
											: {
													image: imgBarData,
													width: 240,
													height: 180,
													margin: [0, 12, 0, 0],
												},
									],
									margin: [4, 4, 4, 4],
								},
							],
						],
					},
				},
				{
					layout: {
						hLineWidth: function () {
							return 1
						},
						vLineWidth: function () {
							return 1
						},
						hLineColor: function () {
							return '#D6D6D6'
						},
						vLineColor: function () {
							return '#D6D6D6'
						},
					},
					table: {
						widths: ['*'],
						body: [
							[
								{
									stack: [
										{
											text:
												settings?.language === 'en'
													? 'Compare Yearly Damaged Areas (Only with Plot Boundaries)'
													: 'เปรียบเทียบพื้นที่เสียหายรายปี (เฉพาะที่มีขอบแปลงเท่านั้น)',
											fontSize: settings?.language === 'en' ? 9 : 10,
										},
										data?.length === 0
											? {
													text: 'ไม่พบข้อมูล',
													alignment: 'center',
													fontSize: 10,
													color: '#202020',
													margin: [0, 90, 0, 90],
												}
											: {
													image: imgLineData,
													width: 240,
													height: 180,
													margin: [0, 12, 0, 0],
												},
									],
									margin: [4, 4, 4, 4],
								},
							],
						],
					},
				},
			],
			columnGap: 12,
			margin: [0, 0, 0, 12],
		},
	]
	content = content.concat(getTableLossStatistic(data, formData, lookups, settings) as any)

	return content
}

function getPdfReportFooter(user: UserType, settings: SettingsType) {
	return (currentPage: number, pageCount: number) => {
		const footer = [
			{
				alignment: 'justify',
				columns: [
					{
						text: `${settings?.language === 'en' ? 'Created Date:' : 'วันเวลาออกเอกสาร:'} ${moment().format(
							`DD/MM/YYYY HH:mm ${settings?.language === 'en' ? '' : 'น.'}`,
						)} ${settings?.language === 'en' ? 'Created By:' : 'ผู้ออกเอกสาร:'} ${user?.firstName} ${user?.lastName}`,
						style: 'footer',
						noWrap: true,
						width: 'auto',
					},
					{
						text: `${settings?.language === 'en' ? 'page' : 'หน้า'} ${currentPage} / ${pageCount}`,
						style: 'footer',
						alignment: 'right',
						noWrap: true,
						width: '*',
					},
				],
				margin: [30, 10, 30, 10],
			},
		]
		return footer
	}
}

function getTableLossStatistic(data: any, formData: SearchFormType, lookups: LookupsType, settings: SettingsType) {
	const widths = ['auto', 80, 'auto']
	const body: any = [
		[
			{
				text: settings?.language === 'en' ? 'No.' : 'ลำดับ',
				style: 'tableHeader',
				alignment: 'left',
				noWrap: true,
			},
			{ text: settings?.language === 'en' ? 'Area' : 'พื้นที่', style: 'tableHeader', alignment: 'left' },
			{
				text: settings?.language === 'en' ? 'Total Analysis' : 'ผลรวม ความเสียหาย',
				style: 'tableHeader',
				alignment: 'right',
				noWrap: true,
			},
		],
	]
	data[0]?.disasterAreas?.forEach((item: any) => {
		widths.push('*')
		body[0].push({
			text: item?.column?.[settings?.language],
			style: 'tableHeader',
			alignment: 'right',
		})
	})
	data?.forEach((item: any, index: number) => {
		const row = [
			{ text: index + 1, alignment: 'left' },
			{ text: item?.name?.[settings?.language], alignment: 'left' },
			{
				stack: [
					{
						text: Number(item?.totalDisasterArea?.[settings?.areaUnit]?.toFixed(2))?.toLocaleString(),
						alignment: 'right',
						noWrap: true,
					},
					{
						text: Number(item?.totalPredictedArea?.[settings?.areaUnit]?.toFixed(2))?.toLocaleString(),
						style: 'predictedArea',
						alignment: 'right',
						noWrap: true,
					},
				],
			},
		]
		item?.disasterAreas?.forEach((subItem: any) => {
			const predictedArea = item?.predictedAreas?.find(
				(area: any) => area?.column?.[settings.language] === subItem?.column?.[settings.language],
			)
			row.push({
				stack: [
					{
						text: Number(subItem?.[settings?.areaUnit]?.toFixed(2))?.toLocaleString(),
						alignment: 'right',
						noWrap: true,
					},
					{
						text: Number(predictedArea?.[settings?.areaUnit]?.toFixed(2))?.toLocaleString(),
						style: 'predictedArea',
						alignment: 'right',
						noWrap: true,
					},
				],
			})
		})
		body.push(row)
	})
	const provinceName = formData?.provinceCode
		? `${settings?.language === 'en' ? '' : 'จังหวัด'}${lookups?.province?.find((item) => item.code === formData?.provinceCode)?.name?.[settings?.language]}`
		: ''
	const districtName = formData?.districtCode
		? `${settings?.language === 'en' ? '' : 'อำเภอ'}${lookups?.district?.find((item) => item.code === formData?.districtCode)?.name?.[settings?.language]}${settings?.language === 'en' ? ', ' : ''}`
		: ''
	const subDistrictName = formData?.subDistrictCode
		? `${settings?.language === 'en' ? '' : 'ตำบล'}${lookups?.subDistrict?.find((item) => item.code === formData?.subDistrictCode)?.name?.[settings?.language]}${settings?.language === 'en' ? ', ' : ''}`
		: ''
	const content = [
		{
			text: settings?.language === 'en' ? 'Damaged Area Rank (Rai)' : 'อันดับพื้นที่ความเสียหาย (ไร่)',
			bold: true,
			margin: [0, 12, 0, 0],
		},
		{
			alignment: 'justify',
			columns: [
				{
					text: `(${
						!provinceName
							? settings?.language === 'en'
								? 'All Provinces'
								: 'ทุกจังหวัด'
							: !districtName
								? provinceName
								: !subDistrictName
									? `${districtName} ${provinceName}`
									: `${subDistrictName} ${districtName} ${provinceName}`
					} ${
						formData?.year.length === 0
							? settings?.language === 'en'
								? 'All Years'
								: 'ทุกปี'
							: `${settings?.language === 'en' ? 'Year' : 'ปี'} ${lookups?.years
									?.filter((year) => formData?.year?.includes(year.code))
									?.map((year) => year?.name?.[settings?.language])
									?.join(', ')}`
					})`,
					width: '*',
				},
				{
					stack: [
						{
							type: 'square',
							markerColor: '#9F9F9F',
							ul: [settings?.language === 'en' ? 'Damage According to GS.02' : 'ความเสียหายตามกษ.02'],
							noWrap: true,
							width: 'auto',
						},
						{
							type: 'square',
							markerColor: '#B23B56',
							ul: [
								settings?.language === 'en' ? 'Analysis System Damage' : 'ความเสียหายจากระบบวิเคราะห์',
							],
							noWrap: true,
							width: 'auto',
						},
					],
					width: 'auto',
					noWrap: true,
				},
			],
			fontSize: 10,
			color: '#202020',
			columnGap: 20,
			margin: [0, 4, 0, 0],
		},
		data?.length === 0
			? {
					margin: [0, 16, 0, 0],
					layout: {
						hLineWidth: function () {
							return 1
						},
						vLineWidth: function () {
							return 1
						},
						hLineColor: function () {
							return '#D6D6D6'
						},
						vLineColor: function () {
							return '#D6D6D6'
						},
					},
					table: {
						widths: ['*'],
						body: [
							[
								{
									stack: [
										{
											text: 'ไม่พบข้อมูล',
											alignment: 'center',
											fontSize: 10,
											color: '#202020',
											margin: [0, 180, 0, 180],
										},
									],
									margin: [4, 4, 4, 4],
								},
							],
						],
					},
				}
			: {
					style: 'table',
					margin: [0, 16, 0, 0],
					layout: {
						vLineWidth: (i: number, node: any) => {
							if (i <= 2 || i === node.table.widths.length) {
								return 1
							}
							return 0
						},
						hLineWidth: (i: number) => {
							return 1
						},
						vLineColor: () => '#D6D6D6',
						hLineColor: (i: number, node: any) => {
							if (i <= 1 || i === node.table.body.length) {
								return '#D6D6D6'
							}
							return '#F2F2F2'
						},
						fillColor: (rowIndex: number, node: any, columnIndex: number) => {
							return rowIndex !== 0 && columnIndex === 2 ? '#F8FAFD' : null
						},
					},
					table: {
						headerRows: 1,
						widths,
						body,
					},
				},
	]
	return content
}
