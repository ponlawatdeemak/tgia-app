import { Dispatch, useContext, useMemo } from 'react'
import { AppContext } from './context'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
const { publicRuntimeConfig, serverRuntimeConfig } = getConfig()

export interface PublicRuntimeConfig {
	apiUrl: string
	coreUrl: string
	coreApiKey: string
	coreAppId: string
	lineNotifyId: string
	googleTagId: string
	map: {
		google: string
		mapbox: string
	}
	layer: {
		parcel: LayerConfig
	}
}

export interface LayerConfig {
	id: string
	url: string
}

export function useApp() {
	return useContext(AppContext)
}

export function useSplashScreen() {
	const { setShowSplashScreen } = useContext(AppContext)
	return {
		show: () => setShowSplashScreen(true),
		hide: () => setShowSplashScreen(false),
	}
}

export function useAppReady() {
	const { setReady } = useContext(AppContext)
	return () => setReady(true)
}

export function useConfig() {
	const router = useRouter()
	const appUrl = typeof location !== 'undefined' ? location.href : undefined
	const baseUrl = useMemo(
		() => (appUrl ? `${new URL(appUrl).origin}${router.basePath}` : ''),
		[appUrl, router.basePath],
	)
	return {
		publicRuntimeConfig: publicRuntimeConfig as PublicRuntimeConfig,
		serverRuntimeConfig,
		baseUrl,
	}
}
