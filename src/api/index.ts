import auth from '@/api/auth'
import um from '@/api/um'
import lookup from '@/api/lookup'
import fieldLoss from '@/api/field-loss'
import { SortType } from '@/enum'

export type ResponseDto<T = any> = {
	data?: T
	message?: string
	tokens?: Tokens
	errorStatus?: number
	error?: any
	total?: number
}

export interface ResponseLanguage {
	th: string
	en: string
}
export interface ResponseArea {
	areaRai: number
	areaPlot: number
}
export interface Tokens {
	idToken: string
	accessToken: string
	refreshToken: string
	expiresIn: number
}

export interface TablePagination {
	sortField : string,
	sortOrder : SortType, 
	limit : number,
	offset : number
}

const service = {
	auth,
	um,
	lookup,
	fieldLoss,
}

export default service
