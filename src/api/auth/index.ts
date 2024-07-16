import { ResponseDto } from '..'
import { api } from '../core'
import { ForgotPasswordDtoIn, LoginDtoIn, RefreshTokenDtoIn, ResetPasswordDtoIn } from './dto-in.dto'
import { ForgotPasswordDtoOut, LoginDtoOut, RefreshTokenDtoOut, ResetPasswordDtoOut } from './dto-out.dto'

const auth = {
	login: async (payload: LoginDtoIn): Promise<ResponseDto<LoginDtoOut>> =>
		(await api.post('/auth/login', payload))?.data,
	refreshToken: async (payload: RefreshTokenDtoIn): Promise<ResponseDto<RefreshTokenDtoOut>> =>
		(await api.post('/auth/refresh-tokens', payload))?.data,
	forgotPassword: async (payload: ForgotPasswordDtoIn): Promise<ResponseDto<ForgotPasswordDtoOut>> =>
		(await api.post('/auth/forgot-password', payload))?.data,
	resetPassword: async (payload: ResetPasswordDtoIn): Promise<ResponseDto<ResetPasswordDtoOut>> =>
		(await api.put('/auth/reset-password', payload))?.data,
}

export default auth
