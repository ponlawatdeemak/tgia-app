import React from 'react'
import bb, { bar, ChartOptions, line } from 'billboard.js'
import 'billboard.js/dist/billboard.css'
import BillboardJS, { IChart } from '@billboard.js/react'
import { Box, Grid, Typography } from '@mui/material'
import PlantStatisticTable from '../PlantStatistic/PlantStatisticTable'
import { useQuery } from '@tanstack/react-query'
import { useSearchAnnualAnalysis } from './context'
import service from '@/api'
import './chart.css'
import useResponsive from '@/hook/responsive'
import useAreaType from '@/store/area-type'
import useAreaUnit from '@/store/area-unit'
import { useTranslation } from 'react-i18next'
import { ResponseLanguage } from '@/api/interface'
import PlantStatisticBar from '../PlantStatistic/PlantStatisticBar'

const PlantStatistic = () => {
	const { queryParams } = useSearchAnnualAnalysis()
	const { isDesktop } = useResponsive()
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['default'])
	const language = i18n.language as keyof ResponseLanguage

	const [colorArr, setColorArr] = React.useState<string[] | null>(null) //array dynamic
	const [plantBarColumns, setPlantBarColumns] = React.useState<any>()

	const plantLineChart = React.useRef<IChart>(null)

	const { data: plantTableData, isLoading: isTableDataLoading } = useQuery({
		queryKey: ['getTablePlantStatistic', queryParams],
		queryFn: async () => {
			const res = await service.annualAnalysis.getTablePlantStatistic(queryParams)
			// console.log('Plant Table :: ', res)
			return res
		},
		enabled: true,
	})

	const { data: plantLineData, isLoading: isLineDataLoading } = useQuery({
		queryKey: ['getLinePlantStatistic', queryParams],
		queryFn: async () => {
			const res = await service.annualAnalysis.getLinePlantStatistic(queryParams)
			// console.log('Plant Line :: ', res)
			return res
		},
		enabled: true,
	})

	const { data: plantBarData, isLoading: isBarDataLoading } = useQuery({
		queryKey: ['getBarPlantStatistic', queryParams],
		queryFn: async () => {
			const res = await service.annualAnalysis.getBarPlantStatistic(queryParams)
			console.log('Plant Bar :: ', res)
			return res
		},
		enabled: true,
	})
	// console.log('areaType :: ', areaType)
	// console.log('areaUnit :: ', areaUnit)
	// console.log('language :: ', language)
	// console.log('plantBarData :: ', plantBarData)
	// console.log('plantLineData :: ', plantLineData)

	React.useEffect(() => {
		console.log('plantBarData :: ', plantBarData)
		if (plantBarData) {
			const tempBarColumns = [['x'], ['พื้นที่ไร่/แปลง']] //
			const tempBarColor = [] as string[]
			for (let i = 0; i < plantBarData?.data.length; i++) {
				tempBarColumns[0].push(plantBarData?.data[i]?.name[language])
				tempBarColumns[1].push(plantBarData?.data[i]?.categories[0]?.value?.area['areaRai'])
			}
			for (let i = 0; i < plantBarData?.legend.items.length; i++) {
				tempBarColor.push(plantBarData?.legend.items[i].color)
			}
			setColorArr(tempBarColor)
			setPlantBarColumns(tempBarColumns)
		}
	}, [plantBarData])

	const options = {
		size: {
			height: 442,
		},
		data: {
			x: 'x',
			// plantBarColumns,
			columns: [
				[
					'x',
					'พื้นที่ทบก. ทั้งหมด',
					'พื้นที่ขึ้นทะเบียน ทบก.\n มีขอบแปลง',
					'พื้นที่เอาประกัน\nทั้งหมด',
					'พื้นที่เอาประกัน\nที่มีขอบแปลง',
				],
				['พื้นที่ไร่', 14000000, 10000000, 10000000, 9000000], //format num x,xxx,xxx
			],
			type: bar(), // for ESM specify as: bar()
			labels: {
				centered: true,
				colors: 'white' as string,
				format: (x: number) => {
					return x.toLocaleString()
				},
				// format?: FormatFunction | { [key: string]: FormatFunction };
			},
			color: (color: string, d: any) => {
				return ['#545454FF', '#959595', '#B1334C', '#E7A9B5'][d.index]
			},
		},
		bar: {
			width: {
				ratio: 0.85,
			},
		},
		axis: {
			x: {
				// show: false,
				type: 'category' as const,
				tick: {
					format: function (index: number, categoryName: string) {
						return isDesktop ? categoryName : categoryName.substring(0, 10) + '...' //handle เอง
					},
				},
			},
			y: {
				tick: {
					format: function (x: number) {
						const usformatter = Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' })
						return usformatter.format(x)
					},
				},
			},
		},
		legend: {
			show: false,
		},
		grid: {
			y: {
				show: true,
			},
		},
		padding: {
			mode: 'fit' as const,
			top: 10,
			bottom: 20,
			right: 20,
		},
	}
	const options2 = {
		size: {
			height: 462,
		},
		data: {
			// 4 lines พื้นที่ทบก. ทั้งหมด , พื้นที่ ทบก. มีขอบแปลง , พื้นที่เอาประกันทั้งหมด , พื้นที่เอาประกันที่มีขอบแปลง
			// ['x', '2562', '2563', '2564', '2565', '2566'],
			columns: [
				['พื้นที่ทบก. ทั้งหมด', 10000, 20000, 30000, 40000, 50000],
				['พื้นที่ ทบก. มีขอบแปลง', 5000, 15000, 21000, 31000, 25000],
				['พื้นที่เอาประกันทั้งหมด', 17500, 22000, 23000, 45000, 51000],
				['พื้นที่เอาประกันที่มีขอบแปลง', 12000, 45000, 32000, 18000, 48000],
			],
			type: line(),
			// color: (color: string, d: any) => {
			// 	return ['#545454FF', '#959595', '#B1334C', '#E7A9B5'][d.index]
			// }
			colors: {
				'พื้นที่ทบก. ทั้งหมด': '#545454FF',
				'พื้นที่ ทบก. มีขอบแปลง': '#959595',
				พื้นที่เอาประกันทั้งหมด: '#B1334C',
				พื้นที่เอาประกันที่มีขอบแปลง: '#E7A9B5',
			},
		},
		point: {
			// r: 4,
			// type: 'circle',
			pattern: [
				"<g><circle cx='6' cy='6' r='6'></circle><circle cx='6' cy='6' r='3' style='fill:#fff'></circle></g>",
			],
		},
		axis: {
			x: {
				type: 'category' as const,
				categories: ['2562', '2563', '2564', '2565', '2566'],
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
			// left: -2,
			top: 10,
		},
		legend: {
			position: 'bottom',
		},
	}
	return (
		<Box>
			{/* text font Anuphan ไม่ส่งต่อให้ text ใน g element svg ใน BillboardJS*/}
			<Grid container rowSpacing={1} columnSpacing={1.5} direction={isDesktop ? 'row' : 'column'}>
				<Grid item xs={6}>
					<Box className='h-[488px] rounded bg-white p-[24px] shadow'>
						<Typography className='text-md font-semibold' component='div'>
							พื้นที่ทั้งหมด (ไร่)
						</Typography>
						{colorArr && (
							<>
								<PlantStatisticBar plantBarColumns={plantBarColumns} plantBarColorArr={colorArr} />
							</>
						)}
					</Box>
				</Grid>
				<Grid item xs={6}>
					<Box className='h-[488px] rounded bg-white p-[24px] shadow'>
						<Typography className='text-md font-semibold' component='div'>
							เปรียบเทียบพื้นที่ทั้งหมดรายปี (ไร่)
						</Typography>
						<BillboardJS
							bb={bb}
							options={options2}
							ref={plantLineChart}
							className={'bb annual-analysis-line'}
						/>
					</Box>
				</Grid>
			</Grid>
			<Box className='mt-3'>
				<PlantStatisticTable plantTableData={plantTableData?.data} />
			</Box>
		</Box>
	)
}

export default PlantStatistic
