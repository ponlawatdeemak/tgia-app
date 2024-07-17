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

	}
}

export default nextConfig