import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				primary: {
					// light: '#4870D8',
					DEFAULT: '#0C626D',
					// dark: '#000982',
				},
				black: '#202020',
				white: '#FFFFFF',
				background: '#E9EEF6',
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
