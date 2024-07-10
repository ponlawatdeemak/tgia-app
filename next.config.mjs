/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		API_URL: process.env.API_URL,
		API_KEY: process.env.API_KEY,
		APP_USERNAME: process.env.APP_USERNAME || '',
		APP_PASSWORD: process.env.APP_PASSWORD || '',
	},
}

export default nextConfig
