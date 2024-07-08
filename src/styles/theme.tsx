'use client'

import { Noto_Sans_Thai } from 'next/font/google'
import { createTheme } from '@mui/material/styles'

const noto = Noto_Sans_Thai({ subsets: ['latin'] })

const theme = createTheme({
	typography: {
		fontFamily: noto.style.fontFamily,
	},
	palette: {
		primary: {
			// light: '#4870D8',
			main: '#0C626D',
			// dark: '#000982',
		},
	},
})

export default theme
