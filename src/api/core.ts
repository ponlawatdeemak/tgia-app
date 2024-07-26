import axios, { AxiosError, AxiosInstance } from 'axios'
import service, { ResponseDto } from './index'

interface AppAPI extends AxiosInstance {
	fetch: (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<ResponseDto<any>>
}

export let apiAccessToken: string | null = null
let apiRefreshToken: string | null = null
let apiUserId: string | null = null

const instance = axios.create({
	baseURL: process.env.API_URL,
	headers: {
		'x-api-key': process.env.API_KEY || '',
	},
})

export const api: AppAPI = instance as AppAPI

api['fetch'] = async (input: URL | RequestInfo, init?: RequestInit | undefined): Promise<ResponseDto<any>> => {
	const res = await fetchAPI(input, init)

	if (!res.ok) {
		if (res.status === 403) {
			try {
				await refreshAccessToken()
				const res = await fetchAPI(input, init)
				if (!res.ok) {
					return { errorStatus: res.status, error: await res.json() }
				}
				return await res.json()
			} catch (error) {
				forceLogout()
			}
		}
		return { errorStatus: res.status, error: await res.json() }
	}

	return await res.json()
}

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
	window.location.href = href.includes('?')
		? query?.includes('sessionExpired=1')
			? href
			: href + '&sessionExpired=1'
		: href + '?sessionExpired=1'
}

instance.interceptors.response.use(
	(response) => {
		return response
	},
	async function (error) {
		if (isAxiosError(error) && error.config && error.response?.status === 401) {
			try {
				const originalRequest = error.config as any
				if (!originalRequest?._retry) {
					originalRequest._retry = true
					const { accessToken } = await refreshAccessToken()
					return instance({
						...originalRequest,
						headers: {
							...originalRequest.headers,
							authorization: `Bearer ${accessToken}`,
						},
					}).catch((err) => {
						forceLogout()
					})
				}
			} catch (err) {
				return Promise.reject(err)
			}
		}
		return Promise.reject(error)
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

function isAxiosError<TInput = unknown, TOutput = any>(obj: unknown): obj is AxiosError<TInput, TOutput> {
	return obj instanceof AxiosError
}
