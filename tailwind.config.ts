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
					// light: '#4870D8',
					DEFAULT: 'var(--primary-color-1)',
					// dark: '#000982',
				},
				secondary: {
					DEFAULT: 'var(--secondary-color-1)',
				},
				yellow: {
					DEFAULT: 'var(--yellow-color-1)',
				},
				success: {
					DEFAULT: 'var(--success-color-1)',
				},
				error: {
					DEFAULT: 'var(--error-color-1)',
				},
				gray: {
					light: 'var(--lightest-gray-color)',
					DEFAULT: 'var(--light-gray-color)',
					dark: 'var(--dark-gray-color)',
				},
				black: 'var(--black-color)',
				white: 'var(--white-color)',
				background: 'var(--background-color)',
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
