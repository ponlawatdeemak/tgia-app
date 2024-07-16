import auth from './auth'
import um from './um'

export type ResponseDto<T = any> = {
	data?: T
	message?: string
	tokens?: Tokens
	errorStatus?: number
	error?: any
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
}

export default service
