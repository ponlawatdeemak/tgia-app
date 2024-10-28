import React from 'react'
import 'billboard.js/dist/billboard.css'
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
import clsx from 'clsx'
type lineColorType = {
	[key: string]: string
}

const PlantStatistic = () => {
	const { queryParams } = useSearchAnnualAnalysis()
	const { isDesktop } = useResponsive()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['default', 'annual-analysis'])
	const language = i18n.language as keyof ResponseLanguage

	// bar chart
	const [barColorArr, setBarColorArr] = React.useState<string[] | null>(null) //array dynamic
	const [plantBarColumns, setPlantBarColumns] = React.useState<any>()

	// line chart
	const [lineColorArr, setLineColorArr] = React.useState<lineColorType | null>(null) // array dynamic
	const [plantLineColumns, setPlantLineColumns] = React.useState<(number | string)[][]>([])
	const [lineCategoriesArr, setLineCategoriesArr] = React.useState<string[]>([])

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
			// console.log('Plant Bar :: ', res)
			return res
		},
		enabled: true,
	})

	React.useEffect(() => {
		// console.log('plantBarData :: ', plantBarData)
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
				// console.log('areaUnit Plot :: ', plantBarData?.data[i]?.categories[0]?.value?.area[areaUnit], areaUnit)
			}
			// console.log('tempBarColumns :: ', tempBarColumns)
			for (let i = 0; i < plantBarData?.legend.items.length; i++) {
				tempBarColor.push(plantBarData?.legend.items[i].color)
			}
			setBarColorArr(tempBarColor)
			setPlantBarColumns(tempBarColumns)
		}
	}, [plantBarData, areaUnit, language])

	React.useEffect(() => {
		// console.log('plantLineData :: ', plantLineData)
		if (plantLineData?.values && plantLineData?.data && plantLineData?.legend) {
			const tempLineColumns: (number | string)[][] = []
			const tempLineColor: lineColorType = {}
			const tempLineCategories: string[] = []

			for (let i = 0; i < plantLineData?.values?.length; i++) {
				const label: string = plantLineData.values[i].label[language]
				const areas: number[] = plantLineData.values[i].area[areaUnit]
				const tempArr: (number | string)[] = [label, ...areas]
				tempLineColumns.push(tempArr)
			}
			for (let i = 0; i < plantLineData.data.length; i++) {
				tempLineCategories.push(plantLineData.data[i].name[language])
			}
			for (let i = 0; i < plantLineData.legend.items.length; i++) {
				const label: string = plantLineData.legend.items[i].label[language]
				if (label) {
					tempLineColor[label] = plantLineData.legend.items[i].color
				} else {
					// some error handling
				}
			}
			// console.log('tempLineColumns :: ', tempLineColumns)
			// console.log('tempLineColor :: ', tempLineColor)
			// console.log('tempLineCategories :: ', tempLineCategories)

			setLineColorArr(tempLineColor)
			setPlantLineColumns(tempLineColumns)
			setLineCategoriesArr(tempLineCategories)
		}
	}, [plantLineData, areaUnit, language])

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
									{t('totalArea', { ns: 'annual-analysis' })} ({t(areaUnit)})
								</Typography>
								{barColorArr && (
									<>
										<PlantStatisticBar
											plantBarColumns={plantBarColumns}
											plantBarColorArr={barColorArr}
											key={JSON.stringify(plantBarColumns)}
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
									{t('compareTotalAreaYearly', { ns: 'annual-analysis' })} ({t(areaUnit)})
								</Typography>
								{lineColorArr && (
									<>
										<PlantStatisticLine
											plantLineColumns={plantLineColumns}
											plantLineColorArr={lineColorArr}
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
						<PlantStatisticTable plantTableData={plantTableData?.data} />
					</>
				)}
			</Box>
		</Box>
	)
}

export default PlantStatistic
