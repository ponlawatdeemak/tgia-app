import React from 'react'
import BillboardJS, { IChart } from '@billboard.js/react'
import bb, { line } from 'billboard.js'
import { useTranslation } from 'react-i18next'
import { ResponseLanguage } from '@/api/interface'

interface PlantStatisticLineProps {
	plantLineColumns?: any
	plantLineColorArr?: any
	lineCategoriesArr?: any
}

const PlantStatisticLine: React.FC<PlantStatisticLineProps> = ({
	plantLineColumns,
	plantLineColorArr,
	lineCategoriesArr,
}) => {
	const plantLineChart = React.useRef<IChart>(null)
	const { i18n } = useTranslation(['default'])
	const language = i18n.language as keyof ResponseLanguage

	const barOption = React.useMemo(() => {
		return {
			size: {
				height: 462,
			},
			data: {
				// 4 lines พื้นที่ทบก. ทั้งหมด , พื้นที่ ทบก. มีขอบแปลง , พื้นที่เอาประกันทั้งหมด , พื้นที่เอาประกันที่มีขอบแปลง
				// ['x', '2562', '2563', '2564', '2565', '2566'],
				columns: plantLineColumns,
				// [
				//     ['พื้นที่ทบก. ทั้งหมด', 10000, 20000, 30000, 40000, 50000],
				//     ['พื้นที่ ทบก. มีขอบแปลง', 5000, 15000, 21000, 31000, 25000],
				//     ['พื้นที่เอาประกันทั้งหมด', 17500, 22000, 23000, 45000, 51000],
				//     ['พื้นที่เอาประกันที่มีขอบแปลง', 12000, 45000, 32000, 18000, 48000],
				// ],
				type: line(),
				// color: (color: string, d: any) => {
				// 	return ['#545454FF', '#959595', '#B1334C', '#E7A9B5'][d.index]
				// }
				colors: plantLineColorArr,
				// {
				// 	'พื้นที่ทบก. ทั้งหมด': '#545454FF',
				// 	'พื้นที่ ทบก. มีขอบแปลง': '#959595',
				// 	พื้นที่เอาประกันทั้งหมด: '#B1334C',
				// 	พื้นที่เอาประกันที่มีขอบแปลง: '#E7A9B5',
				// },
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
					categories: lineCategoriesArr,
				},
				y: {
					tick: {
						format: (x: number) => {
							return x.toLocaleString()
						},
					},
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
				top: 10,
			},
			legend: {
				position: 'bottom',
			},
		}
	}, [plantLineColumns, plantLineColorArr, language])

	React.useEffect(() => {
		const chart = plantLineChart.current?.instance
		if (chart) {
			// chart.unload()
			chart.load({
				columns: plantLineColumns,
				append: false,
			})
		}
	}, [plantLineColumns, plantLineColorArr, lineCategoriesArr, language])

	// pass columns data and plantBarColorArr as props create option
	return <BillboardJS bb={bb} options={barOption} ref={plantLineChart} className={'bb annual-analysis-line'} />
}

export default PlantStatisticLine
