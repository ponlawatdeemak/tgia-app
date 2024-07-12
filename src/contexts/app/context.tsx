import SplashScreen from '@/components/SplashScreen'
import { createContext, PropsWithChildren, useMemo, useState } from 'react'

interface AppContextValue {
	appUrl: string
	modalOpen: boolean
	ready: boolean
	showSplashScreen: boolean
}
interface AppContextFunction {
	setReady: (show: boolean) => void
	setShowSplashScreen: (show: boolean) => void
}
type AppContextProps = AppContextValue & AppContextFunction

const defaultValue: AppContextValue = {
	appUrl: '',
	modalOpen: false,
	ready: false,
	showSplashScreen: false,
}

export const AppContext = createContext<AppContextProps>({
	...defaultValue,
	setReady(show: boolean) {},
	setShowSplashScreen(show: boolean) {},
})

const defaultModalProps = {
	open: false,
	centered: true,
	title: '',
	footer: null,
}

export interface AppProviderProps extends PropsWithChildren {
	appUrl: string
}

export function AppProvider({ children, appUrl }: AppProviderProps) {
	const [ready, setReady] = useState<boolean>(false)
	const [showSplashScreen, setShowSplashScreen] = useState<boolean>(false)

	const contextValue = useMemo<AppContextProps>(() => {
		return {
			...defaultValue,
			appUrl,
			ready,
			setReady,
			showSplashScreen,
			setShowSplashScreen,
		}
	}, [appUrl, ready, setReady, showSplashScreen, setShowSplashScreen])

	return (
		<>
			<AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
			<SplashScreen show={!ready || showSplashScreen} />
		</>
	)
}
