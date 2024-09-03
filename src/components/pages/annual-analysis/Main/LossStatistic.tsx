import React from 'react'
import bb, { bar, ChartOptions, line } from 'billboard.js'
import 'billboard.js/dist/billboard.css'
import BillboardJS, { IChart } from '@billboard.js/react'
import { Box, Grid, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
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
import { LossType } from '@/enum'
import LossStatisticBar from '../LossStatistic/LossStatisticBar'
import LossStatisticLine from '../LossStatistic/LossStatisticLine'
import LossStatisticTable from '../LossStatistic/LossStatisticTable'

type lineColorType = {
	[key: string]: string
}

const LossStatistic = () => {
	const { queryParams } = useSearchAnnualAnalysis()
	const { isDesktop } = useResponsive()
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['default'])
	const language = i18n.language as keyof ResponseLanguage

	const [currentLossType, setCurrentLossType] = React.useState<string>('total') //drought //flood

	// bar chart
	const [barColorArr, setBarColorArr] = React.useState<lineColorType | null>(null) //array dynamic
	const [lossBarColumns, setLossBarColumns] = React.useState<any | null>(null)
	const [barGroupArr, setBarGroupArr] = React.useState<string[][] | null>(null)

	// line chart
	const [lineColorArr, setLineColorArr] = React.useState<lineColorType | null>(null) // array dynamic
	const [lossLineColumns, setLossLineColumns] = React.useState<(number | string)[][]>([])
	const [lineCategoriesArr, setLineCategoriesArr] = React.useState<string[]>([])

	const { data: lossTableData, isLoading: isTableDataLoading } = useQuery({
		queryKey: ['getTableLossStatistic', queryParams],
		queryFn: async () => {
			const res = await service.annualAnalysis.getTableLossStatistic(queryParams)
			console.log('Loss Table :: ', res)
			return res
		},
		enabled: true,
	})

	const handleTypeClick = (_event: React.MouseEvent<HTMLElement>) => {
		const target = _event.target as HTMLInputElement
		setCurrentLossType(target.value)
	}

	const { data: lossLineData, isLoading: isLineDataLoading } = useQuery({
		queryKey: ['getLineLossStatistic', queryParams],
		queryFn: async () => {
			const res = await service.annualAnalysis.getLineLossStatistic(queryParams)
			// console.log('Loss Line :: ', res)
			return res
		},
		enabled: true,
	})

	const { data: lossBarData, isLoading: isBarDataLoading } = useQuery({
		queryKey: ['getBarLossStatistic', queryParams],
		queryFn: async () => {
			const res = await service.annualAnalysis.getBarLossStatistic(queryParams)
			// console.log('Loss Bar :: ', res)
			return res
		},
		enabled: true,
	})

	React.useEffect(() => {
		console.log('lossBarData :: ', lossBarData)
		if (lossBarData?.data && lossBarData?.legend) {
			// const tempBarColumns = [['x']] as (string | number)[][]
			// [
			//     [
			//         'x',
			//         'พื้นที่แจ้งความเสียหาย (กษ 02)',
			//         'พื้นที่ประมาณการเยียวยา',
			//         'พื้นที่เสียหายจากระบบวิเคราะห์',
			//     ],
			//     ['ภัยแล้ง', 100000, 510000, 150000],
			//     ['น้ำท่วม', 1620000, 1020000, 300000],
			//     ['ไม่มีภัยพิบัติ', 4800000, 5400000, 6500000],
			// ]
			// const tempBarColor: lineColorType = {}
			// {
			//     ภัยแล้ง: '#EA4032FF',
			//     น้ำท่วม: '#1B77B1FF',
			//     ไม่มีภัยพิบัติ: '#545454FF',
			// }
			// const tempBarGroup = []
			// [['ภัยแล้ง', 'น้ำท่วม', 'ไม่มีภัยพิบัติ']]

			const tempBarColumns: (string | number)[][] = [['x']]
			const tempBarColor: { [key: string]: string } = {}
			const tempBarGroup: string[][] = [[]]

			tempBarColumns[0] = ['x', ...lossBarData.data.map((item) => item.name[language])]

			lossBarData.legend.items.forEach((legendItem) => {
				const row: (string | number)[] = [legendItem.label[language]]
				lossBarData.data?.forEach((dataItem) => {
					const category = dataItem.categories.find(
						(cat) => cat.label[language] === legendItem.label[language],
					)
					if (category) {
						row.push(category.value.area[areaUnit])
					}
				})
				tempBarColumns.push(row)
				tempBarColor[legendItem.label[language]] = legendItem.color
				tempBarGroup[0].push(legendItem.label[language])
			})

			// console.log('tempBarColumns :: ', tempBarColumns)
			// console.log('tempBarColor :: ', tempBarColor)
			// console.log('tempBarGroup :: ', tempBarGroup)
			setLossBarColumns(tempBarColumns)
			setBarColorArr(tempBarColor)
			setBarGroupArr(tempBarGroup)
		}
	}, [lossBarData, areaUnit, language])

	React.useEffect(() => {
		// console.log('lossLineData :: ', lossLineData)
		if (lossLineData?.values && lossLineData?.data && lossLineData?.legend) {
			const tempLineColumns: (number | string)[][] = []
			const tempLineColor: lineColorType = {}
			const tempLineCategories: string[] = []

			for (let i = 0; i < lossLineData?.values?.length; i++) {
				const label: string = lossLineData.values[i].label[language]
				const areas: number[] = lossLineData.values[i].area[areaUnit]
				const tempArr: (number | string)[] = [label, ...areas]
				tempLineColumns.push(tempArr)
			}
			for (let i = 0; i < lossLineData.data.length; i++) {
				tempLineCategories.push(lossLineData.data[i].name[language])
			}
			for (let i = 0; i < lossLineData.legend.items.length; i++) {
				const label: string = lossLineData.legend.items[i].label[language]
				if (label) {
					tempLineColor[label] = lossLineData.legend.items[i].color
				} else {
					// some error handling
				}
			}
			// console.log('tempLineColumns :: ', tempLineColumns)
			// console.log('tempLineColor :: ', tempLineColor)
			// console.log('tempLineCategories :: ', tempLineCategories)

			setLineColorArr(tempLineColor)
			setLossLineColumns(tempLineColumns)
			setLineCategoriesArr(tempLineCategories)
		}
	}, [lossLineData, areaUnit, language])

	return (
		<Box>
			{/* text font Anuphan ไม่ส่งต่อให้ text ใน g element svg ใน BillboardJS*/}
			<Box className='flex-start flex pb-[24px] pr-[24px]'>
				<ToggleButtonGroup
					// value={queryParams.lossType}
					exclusive
					onChange={handleTypeClick}
					aria-label='loss-type'
					className='flex gap-4 max-lg:py-3 lg:gap-1 [&_*]:rounded [&_*]:border-none [&_*]:px-3 [&_*]:py-1.5 lg:[&_*]:rounded-lg'
				>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': currentLossType === 'total',
							'text-gray-dark2': currentLossType !== 'total',
						})}
						value={'total'}
					>
						{t('allDisasters')}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': currentLossType === 'drought',
							'text-gray-dark2': currentLossType !== 'drought',
						})}
						value={'drought'}
					>
						{t('drought')}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': currentLossType === 'flood',
							'text-gray-dark2': currentLossType !== 'flood',
						})}
						value={'flood'}
					>
						{t('flood')}
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>
			<Grid container rowSpacing={1} columnSpacing={1.5} direction={isDesktop ? 'row' : 'column'}>
				<Grid item xs={6}>
					<Box className='h-[488px] rounded bg-white p-[24px] shadow'>
						<Typography className='text-md font-semibold' component='div'>
							เปรียบเทียบพื้นที่เสียหาย (เฉพาะที่มีขอบแปลงเท่านั้น)
						</Typography>
						{barColorArr && barGroupArr && lossBarColumns && (
							<>
								<LossStatisticBar
									key={JSON.stringify(barGroupArr)}
									lossBarColumns={lossBarColumns}
									lossBarColorArr={barColorArr}
									lossBarGroupArr={barGroupArr}
								/>
							</>
						)}
					</Box>
				</Grid>
				<Grid item xs={6}>
					<Box className='h-[488px] rounded bg-white p-[24px] shadow'>
						<Typography className='text-md font-semibold' component='div'>
							เปรียบเทียบพื้นที่เสียหายรายปี (เฉพาะที่มีขอบแปลงเท่านั้น)
						</Typography>
						{lineColorArr && (
							<>
								<LossStatisticLine
									lossLineColumns={lossLineColumns}
									lossLineColorArr={lineColorArr}
									lossCategoriesArr={lineCategoriesArr}
									key={JSON.stringify(lineColorArr)}
								/>
							</>
						)}
					</Box>
				</Grid>
			</Grid>
			<Box className='mt-3'>
				<LossStatisticTable lossTableData={lossTableData?.data} />
			</Box>
		</Box>
	)
}

export default LossStatistic
