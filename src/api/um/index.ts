import { ResponseDto } from '..'
import { api } from '../core'
import { GetUmDtoIn } from './dto-in.dto'
import { GetUmDtoOut } from './dto-out.dto'

const um = {
	getUser: async (payload: GetUmDtoIn): Promise<ResponseDto<GetUmDtoOut>> => await api.fetch(`/um/${payload.userId}`),
}

export default um
