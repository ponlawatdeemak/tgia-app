import React from 'react'
import BillboardJS, { IChart } from '@billboard.js/react'
import bb, { bar } from 'billboard.js'

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
					backgroundColors: lossBarColorArr,
					format: (x: number) => {
						return isBarInteger ? x.toLocaleString() : x.toLocaleString() + ' %'
					},
					position: function (type: any, v: any, id: any, i: any, texts: any) {
						let pos = 0
						if (type === 'y') {
							pos = -(
								texts
									.data()
									.filter((item: any) => item.index === i)
									.map((subItem: any) => subItem.id)
									.indexOf(id) * 20
							)
						}
						return pos
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
							return isBarInteger ? usformatter.format(x) : usformatter.format(x) + '%'
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
				// mode: 'fit' as const,
				// bottom: 20,
				// right: 100,
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
