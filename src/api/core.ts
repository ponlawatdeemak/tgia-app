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
	// console.log('TLOG ~ apiAccessToken:', apiAccessToken)
	const res = await fetch((process.env.API_URL ?? '') + input, {
		...init,
		headers: {
			...init?.headers,
			Authorization: `Bearer ${apiAccessToken}`,
			// Authorization: `Bearer eyJraWQiOiI1Vzl6NmhXZmVNQjRhTXlUcGVNV01relk5UEJrakR1YjZsN1lLUTlVdmpnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJhOWNhNTVlYy0yMDIxLTcwZGItZDc4OS0yMzQxOGMzNjdmMDUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTFfSUdMb3Fub2tNIiwiY2xpZW50X2lkIjoiNHA0MzBwMmRhbGEzYWxqbWloa2s3OWg4MmciLCJvcmlnaW5fanRpIjoiNjNjYzcyZjEtYmIyMC00OTExLTg3YjMtOGU5NTQyYmY2MjVmIiwiZXZlbnRfaWQiOiI2OGVlODk1ZC0zZWQxLTRkNWEtOGZmYS1mNzY2OTMyNGJiYzkiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzIwNzkzOTU4LCJleHAiOjE3MjA4ODAzNTgsImlhdCI6MTcyMDc5Mzk1OCwianRpIjoiMDAxYTZjM2ItMWYzMS00NTQ1LThlZWMtYTkwMTUzZTZlZWQ1IiwidXNlcm5hbWUiOiJhOWNhNTVlYy0yMDIxLTcwZGItZDc4OS0yMzQxOGMzNjdmMDUifQ.GlheOYJ-MuaCAf-7U76gZ2qdjlgnfLhjeoI8OEYJ2PLGdxzrJ3CbHH1rhncKr9YxCEvSyMFDEwkgIvnt8Wf_pzHTm48qpAdoq6A3TIRQLbIYQo_aTyhs3j_hZ3wTwg3YGDa8f-8tdm4vfvQubID9YxkaZHw7hiI75vkJCNe-1dcePJ1WmSwisyxjsakYLREF1lWvluTc5NcRmLRC8kkFIwZpsuRHCsyNhOncb6-2mT2golLTijJfLWLldbuHVzcfybkplJDJz94M9Dytyjke2KwLBl2OYboGBouukipV-ep29jRcZH1_QKcvau1-0zyz-6_l9T87irM88kALkbtabg`,
			'x-api-key': process.env.API_KEY || '',
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

export const refreshAccessToken = async () => {
	console.log('token expired!!!')
	// ใช้ refresh token แลก access token ใหม่
	// const temp =
	// 	'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.Fm7roAELbhqyigfN0MvHHyugpwNrkKPJ5DZB0V6lgive-SCY8cEhO-k_ENwRn9jfcEIGMEqK-_Q-D5UnvP2Cph3Um4t1OQQWTc1-0JNadYDL03jcSealNXa73RWDA5CStQpBGlUdMzMf6TZ5plcUHifJF_g1hXZzLIuhe2ubG60ORKiSE4kcWbNzGSgur4dY3FMVkKab7wLk8VG1giimpvhBsO9baJXC-VG9ozuBd57Z-lZX4Tr7hUuOIMiTMrs53-3XP0y949fS-k-SfenINWQBJGNSQl0u-dqtNz0eylJ86AbYiSOKNWIDvaJmQnJEJM3gROyt0f8QQRf88GQ-kQ.xHqJHZEAH5fwnHKb.IOVWPRQ0XEtppk74Vrk8yH7bW92vzH2II-NRXwfyJOUF5FgwEsusu-9yJdKb1yiFlhWOoXd4nC2eD2Cqi0jLwAVTOUoZ8FPsJ4CaHfQJIIz_q_A2LthKMppQm2ZQ_bZdXrPF2xxCug4JwOroFgT0QJJL6gAsCcmAkmUa_YB01oRPntWHHFsK7VuytNtWeRj24qleE63oAQd-nTU77vpuhkgNl224Ot3gn3KiMxfUc7OxSjEQvUuwzdkfH-wju4_PGTCn15oUtcKipiESMNXgW8U3_8osHx7Zo4lSPb4Yur5PCCWa17lXYjyq_zWlohq524aXbsg1iBeCWFUr9qDOjGO8cFKbFLj-uR2fkBgUC38hI8id5tIlS7a8HxNru9vsPOTzPkNw6QabW-Mnn3Jdy_T-h7DGHX0fRalWA7VH2o_R4dLLPNTdaDJsqaOrGJxJglYvL04UQebMWxAZ5zo0TezCzfxVxjBYRk3QfUECWrlU1G4Ji0gDM6SSLFssNONWu_dVKUdSnvuqmMOuKUuTaxj69YmCsn8_BuzKwkNbSbJApKXkPCpeFWAr_rVwb0bctBorTTZdFRf5G8RXU-cQSsSglWtTlm_Nlm5h13yv7Soc_A_jIZJH6FxYCKFRyxWNLo8K8J4e1D1BtYo-D2ARCCuuJkOXkXTZipJe7ox9MnFidcfWOsb1AfxXf4zJspj2S0FYsgSMBMO3jxrgeiiI4nVK540YuS88OStP50kvII7s_iCXShnkFLfgiJWMC9KvwYxJS7qnTu-zmPBfWcbKYiLdp1XEiFDYoPKarkEzvb8xvgYQuzbsR9cwnq69a6Sg60izw0XIxzjv28g79OJrSnt5WhfoInSEqhYN8eHwqtW_t0GdNdKLF8A19ThZaIqyFKy9-WZvQbzO3Ssydf9VK61Jqs5-bkNgYqtriE3ia-Ka3A4_wr_gRGN-rzt1iEWMX10ybJZu48ASxJMD11Rlr4D7lvmtWEW9v-DaSVw8zCvIHcBV_cR78BaiHfzV_ZUzRhi7HIcJFXO-AN_DN1HRDOXBYe87rnfajPydWHKQnKS8xXpGMk2GAwDsHkMsl2WuQBT67aKIAy232YVAV3e0DVjfe5bPTKt-Wplj35FnkYGJHDpWpCKMbrQ27xcF9axxC8MF1IWienDKO9Pxuk6nz-LnF_f1LZttW9wems0fMYtc4u4OVIqh-UZwD2qwKcA0fkB5s9L37HZbKWUD3N0LljP4Vpf4awS-ncHC7zfuQEvXwl-vxJAVxqx0XGES7yNQh2TCILz0Rq9OV2E5GPk_qRF3f8afOxysIakCSTkWCAJ3hAandU2JO93z7g5bYSYJiekaXkQMOm55.78kbPzyYUshalft7zRl2KQ'
	const res = await service.auth.refreshToken({ userId: apiUserId || '', refreshToken: apiRefreshToken || '' })
	console.log('TLOG ~ res:', res)
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
