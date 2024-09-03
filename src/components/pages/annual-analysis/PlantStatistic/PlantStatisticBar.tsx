import React from 'react'
import BillboardJS, { IChart } from '@billboard.js/react'
import bb, { bar, ChartOptions, line } from 'billboard.js'
import useAreaType from '@/store/area-type'
import useAreaUnit from '@/store/area-unit'
import { useTranslation } from 'react-i18next'
import { ResponseLanguage } from '@/api/interface'

interface PlantStatisticTableProps {
	plantBarColumns?: any
	plantBarColorArr?: any
}

const PlantStatisticBar: React.FC<PlantStatisticTableProps> = ({ plantBarColumns, plantBarColorArr }) => {
	const plantBarChart = React.useRef<IChart>(null)
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['default'])
	const language = i18n.language as keyof ResponseLanguage

	const barOption = React.useMemo(() => {
		return {
			size: {
				height: 442,
			},
			data: {
				x: 'x',
				columns: [],
				type: bar(),
				labels: {
					centered: true,
					colors: 'white' as string,
					format: (x: number) => {
						return x.toLocaleString()
					},
				},
				color: function (color: string, d: any) {
					return plantBarColorArr[d.index]
				},
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
	}, [plantBarColumns, plantBarColorArr])

	React.useEffect(() => {
		const chart = plantBarChart.current?.instance
		// console.log('plantBarColumns :: ', plantBarColumns)
		if (chart) {
			chart.load({
				columns: plantBarColumns,
			})
		}
	}, [plantBarColumns, plantBarColorArr])

	// pass columns data and plantBarColorArr as props create option
	return <BillboardJS bb={bb} options={barOption} ref={plantBarChart} className={'bb annual-analysis-bar'} />
}

export default PlantStatisticBar
