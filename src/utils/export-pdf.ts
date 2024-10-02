import moment from 'moment'

import pdfMake from 'pdfmake/build/pdfmake'
//import pdfFonts from 'pdfmake/build/vfs_fonts'
import pdfFonts from '@/components/pages/others/report/Main/vfs_fonts'
import { TDocumentDefinitions } from 'pdfmake/interfaces'
pdfMake.vfs = pdfFonts.vfs
pdfMake.fonts = {
	Anuphan: {
		normal: 'Anuphan-Regular.ttf',
		bold: 'Anuphan-Bold.ttf',
	},
}

export const exportPdf = (
	data: any,
	formData: any,
	lookups: any,
	user: any,
	settings: any,
	imgBarData: any,
	imgLineData: any,
) => {
	return new Promise((resolve, reject) => {
		try {
			const docDefinition: any = {
				pageSize: 'A4',
				pageMargins: [30, 100, 30, 40],
				header: getPdfReportHeader(data, formData, lookups, settings),
				content: getPdfReportContent(data, formData, lookups, user, settings, imgBarData, imgLineData),
				footer: getPdfReportFooter(user),
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

function getPdfReportHeader(data: any, formData: any, lookups: any, settings: any) {
	const provinceName = formData?.provinceCode
		? `จังหวัด${lookups?.province?.find((item: any) => item.code === formData?.provinceCode)?.name?.[settings?.language]}`
		: ''
	const districtName = formData?.districtCode
		? `อำเภอ${lookups?.district?.find((item: any) => item.code === formData?.districtCode)?.name?.[settings?.language]}`
		: ''
	const subDistrictName = formData?.subDistrictCode
		? `ตำบล${lookups?.subDistrict?.find((item: any) => item.code === formData?.subDistrictCode)?.name?.[settings?.language]}`
		: ''
	const header = [
		{
			stack: [
				{ text: 'รายงานพื้นที่เสียหายจากภัยพิบัติ', bold: true, style: 'header' },
				{
					text: !provinceName
						? 'ทุกจังหวัด'
						: !districtName
							? provinceName
							: !subDistrictName
								? `${districtName} ${provinceName}`
								: `${subDistrictName} ${districtName} ${provinceName}`,
					margin: [0, 4, 0, 0],
				},
				{
					text: `ปี ${data[0]?.disasterAreas
						?.map((item: any) => item?.column?.[settings.language])
						.join(',')}`,
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
	formData: any,
	lookups: any,
	user: any,
	settings: any,
	imgBarData: any,
	imgLineData: any,
) {
	let content = [
		{
			alignment: 'justify',
			columns: [
				{
					table: {
						widths: ['*'],
						body: [
							[
								{
									stack: [
										{
											text: 'เปรียบเทียบพื้นที่เสียหาย (เฉพาะที่มีขอบแปลงเท่านั้น)',
											fontSize: 10,
										},
										{
											image: imgBarData,
											width: 230,
											height: 180,
											margin: [0, 12, 0, 0],
										},
									],
									margin: [4, 4, 4, 4],
								},
							],
						],
					},
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
				},
				{
					table: {
						widths: ['*'],
						body: [
							[
								{
									stack: [
										{
											text: 'เปรียบเทียบพื้นที่เสียหายรายปี (เฉพาะที่มีขอบแปลงเท่านั้น)',
											fontSize: 10,
										},
										{
											image: imgLineData,
											width: 230,
											height: 180,
											margin: [0, 12, 0, 0],
										},
									],
									margin: [4, 4, 4, 4],
								},
							],
						],
					},
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
				},
			],
			columnGap: 12,
			margin: [0, 0, 0, 12],
		},
	]
	content = content.concat(getTableLossStatistic(data, formData, settings) as any)

	return content
}

function getPdfReportFooter(user: any) {
	return (currentPage: number, pageCount: number) => {
		const footer = [
			{
				alignment: 'justify',
				columns: [
					{
						text: `วันเวลาออกเอกสาร: ${moment().format(
							'DD/MM/YYYY HH:mm น.',
						)} ผู้ออกเอกสาร: ${user?.firstName} ${user?.lastName}`,
						style: 'footer',
						noWrap: true,
						width: 'auto',
					},
					{
						text: `หน้า ${currentPage} / ${pageCount}`,
						style: 'footer',
						alignment: 'right',
						noWrap: true,
						width: '*',
					},
				],
				margin: [10, 10],
			},
		]
		return footer
	}
}

function getTableLossStatistic(data: any, formData: any, settings: any) {
	const widths = ['auto', 80, 'auto']
	const body: any = [
		[
			{ text: 'ลำดับ', style: 'tableHeader', alignment: 'left', noWrap: true },
			{ text: 'พื้นที่', style: 'tableHeader', alignment: 'left' },
			{ text: 'ผลรวม ความเสียหาย', style: 'tableHeader', alignment: 'right', noWrap: true },
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
	const content = [
		{
			text: 'อันดับพื้นที่ความเสียหาย (ไร่)',
			bold: true,
			margin: [0, 12, 0, 0],
		},
		{
			style: 'table',
			margin: [0, 12, 0, 0],
			layout: {
				vLineWidth: (i: number) => {
					if (i === 2) {
						return 1
					}
					return 0
				},
				hLineWidth: (i: number) => {
					if (i === 0) {
						return 0
					}
					return 1
				},
				vLineColor: () => '#D6D6D6',
				hLineColor: (i: number) => {
					if (i === 1) {
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
