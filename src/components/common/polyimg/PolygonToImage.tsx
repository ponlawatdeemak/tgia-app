'use client'
import { toPolygon } from '@/utils/geometry'
import classNames from 'classnames'
import { FeatureCollection, MultiPolygon, Polygon } from 'geojson'
import { GeoJSON2SVG, Options } from 'geojson2svg'
import { useEffect, useRef } from 'react'

export interface PolygonToImageProps {
	polygon?: Polygon
	fill?: string
	stroke?: string
	fillOpacity?: number
	strokeOpacity?: number
	backgroundColor?: string
	width?: number
	height?: number
	padding?: number
	className?: string
}

const PolygonToImage: React.FC<PolygonToImageProps> = ({
	polygon,
	fill = '#03914d',
	stroke = '#000000',
	fillOpacity = 0.5,
	strokeOpacity = 0.5,
	backgroundColor = '#F5F5F5',
	width = 160,
	height = 160,
	padding = 10,
	className,
}) => {
	const svgRef = useRef<SVGSVGElement>(null)
	const svgWidth = width - padding * 2
	const svgHeight = height - padding * 2

	useEffect(() => {
		if (polygon) {
			const geoJson: FeatureCollection<Polygon> = {
				type: 'FeatureCollection',
				features: [
					{
						type: 'Feature',
						geometry: polygon,
						properties: {},
					},
				],
			}
			const options: Options = {
				viewportSize: { width: svgWidth, height: svgHeight },
				attributes: {
					fill,
					'fill-opacity': fillOpacity.toString(),
					stroke,
					'stroke-opacity': strokeOpacity.toString(),
				},
			}
			const converter = new GeoJSON2SVG(options)
			const svgStrings = converter.convert(geoJson)
			if (svgRef.current && svgStrings[0]) {
				svgRef.current.innerHTML = svgStrings[0]
				const bbox = svgRef.current.getBBox()
				svgRef.current.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`)
			}
		}
	}, [polygon])

	return (
		<div
			className={classNames(
				'inline-flex items-center justify-center',
				'rounded-sm border border-solid border-black',
				className,
			)}
			style={{ width: width, height: height, backgroundColor: backgroundColor }}
		>
			{!polygon || polygon.type !== 'Polygon' ? (
				<div className='text-center'>
					<h2>No Plot </h2>
					<h2>Boundary</h2>
				</div>
			) : (
				<svg ref={svgRef} width={svgWidth} height={svgHeight}></svg>
			)}
		</div>
	)
}

export default PolygonToImage
