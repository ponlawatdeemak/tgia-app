import auth from './auth'
import um from './um'
import lookup from './lookup'

export type ResponseDto<T = any> = {
	data: T
	message: string
	tokens?: Tokens
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
}

export default service
