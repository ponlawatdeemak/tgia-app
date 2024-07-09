import { ResponseDto } from '..'
import { api } from '../core'
import { LoginDtoIn } from './dto-in.dto'
import { LoginDtoOut } from './dto-out.dto'

const auth = {
	login: async (payload: LoginDtoIn): Promise<ResponseDto<LoginDtoOut>> =>
		(await api.post('/auth/login', payload))?.data,
}

export default auth
