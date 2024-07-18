'use client'
import React, { useRef } from 'react'
import 'maplibre-gl/dist/maplibre-gl.css'
import MapView from '@/components/common/map/MapView'
import classNames from 'classnames'

export default function PlaygroundPage() {
	const popupNode = useRef<HTMLDivElement>(null)

	return (
		<main>
			<div className='relative h-[calc(100vh-106px)] w-full'>
				<MapView
					className={`border-default rounded-lg border`}
					onClick={() => {
						console.log('onClick')
					}}
					disableBasemapList={false}
					busy={false}
				>
					<div>
						<div
							ref={popupNode}
							className={classNames(`m-4 mb-[8px] mt-[24px] flex max-h-80 flex-col text-[16px]`)}
						>
							{/* <Info feature={feature} /> */}
						</div>
					</div>
				</MapView>
			</div>
		</main>
	)
}

function Info({ feature }: { feature: String }) {
	return (
		<div>
			<div className='pt-6'>{feature}</div>
		</div>
	)
}
