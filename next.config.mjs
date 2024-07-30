/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		API_URL: process.env.API_URL,
		API_KEY: process.env.API_KEY,
		API_URL_DISASTER: process.env.API_URL_DISASTER,
		API_KEY_DISASTER: process.env.API_KEY_DISASTER,
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		APP_USERNAME: process.env.APP_USERNAME || '',
		APP_PASSWORD: process.env.APP_PASSWORD || '',
		GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
		GOOGLE_MAPS_API_MAP_ID: process.env.GOOGLE_MAPS_API_MAP_ID
	},
}

export default nextConfig