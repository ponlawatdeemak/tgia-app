import { AxiosRequestConfig, AxiosResponse } from 'axios'

export enum APIService {
	WebAPI,
	DisasterAPI,
	TilesAPI,
}

export interface APIConfigType {
	baseURL: string
	apiKey: string
}

export interface AppAPI {
	get: (
		url: string,
		service?: APIService,
		config?: AxiosRequestConfig<any> | undefined,
	) => Promise<AxiosResponse<any, any>>
	post: (
		url: string,
		data: any,
		service?: APIService,
		config?: AxiosRequestConfig<any> | undefined,
	) => Promise<AxiosResponse<any, any>>
	put: (
		url: string,
		data: any,
		service?: APIService,
		config?: AxiosRequestConfig<any> | undefined,
	) => Promise<AxiosResponse<any, any>>
	delete: (
		url: string,
		service?: APIService,
		config?: AxiosRequestConfig<any> | undefined,
	) => Promise<AxiosResponse<any, any>>
}

export type ErrorResponse = {
	type?: string
	title: string
	status: number
	detail: string
}

export type ResponseDto<T = any> = {
	data?: T
	message?: string
	tokens?: Tokens
	error?: ErrorResponse
}

export interface Tokens {
	idToken: string
	accessToken: string
	refreshToken: string
	expiresIn: number
}
