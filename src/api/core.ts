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
	const res = await fetch((process.env.API_URL ?? '') + input, {
		...init,
		headers: {
			...init?.headers,
			'x-api-key': process.env.API_KEY || '',
			Authorization: `Bearer ${apiAccessToken}`,
			// Authorization: `Bearer eyJraWQiOiI1Vzl6NmhXZmVNQjRhTXlUcGVNV01relk5UEJrakR1YjZsN1lLUTlVdmpnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJhOWNhNTVlYy0yMDIxLTcwZGItZDc4OS0yMzQxOGMzNjdmMDUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTFfSUdMb3Fub2tNIiwiY2xpZW50X2lkIjoiNHA0MzBwMmRhbGEzYWxqbWloa2s3OWg4MmciLCJvcmlnaW5fanRpIjoiNjNjYzcyZjEtYmIyMC00OTExLTg3YjMtOGU5NTQyYmY2MjVmIiwiZXZlbnRfaWQiOiI2OGVlODk1ZC0zZWQxLTRkNWEtOGZmYS1mNzY2OTMyNGJiYzkiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzIwNzkzOTU4LCJleHAiOjE3MjA4ODAzNTgsImlhdCI6MTcyMDc5Mzk1OCwianRpIjoiMDAxYTZjM2ItMWYzMS00NTQ1LThlZWMtYTkwMTUzZTZlZWQ1IiwidXNlcm5hbWUiOiJhOWNhNTVlYy0yMDIxLTcwZGItZDc4OS0yMzQxOGMzNjdmMDUifQ.GlheOYJ-MuaCAf-7U76gZ2qdjlgnfLhjeoI8OEYJ2PLGdxzrJ3CbHH1rhncKr9YxCEvSyMFDEwkgIvnt8Wf_pzHTm48qpAdoq6A3TIRQLbIYQo_aTyhs3j_hZ3wTwg3YGDa8f-8tdm4vfvQubID9YxkaZHw7hiI75vkJCNe-1dcePJ1WmSwisyxjsakYLREF1lWvluTc5NcRmLRC8kkFIwZpsuRHCsyNhOncb6-2mT2golLTijJfLWLldbuHVzcfybkplJDJz94M9Dytyjke2KwLBl2OYboGBouukipV-ep29jRcZH1_QKcvau1-0zyz-6_l9T87irM88kALkbtabg`,
		},
		cache: 'force-cache',
	})

	// console.log('TLOG ~ res:', res)
	if (!res.ok) {
		if (res.status === 403) {
			try {
				refreshAccessToken()
			} catch (error) {
				forceLogout()
			}
		}
		return { errorStatus: res.status, error: await res.json() }
	}

	return await res.json()
}

const instanceDisaster = axios.create({
	baseURL: process.env.API_URL_DISASTER,
	headers: {
		'x-api-key': process.env.API_KEY_DISASTER || '',
	},
})
export const apiDisaster: AppAPI = instanceDisaster as AppAPI
apiDisaster['fetch'] = async (input: URL | RequestInfo, init?: RequestInit | undefined): Promise<ResponseDto<any>> => {
	const res = await fetch((process.env.API_URL_DISASTER ?? '') + input, {
		...init,
		headers: {
			...init?.headers,
			'x-api-key': process.env.API_KEY_DISASTER || '',
			Authorization: `Bearer ${apiAccessToken}`,
			// Authorization: `Bearer eyJraWQiOiI1Vzl6NmhXZmVNQjRhTXlUcGVNV01relk5UEJrakR1YjZsN1lLUTlVdmpnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJhOWNhNTVlYy0yMDIxLTcwZGItZDc4OS0yMzQxOGMzNjdmMDUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTFfSUdMb3Fub2tNIiwiY2xpZW50X2lkIjoiNHA0MzBwMmRhbGEzYWxqbWloa2s3OWg4MmciLCJvcmlnaW5fanRpIjoiNjNjYzcyZjEtYmIyMC00OTExLTg3YjMtOGU5NTQyYmY2MjVmIiwiZXZlbnRfaWQiOiI2OGVlODk1ZC0zZWQxLTRkNWEtOGZmYS1mNzY2OTMyNGJiYzkiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzIwNzkzOTU4LCJleHAiOjE3MjA4ODAzNTgsImlhdCI6MTcyMDc5Mzk1OCwianRpIjoiMDAxYTZjM2ItMWYzMS00NTQ1LThlZWMtYTkwMTUzZTZlZWQ1IiwidXNlcm5hbWUiOiJhOWNhNTVlYy0yMDIxLTcwZGItZDc4OS0yMzQxOGMzNjdmMDUifQ.GlheOYJ-MuaCAf-7U76gZ2qdjlgnfLhjeoI8OEYJ2PLGdxzrJ3CbHH1rhncKr9YxCEvSyMFDEwkgIvnt8Wf_pzHTm48qpAdoq6A3TIRQLbIYQo_aTyhs3j_hZ3wTwg3YGDa8f-8tdm4vfvQubID9YxkaZHw7hiI75vkJCNe-1dcePJ1WmSwisyxjsakYLREF1lWvluTc5NcRmLRC8kkFIwZpsuRHCsyNhOncb6-2mT2golLTijJfLWLldbuHVzcfybkplJDJz94M9Dytyjke2KwLBl2OYboGBouukipV-ep29jRcZH1_QKcvau1-0zyz-6_l9T87irM88kALkbtabg`,
		},
		cache: 'force-cache',
	})

	if (!res.ok) {
		if (res.status === 403) {
			try {
				refreshAccessToken()
			} catch (error) {
				forceLogout()
			}
		}
		return { errorStatus: res.status, error: await res.json() }
	}

	return await res.json()
}

