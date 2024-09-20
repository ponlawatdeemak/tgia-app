'use client'

import React, { useEffect } from 'react'
import { Paper } from '@mui/material'
import useMapPin from './context'

type PoisIconType = {
	coordinates: [longitude: number, latitude: number]
	createdAt: string
	lat: number
	lng: number
	poiId: string
	title: string
	updatedAt: string
	userId: string
}

type ClickPinInfo = {
	x: number
	y: number
	area: PoisIconType
}

interface InfoPinTitleProps {
	clickPinInfo: ClickPinInfo | null
	setClickPinInfo: React.Dispatch<React.SetStateAction<ClickPinInfo | null>>
}

const InfoPinTitle: React.FC<InfoPinTitleProps> = ({ clickPinInfo, setClickPinInfo }) => {
	const { open } = useMapPin()

	useEffect(() => {
		if (!open) {
			setClickPinInfo(null)
		}
	}, [open])

	if (!clickPinInfo || !clickPinInfo.area) {
		return null
	}

	return (
		<Paper
			className='absolute z-10 box-border flex items-center justify-center bg-white p-2 shadow-xl'
			style={{ left: clickPinInfo.x + 10, top: clickPinInfo.y - 50 }}
		>
			<span className='text-sm font-medium text-black'>{clickPinInfo.area.title}</span>
		</Paper>
	)
}

export default InfoPinTitle
