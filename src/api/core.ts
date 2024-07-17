import axios, { AxiosError, AxiosInstance } from 'axios'
import { ResponseDto } from './index'
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
const { apiUrl, apiKey } = publicRuntimeConfig
interface AppAPI extends AxiosInstance {
	fetch: (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<ResponseDto<any>>
}

export let apiAccessToken = ''

const instance = axios.create({
	baseURL: apiUrl,
	headers: {
		'x-api-key': apiKey || '',
	},
})

export const api: AppAPI = instance as AppAPI

api['fetch'] = async (input: URL | RequestInfo, init?: RequestInit | undefined): Promise<ResponseDto<any>> => {
	const res = await fetch((apiUrl ?? '') + input, {
		...init,
		headers: {
			...init?.headers,
			'x-api-key': apiKey || '',
			Authorization: `Bearer ${apiAccessToken}`,
		},
		cache: 'force-cache',
	})

	if (!res.ok) throw new Error(`Failed to fetch data with status ${res.status}`)

	return res.json()
}

instance.interceptors.response.use(
	(response) => {
		return response
	},
	async function (error) {
		// if (isAxiosError(error) && error.config && error.response?.status === 401) {
		// 	try {
		// 		const originalRequest = error.config as any
		// 		if (!originalRequest?._retry) {
		// 			originalRequest._retry = true
		// 			const { updateToken } = await import('@arv-bedrock/auth')
		// 			const result = await updateToken()
		// 			const newToken = `${AuthType.Arv}-${result?.access_token}`
		// 			updateAccessToken(newToken)
		// 			return axiosInstance({
		// 				...originalRequest,
		// 				headers: {
		// 					...originalRequest.headers,
		// 					authorization: `Bearer ${newToken}`,
		// 				},
		// 			}).catch((err) => {
		// 				const muniId = sessionStorage.getItem('app-muni-id')
		// 				const href =
		// 					typeof location !== 'undefined'
		// 						? `${location.protocol}//${location.host}${basePath}/${muniId}`
		// 						: ''
		// 				return new Promise((resolve) => {
		// 					Modal.confirm({
		// 						closable: false,
		// 						okCancel: false,
		// 						okText: 'ตกลง',
		// 						title: 'ระยะเวลาการใช้งานหมดอายุ',
		// 						content: 'โปรดเข้าสู่ระบบอีกครั้ง',
		// 						onOk: () =>
		// 							import('@arv-bedrock/auth')
		// 								.then(({ doLogout }) => doLogout(href))
		// 								.then(() => resolve(err)),
		// 					})
		// 				})
		// 			})
		// 		}
		// 	} catch (err) {
		// 		return Promise.reject(err)
		// 	}
		// }
		return Promise.reject(error)
	},
)

export function updateAccessToken(token?: string | void) {
	if (token) {
		instance.defaults.headers.common.authorization = 'Bearer ' + token
		apiAccessToken = token
	} else {
		instance.defaults.headers.common.authorization = ''
	}
}

function isAxiosError<TInput = unknown, TOutput = any>(obj: unknown): obj is AxiosError<TInput, TOutput> {
	return obj instanceof AxiosError
}
