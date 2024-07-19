/** @type {import('next').NextConfig} */
const nextConfig = {
	publicRuntimeConfig: {
		apiUrl: process.env.API_URL,
		apiKey: process.env.API_KEY,

		//for dev
		appUserName: process.env.APP_USERNAME || '',
		appPassword: process.env.APP_PASSWORD || '',
	},
	serverRuntimeConfig: {
		apiUrl: process.env.API_URL,
		apiKey: process.env.API_KEY,
	},
	env: {
        API_URL: process.env.API_URL,
        API_KEY: process.env.API_KEY,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        APP_USERNAME: process.env.APP_USERNAME || '',
        APP_PASSWORD: process.env.APP_PASSWORD || '',
    },
}

export default nextConfig