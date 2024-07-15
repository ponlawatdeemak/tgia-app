import { ResponseDto } from '..'
import { api } from '../core'
import { ForgetPasswordDtoIn, LoginDtoIn, ResetPasswordDtoIn } from './dto-in.dto'
import { ForgetPasswordDtoOut, LoginDtoOut, ResetPasswordDtoOut } from './dto-out.dto'

const auth = {
	login: async (payload: LoginDtoIn): Promise<ResponseDto<LoginDtoOut>> =>
		(await api.post('/auth/login', payload))?.data,
	forgetPassword: async (payload: ForgetPasswordDtoIn): Promise<ResponseDto<ForgetPasswordDtoOut>> =>
		(await api.post('/auth/forget-password', payload))?.data,
	resetPassword: async (payload: ResetPasswordDtoIn): Promise<ResponseDto<ResetPasswordDtoOut>> =>
		(await api.post('/auth/reset-password', payload))?.data,
}

export default auth
