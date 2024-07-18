import auth from '@/api/dto/auth'
import um from '@/api/dto/um'

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