const instanceTile = axios.create({
	baseURL: process.env.API_URL_TILE,
	headers: {
		'x-api-key': process.env.API_KEY_TILE || '',
	},
})

export const apiTile: AppAPI = instanceTile as AppAPI
apiDisaster['fetch'] = async (input: URL | RequestInfo, init?: RequestInit | undefined): Promise<ResponseDto<any>> => {
	const res = await fetch((process.env.API_URL_TILE ?? '') + input, {
		...init,
		headers: {
			...init?.headers,
			'x-api-key': process.env.API_KEY_TILE || '',
			Authorization: `Bearer ${apiAccessToken}`,
			// Authorization: `Bearer eyJraWQiOiI1Vzl6NmhXZmVNQjRhTXlUcGVNV01relk5UEJrakR1YjZsN1lLUTlVdmpnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJhOWNhNTVlYy0yMDIxLTcwZGItZDc4OS0yMzQxOGMzNjdmMDUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTFfSUdMb3Fub2tNIiwiY2xpZW50X2lkIjoiNHA0MzBwMmRhbGEzYWxqbWloa2s3OWg4MmciLCJvcmlnaW5fanRpIjoiNjNjYzcyZjEtYmIyMC00OTExLTg3YjMtOGU5NTQyYmY2MjVmIiwiZXZlbnRfaWQiOiI2OGVlODk1ZC0zZWQxLTRkNWEtOGZmYS1mNzY2OTMyNGJiYzkiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzIwNzkzOTU4LCJleHAiOjE3MjA4ODAzNTgsImlhdCI6MTcyMDc5Mzk1OCwianRpIjoiMDAxYTZjM2ItMWYzMS00NTQ1LThlZWMtYTkwMTUzZTZlZWQ1IiwidXNlcm5hbWUiOiJhOWNhNTVlYy0yMDIxLTcwZGItZDc4OS0yMzQxOGMzNjdmMDUifQ.GlheOYJ-MuaCAf-7U76gZ2qdjlgnfLhjeoI8OEYJ2PLGdxzrJ3CbHH1rhncKr9YxCEvSyMFDEwkgIvnt8Wf_pzHTm48qpAdoq6A3TIRQLbIYQo_aTyhs3j_hZ3wTwg3YGDa8f-8tdm4vfvQubID9YxkaZHw7hiI75vkJCNe-1dcePJ1WmSwisyxjsakYLREF1lWvluTc5NcRmLRC8kkFIwZpsuRHCsyNhOncb6-2mT2golLTijJfLWLldbuHVzcfybkplJDJz94M9Dytyjke2KwLBl2OYboGBouukipV-ep29jRcZH1_QKcvau1-0zyz-6_l9T87irM88kALkbtabg`,
		},
		cache: 'force-cache',
	})

	if (!res.ok) {
		if (res.status === 403) {
			try {
				refreshAccessToken()
			} catch (error) {
				forceLogout()
			}
		}
		return { errorStatus: res.status, error: await res.json() }
	}

	return await res.json()
}

export const refreshAccessToken = async () => {
	// console.log('token expired!!!')
	// ใช้ refresh token แลก access token ใหม่
	const res = await service.auth.refreshToken({ userId: apiUserId || '', refreshToken: apiRefreshToken || '' })
	// const res = await service.auth.refreshToken({ userId: apiUserId || '', refreshToken: temp })
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
