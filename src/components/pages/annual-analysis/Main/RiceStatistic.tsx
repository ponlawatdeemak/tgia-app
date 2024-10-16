import React from 'react'
import bb, { bar, ChartOptions, line } from 'billboard.js'
import 'billboard.js/dist/billboard.css'
import BillboardJS, { IChart } from '@billboard.js/react'
import { Box, CircularProgress, Grid, Typography } from '@mui/material'
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
import PlantStatisticLine from '../PlantStatistic/PlantStatisticLine'
import RiceStatisticBar from '../RiceStatistic/RiceStatisticBar'
import RiceStatisticLine from '../RiceStatistic/RiceStatisticLine'
import RiceStatisticTable from '../RiceStatistic/RiceStatisticTable'
import clsx from 'clsx'

type lineColorType = {
	[key: string]: string
}

const RiceStatistic = () => {
	const { queryParams } = useSearchAnnualAnalysis()
	const { isDesktop } = useResponsive()
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['default', 'annual-analysis'])
	const language = i18n.language as keyof ResponseLanguage

	// bar chart
	const [barColorArr, setBarColorArr] = React.useState<string[] | null>(null) //array dynamic
	const [riceBarColumns, setPlantBarColumns] = React.useState<any>()

	// line chart
	const [lineColorArr, setLineColorArr] = React.useState<lineColorType | null>(null) // array dynamic
	const [riceLineColumns, setPlantLineColumns] = React.useState<(number | string)[][]>([])
	const [lineCategoriesArr, setLineCategoriesArr] = React.useState<string[]>([])

	const { data: riceTableData, isLoading: isTableDataLoading } = useQuery({
		queryKey: ['getTableRiceStatistic', queryParams],
		queryFn: async () => {
			const res = await service.annualAnalysis.getTableRiceStatistic(queryParams)
			// console.log('TableRice :: ', res)
			return res
		},
		enabled: true,
	})

	const { data: riceLineData, isLoading: isLineDataLoading } = useQuery({
		queryKey: ['getLineRiceStatistic', queryParams],
		queryFn: async () => {
			const res = await service.annualAnalysis.getLineRiceStatistic(queryParams)
			// console.log('LineRice :: ', res)
			return res
		},
		enabled: true,
	})

	const { data: plantBarData, isLoading: isBarDataLoading } = useQuery({
		queryKey: ['getBarRiceStatistic', queryParams],
		queryFn: async () => {
			const res = await service.annualAnalysis.getBarRiceStatistic(queryParams)
			// console.log('BarRice :: ', res)
			return res
		},
		enabled: true,
	})

	React.useEffect(() => {
		if (plantBarData?.data && plantBarData?.legend) {
			const tempBarColumns = [['x'], [t(areaUnit)]] as (string | number)[][] //
			const tempBarColor = [] as string[]
			for (let i = 0; i < plantBarData?.data.length; i++) {
				tempBarColumns[0].push(plantBarData?.data[i]?.name[language])
				// typo in api response areaPlot
				if (plantBarData?.data[i]?.categories[0]?.value?.area[areaUnit]) {
					tempBarColumns[1].push(plantBarData?.data[i]?.categories[0]?.value?.area[areaUnit])
				} else {
					tempBarColumns[1].push(70000)
				}
			}
			for (let i = 0; i < plantBarData?.legend.items.length; i++) {
				tempBarColor.push(plantBarData?.legend.items[i].color)
			}
			setBarColorArr(tempBarColor)
			setPlantBarColumns(tempBarColumns)
		}
	}, [plantBarData, areaUnit, language])

	React.useEffect(() => {
		if (riceLineData?.values && riceLineData?.data && riceLineData?.legend) {
			const tempLineColumns: (number | string)[][] = []
			const tempLineColor: lineColorType = {}
			const tempLineCategories: string[] = []

			for (let i = 0; i < riceLineData?.values?.length; i++) {
				const label: string = riceLineData.values[i].label[language]
				const areas: number[] = riceLineData.values[i].area[areaUnit]
				const tempArr: (number | string)[] = [label, ...areas]
				tempLineColumns.push(tempArr)
			}
			for (let i = 0; i < riceLineData.data.length; i++) {
				tempLineCategories.push(riceLineData.data[i].name[language])
			}
			for (let i = 0; i < riceLineData.legend.items.length; i++) {
				const label: string = riceLineData.legend.items[i].label[language]
				if (label) {
					tempLineColor[label] = riceLineData.legend.items[i].color
				} else {
					// some error handling
				}
			}

			setLineColorArr(tempLineColor)
			setPlantLineColumns(tempLineColumns)
			setLineCategoriesArr(tempLineCategories)
		}
	}, [riceLineData, areaUnit, language])

	return (
		<Box>
			{/* text font Anuphan ไม่ส่งต่อให้ text ใน g element svg ใน BillboardJS*/}
			<Grid container rowSpacing={1} columnSpacing={1.5} direction={isDesktop ? 'row' : 'column'}>
				<Grid item xs={6}>
					<Box
						className={clsx('h-[488px] rounded bg-white p-[24px] shadow', {
							'flex items-center justify-center':
								isBarDataLoading || isLineDataLoading || isTableDataLoading,
						})}
					>
						{isBarDataLoading || isLineDataLoading || isTableDataLoading ? (
							<div className='flex grow flex-col items-center justify-center bg-white lg:h-full'>
								<CircularProgress size={80} color='primary' />
							</div>
						) : (
							<>
								<Typography className='text-md font-semibold' component='div'>
									{t('compareFarmerRicePlotBound', { ns: 'annual-analysis' })} ({t(areaUnit)})
								</Typography>
								{barColorArr && (
									<>
										<RiceStatisticBar
											riceBarColumns={riceBarColumns}
											riceBarColorArr={barColorArr}
											key={JSON.stringify(riceBarColumns)}
										/>
									</>
								)}
							</>
						)}
					</Box>
				</Grid>
				<Grid item xs={6}>
					<Box
						className={clsx('h-[488px] rounded bg-white p-[24px] shadow', {
							'flex items-center justify-center':
								isBarDataLoading || isLineDataLoading || isTableDataLoading,
						})}
					>
						{isBarDataLoading || isLineDataLoading || isTableDataLoading ? (
							<div className='flex grow flex-col items-center justify-center bg-white lg:h-full'>
								<CircularProgress size={80} color='primary' />
							</div>
						) : (
							<>
								<Typography className='text-md font-semibold' component='div'>
									{t('compareFarmerYearlyPlotBound', { ns: 'annual-analysis' })} ({t(areaUnit)})
								</Typography>
								{lineColorArr && (
									<>
										<RiceStatisticLine
											riceLineColumns={riceLineColumns}
											riceLineColorArr={lineColorArr}
											lineCategoriesArr={lineCategoriesArr}
											key={JSON.stringify(lineColorArr)}
										/>
									</>
								)}
							</>
						)}
					</Box>
				</Grid>
			</Grid>
			<Box
				className={clsx('capture mt-3 h-[612px] bg-white', {
					'flex items-center justify-center': isBarDataLoading || isLineDataLoading || isTableDataLoading,
				})}
			>
				{isBarDataLoading || isLineDataLoading || isTableDataLoading ? (
					<div className='flex grow flex-col items-center justify-center bg-white lg:h-full'>
						<CircularProgress size={80} color='primary' />
					</div>
				) : (
					<>
						<RiceStatisticTable riceTableData={riceTableData?.data} />
					</>
				)}
			</Box>
		</Box>
	)
}

export default RiceStatistic
