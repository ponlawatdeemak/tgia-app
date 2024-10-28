import React from 'react'
import BillboardJS, { IChart } from '@billboard.js/react'
import bb, { bar } from 'billboard.js'

interface PlantStatisticTableProps {
	riceBarColumns?: any
	riceBarColorArr?: any
}

const RiceStatisticBar: React.FC<PlantStatisticTableProps> = ({ riceBarColumns, riceBarColorArr }) => {
	const plantBarChart = React.useRef<IChart>(null)

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
					return riceBarColorArr[d.index]
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
	}, [riceBarColumns, riceBarColorArr])

	React.useEffect(() => {
		const chart = plantBarChart.current?.instance
		// console.log('riceBarColumns :: ', riceBarColumns)
		if (chart) {
			chart.load({
				columns: riceBarColumns,
			})
		}
	}, [riceBarColumns, riceBarColorArr])

	// pass columns data and riceBarColorArr as props create option
	return <BillboardJS bb={bb} options={barOption} ref={plantBarChart} className={'bb annual-analysis-bar'} />
}

export default RiceStatisticBar
