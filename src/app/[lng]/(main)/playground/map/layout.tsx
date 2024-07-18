'use client'
import AppBar from '@/components/AppBar'
import { MapProvider } from '@/store/contexts/map'
import React, { PropsWithChildren } from 'react'

interface PlayGroundMapLayoutProps extends PropsWithChildren {}

const PlayGroundMapLayout: React.FC<PlayGroundMapLayoutProps> = ({ children }) => {
	return <MapProvider>{children}</MapProvider>
}

export default PlayGroundMapLayout
