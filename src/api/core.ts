import { APIConfigType, APIService, AppAPI, RetryQueueItem } from '@/api/interface'
import axios, { AxiosRequestConfig } from 'axios'
import service from './index'

const APIConfigs: { [key: string]: APIConfigType } = {
	[APIService.WebAPI]: {
		baseURL: process.env.API_URL,
		apiKey: process.env.API_KEY,
	},
	[APIService.DisasterAPI]: {
		baseURL: process.env.API_URL_DISASTER,
		apiKey: process.env.API_KEY_DISASTER,
	},
	[APIService.TilesAPI]: {
		baseURL: process.env.API_URL_TILE,
		apiKey: process.env.API_KEY_TILE,
	},
}

export let apiAccessToken: string | null = null
let apiRefreshToken: string | null = null
let apiUserId: string | null = null
let isRefreshing = false
const refreshAndRetryQueue: RetryQueueItem[] = []

const instance = axios.create({
	baseURL: process.env.API_URL,
	headers: {
		'x-api-key': process.env.API_KEY || '',
	},
})

export const api: AppAPI = {
	...instance,
	get: async (url: string, service: APIService = APIService.WebAPI, config?: AxiosRequestConfig<any> | undefined) => {
		console.log('APIConfigs ', APIConfigs, APIConfigs[service].baseURL)
		console.log('process.env  ', process.env)
		return (await instance.get(url, getConfig(service, config)))?.data
	},
	post: async (
		url: string,
		data: any,
		service: APIService = APIService.WebAPI,
		config?: AxiosRequestConfig<any> | undefined,
	) => await instance.post(url, data, getConfig(service, config)),
	put: async (
		url: string,
		data: any,
		service: APIService = APIService.WebAPI,
		config?: AxiosRequestConfig<any> | undefined,
	) => await instance.put(url, data, getConfig(service, config)),
	delete: async (
		url: string,
		service: APIService = APIService.WebAPI,
		config?: AxiosRequestConfig<any> | undefined,
	) => await instance.delete(url, getConfig(service, config)),
}

const getConfig = (service: APIService, config: AxiosRequestConfig<any> | undefined) => ({
	...config,
	baseURL: APIConfigs[service].baseURL,
	headers: {
		'x-api-key': APIConfigs[service].apiKey || '',
	},
})

export const refreshAccessToken = async () => {
	const res = await service.auth.refreshToken({ userId: apiUserId || '', refreshToken: apiRefreshToken || '' })
	const accessToken = res?.tokens?.accessToken === '' ? undefined : res?.tokens?.accessToken
	const refreshToken = res?.tokens?.refreshToken === '' ? undefined : res?.tokens?.refreshToken
	updateAccessToken({ accessToken, refreshToken })
	return { accessToken, refreshToken }
}

const forceLogout = () => {
	// กรณีไม่สามารถต่ออายุ token ได้ จะบังคับ login ใหม่
	const href = window.location.href
	const query = href.split('?')?.[1]
	window.history.pushState(
		null,
		'',
		href.includes('?')
			? query?.includes('sessionExpired=1')
				? href
				: href + '&sessionExpired=1'
			: href + '?sessionExpired=1',
	)
}

instance.interceptors.response.use(
	(response) => {
		return response
	},
	async function (error) {
		const errorData = error.response.data
		const originalRequest: AxiosRequestConfig = error.config
		if (error.response && error.response.status === 403) {
			if (!isRefreshing) {
				isRefreshing = true
				try {
					// Refresh the access token
					const { accessToken } = await refreshAccessToken()

					// Update the request headers with the new access token
					error.config.headers['Authorization'] = `Bearer ${accessToken}`

					// Retry all requests in the queue with the new token
					refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
						instance
							.request(config)
							.then((response) => resolve(response))
							.catch((err) => reject(err))
					})

					// Clear the queue
					refreshAndRetryQueue.length = 0

					// Retry the original request
					return instance(originalRequest)
				} catch (refreshError) {
					// Handle token refresh error
					// You can clear all storage and redirect the user to the login page
					forceLogout()
					throw refreshError
				} finally {
					isRefreshing = false
				}
			}

			// Add the original request to the queue
			return new Promise<void>((resolve, reject) => {
				refreshAndRetryQueue.push({ config: originalRequest, resolve, reject })
			})
		}
		return Promise.reject({
			title: errorData.title,
			status: errorData.status,
			detail: errorData.detail,
		})
	},
)

export function updateAccessToken({
	accessToken,
	refreshToken,
	userId,
}: {
	accessToken?: string
	refreshToken?: string
	userId?: string
}) {
	if (accessToken) {
		instance.defaults.headers.common.authorization = 'Bearer ' + accessToken
		apiAccessToken = accessToken
		if (refreshToken) apiRefreshToken = refreshToken
		if (userId) apiUserId = userId
	} else {
		instance.defaults.headers.common.authorization = null
		apiAccessToken = null
		apiRefreshToken = null
		apiUserId = null
	}
}
