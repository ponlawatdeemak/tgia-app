import { DroughtTileColor, FloodTileColor, LossTypeColor } from './src/config/color'
import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		fontSize: {
			'2xs': ['var(--font-size-2xs)', 'var(--line-height-2xs)'],
			xs: ['var(--font-size-xs)', 'var(--line-height-xs)'],
			sm: ['var(--font-size-sm)', 'var(--line-height-sm)'],
			base: ['var(--font-size-base)', 'var(--line-height-base)'],
			md: ['var(--font-size-md)', 'var(--line-height-md)'],
			lg: ['var(--font-size-lg)', 'var(--line-height-lg)'],
			xl: ['var(--font-size-xl)', 'var(--line-height-xl)'],
			'2xl': ['var(--font-size-2xl)', 'var(--line-height-2xl)'],
		},
		extend: {
			colors: {
				primary: {
					DEFAULT: 'var(--primary-color-1)',
				},
				secondary: {
					DEFAULT: 'var(--secondary-color-1)',
				},
				yellow: {
					DEFAULT: 'var(--yellow-color-1)',
				},
				success: {
					light: 'var(--light-green-color)',
					DEFAULT: 'var(--success-color-1)',
				},
				error: {
					DEFAULT: 'var(--error-color-1)',
					light: 'var(--error-color-2)',
				},
				gray: {
					light: 'var(--lightest-gray-color)',
					light2: 'var(--lightest-gray-color2)',
					light3: 'var(--lightest-gray-color3)',
					DEFAULT: 'var(--light-gray-color)',
					dark: 'var(--dark-gray-color)',
					dark2: 'var(--dark-gray-color2)',
					dark3: 'var(--dark-gray-color3)',
				},
				black: {
					light: 'var(--light-black-color)',
					DEFAULT: 'var(--black-color)',
					dark: '#000000',
				},
				background: 'var(--background-color)',
				lossType: {
					DEFAULT: LossTypeColor.total,
					drought: LossTypeColor.drought,
					flood: LossTypeColor.flood,
					noData: LossTypeColor.noData,
				},
				droughtTileColor: {
					level1: DroughtTileColor.level1,
					level2: DroughtTileColor.level2,
					level3: DroughtTileColor.level3,
					level4: DroughtTileColor.level4,
					level5: DroughtTileColor.level5,
				},
				floodTileColor: {
					level1: FloodTileColor.level1,
					level2: FloodTileColor.level2,
					level3: FloodTileColor.level3,
					level4: FloodTileColor.level4,
					level5: FloodTileColor.level5,
				},
			},
		},
	},
	plugins: [],
	corePlugins: {
		// Remove the Tailwind CSS preflight styles so it can use Material UI's preflight instead (CssBaseline).
		preflight: false,
	},
}
export default config
