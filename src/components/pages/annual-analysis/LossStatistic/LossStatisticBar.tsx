import React from 'react'
import BillboardJS, { IChart } from '@billboard.js/react'
import bb, { bar, ChartOptions, line } from 'billboard.js'
import useAreaType from '@/store/area-type'
import useAreaUnit from '@/store/area-unit'
import { useTranslation } from 'react-i18next'
import { ResponseLanguage } from '@/api/interface'

interface PlantStatisticTableProps {
	lossBarColumns?: any
	lossBarColorArr?: any
	lossBarGroupArr?: any
	isBarInteger?: boolean
}

const LossStatisticBar: React.FC<PlantStatisticTableProps> = ({
	lossBarColumns,
	lossBarColorArr,
	lossBarGroupArr,
	isBarInteger,
}) => {
	const lossBarChart = React.useRef<IChart>(null)
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
				order: 'asc' as const,
				groups: lossBarGroupArr,
				type: bar(),
				labels: {
					centered: true,
					colors: 'white' as string,
					format: (x: number) => {
						return isBarInteger ? x.toLocaleString() : x.toLocaleString() + ' %'
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
							return isBarInteger ? usformatter.format(x) : usformatter.format(x) + ' %'
						},
					},
				},
			},
			legend: {
				show: true,
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
	}, [lossBarColumns, lossBarColorArr])

	React.useEffect(() => {
		const chart = lossBarChart.current?.instance
		// console.log('lossBarColumns :: ', lossBarColumns)
		if (chart) {
			chart.load({
				columns: lossBarColumns,
			})
		}
	}, [lossBarColumns, lossBarColorArr])

	// pass columns data and lossBarColorArr as props create option
	return <BillboardJS bb={bb} options={barOption} ref={lossBarChart} className={'bb annual-analysis-bar'} />
}

export default LossStatisticBar
