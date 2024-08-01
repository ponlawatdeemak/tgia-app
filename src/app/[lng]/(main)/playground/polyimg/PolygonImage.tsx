import { FeatureCollection, Polygon } from 'geojson'
import { geoPath, geoMercator } from 'd3-geo'
import classNames from 'classnames'

export interface PolygonImageProps {
	polygon: Polygon | null
	geoColorBackground?: string
	geoColorLine?: string
	geoLineSize?: number
	backgroundColor?: string
	width?: number
	height?: number
	padding?: number
	className?: string
}

const PolygonImage: React.FC<PolygonImageProps> = ({
	polygon,
	geoColorBackground = '#03914d',
	geoColorLine = '#000000',
	geoLineSize = 0.5,
	backgroundColor = '#e3e3e3',
	width = 360,
	height = 360,
	padding = 10,
	className,
}) => {
	if (!polygon || polygon.type !== 'Polygon') {
		return (
			<div
				className={classNames(
					'inline-flex items-center justify-center',
					'rounded-sm border border-solid border-black',
					className,
				)}
				style={{ width: width, height: height, backgroundColor: backgroundColor }}
			>
				แสดงไม่ได้ครับ
			</div>
		)
	}
	const geojson: FeatureCollection<Polygon> = {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				geometry: polygon,
				properties: {},
			},
		],
	}
	const svgWidth = width - padding
	const svgHeight = height - padding
	const pathData = geoPath(geoMercator().fitSize([svgWidth, svgHeight], geojson))(geojson) || undefined
	return (
		<div
			className={classNames(
				'inline-flex items-center justify-center',
				'rounded-sm border border-solid border-black',
				className,
			)}
			style={{ width: width, height: height, backgroundColor: backgroundColor }}
		>
			<svg width={svgWidth} height={svgHeight}>
				<path
					d={pathData}
					fill={geoColorBackground}
					fillOpacity={geoLineSize}
					stroke={geoColorLine}
					transform='translate(4, 4)'
				/>
			</svg>
		</div>
	)
}

export default PolygonImage
