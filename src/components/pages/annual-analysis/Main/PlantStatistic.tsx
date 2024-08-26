import React from 'react'
import bb, { bar, line } from 'billboard.js'
import 'billboard.js/dist/billboard.css'
import BillboardJS from '@billboard.js/react'
import { Box, Grid } from '@mui/material'
import PlantStatisticTable from '../PlantStatistic/PlantStatisticTable'
import { useQuery } from '@tanstack/react-query'
import { useSearchAnnualAnalysis } from './context'
import service from '@/api'

const PlantStatistic = () => {
	const { queryParams } = useSearchAnnualAnalysis()
	const { data: plantTableData, isLoading: isTableDataLoading } = useQuery({
		queryKey: ['getTablePlantStatistic', queryParams],
		queryFn: async () => {
			const res = await service.annualAnalysis.getTablePlantStatistic(queryParams)
			console.log('Plant Table :: ', res)
			return res
		},
		enabled: true,
	})

	const { data: plantLineData, isLoading: isLineDataLoading } = useQuery({
		queryKey: ['getLinePlantStatistic', queryParams],
		queryFn: async () => {
			const res = await service.annualAnalysis.getLinePlantStatistic(queryParams)
			console.log('Plant Line :: ', res)
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

	const options = {
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
		axis: {
			x: {
				type: 'category' as const,
				categories: ['2562', '2563', '2564', '2565', '2566'],
			},
		},
		line: {
			classes: ['width : 10px'],
		},
	}
	const options2 = {
		data: {
			x: 'x',
			columns: [
				[
					'x',
					'พื้นที่ทบก. ทั้งหมด',
					'พื้นที่ขึ้นทะเบียน ทบก. มีขอบแปลง',
					'พื้นที่เอาประกันทั้งหมด',
					'พื้นที่เอาประกันที่มีขอบแปลง',
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
				ratio: 0.5,
			},
		},
		axis: {
			x: {
				// show: false,
				type: 'category' as const,
			},
			y: {
				tick: {
					// calculate count something function ???
					format: function (x: number) {
						// format round something ???
						const usformatter = Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' })
						return usformatter.format(x)
					},
				},
			},
		},
		legend: {
			show: false,
		},
	}
	return (
		<Box>
			{/* <div>{JSON.stringify(queryParams)}</div> */}
			<Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
				<Grid item xs={6}>
					<Box className='rounded bg-white shadow'>
						<BillboardJS bb={bb} options={options2} className={'bb'} />
					</Box>
				</Grid>
				<Grid item xs={6}>
					<Box className='rounded bg-white shadow'>
						<BillboardJS bb={bb} options={options} className={'bb'} />
					</Box>
				</Grid>
			</Grid>
			<Box className='mt-3'>
				<PlantStatisticTable />
			</Box>
		</Box>
	)
}

export default PlantStatistic
