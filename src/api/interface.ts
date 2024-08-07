import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { SortType } from '@/enum'

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

export interface RetryQueueItem {
	resolve: (value?: any) => void
	reject: (error?: any) => void
	config: AxiosRequestConfig
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
	errorStatus?: number
	error?: ErrorResponse
	total?: number
}

export type ResponseStatisticDto<T = any, T2 = any> = ResponseDto<T> & {
	dataTotal?: T2
}

export interface Tokens {
	idToken: string
	accessToken: string
	refreshToken: string
	expiresIn: number
}

export interface ResponseLanguage {
	th: string
	en: string
}

export interface ResponseArea {
	areaRai: number
	areaPlot: number
}

export interface TablePagination {
	sortField: string
	sortOrder: SortType
	limit: number
	offset: number
}
