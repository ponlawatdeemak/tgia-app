import { api } from '@/api/core'
import { GetUmDtoOut } from '@/api/dto/um/dto-out.dto'
import { GetUmDtoIn } from '@/api/dto/um/dto-in.dto'
import { ResponseDto } from '@/api'

const um = {
	getUser: async (payload: GetUmDtoIn): Promise<ResponseDto<GetUmDtoOut>> => await api.fetch(`/um/${payload.userId}`),
}

export default um
