import auth from '@/api/auth'
import um from '@/api/um'
import lookup from '@/api/lookup'
import fieldLoss from '@/api/field-loss'

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

const service = {
	auth,
	um,
	lookup,
	fieldLoss,
}

export default service
