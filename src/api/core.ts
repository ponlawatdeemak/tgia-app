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
	patch: async (
		url: string,
		data: any,
		service: APIService = APIService.WebAPI,
		config?: AxiosRequestConfig<any> | undefined,
	) => await instance.patch(url, data, getConfig(service, config)),
}

const getConfig = (service: APIService, config: AxiosRequestConfig<any> | undefined) => ({
	...config,
	baseURL: APIConfigs[service].baseURL,
	headers: {
		'x-api-key': APIConfigs[service].apiKey || '',
	},
})

const fetchAPI = async (input: URL | RequestInfo, init?: RequestInit | undefined): Promise<Response> => {
	return await fetch((process.env.API_URL ?? '') + input, {
		...init,
		headers: {
			...init?.headers,
			'x-api-key': process.env.API_KEY || '',
			Authorization: `Bearer ${apiAccessToken}`,
		},
		cache: 'force-cache',
	})
}

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
		if (error.response && error.response.status === 403) {
			const originalRequest = error.config as any
			if (!originalRequest?._retry) {
				originalRequest._retry = true
				const { accessToken } = await refreshAccessToken()
				error.config.headers['Authorization'] = `Bearer ${accessToken}`

				return instance({
					...originalRequest,
					headers: {
						...originalRequest.headers,
						authorization: `Bearer ${accessToken}`,
					},
				}).catch((err) => {
					forceLogout()
					throw err
				})
			}
		}
		return Promise.reject({
			title: errorData.title || errorData.message,
			status: errorData.status || errorData.success,
			detail: errorData.detail,
			countImported: errorData?.countImported,
			data: errorData?.data,
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
