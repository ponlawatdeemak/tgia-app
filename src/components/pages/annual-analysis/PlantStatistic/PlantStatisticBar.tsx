'use client'
import React from 'react'
import BillboardJS, { IChart } from '@billboard.js/react'
import bb, { bar } from 'billboard.js'

interface PlantStatisticTableProps {
	plantBarColumns?: any
	plantBarColorArr?: any
}

const PlantStatisticBar: React.FC<PlantStatisticTableProps> = ({ plantBarColumns, plantBarColorArr }) => {
	const plantBarChart = React.useRef<IChart>(null)
	const barOption = React.useMemo(() => {
		return {
			size: {
				height: 446,
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
			resize: {
				auto: true,
			},
		}
	}, [plantBarColumns, plantBarColorArr])

	React.useEffect(() => {
		const chart = plantBarChart.current?.instance
		// console.log('plantBarColumns :: ', plantBarColumns)
		if (chart) {
			// console.log('plantBarColumns :: ', plantBarColumns)
			chart.load({
				columns: plantBarColumns,
				append: false,
			})
		}
	}, [plantBarColumns, plantBarColorArr])

	// pass columns data and plantBarColorArr as props create option
	return <BillboardJS bb={bb} options={barOption} ref={plantBarChart} className={'bb annual-analysis-bar'} />
}

export default PlantStatisticBar
