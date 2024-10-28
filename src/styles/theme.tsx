'use client'

import { Anuphan } from 'next/font/google'
import { createTheme } from '@mui/material/styles'

const anuphan = Anuphan({ subsets: ['latin'] })

const theme = createTheme({
	typography: {
		fontFamily: anuphan.style.fontFamily,
		fontSize: 14,
		button: {
			fontSize: 14,
		},
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
