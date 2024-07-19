import { GetProfileDtoOut } from '@/api/dto/um/dto-out.dto'
import { GetLookupOutDto } from '@/api/dto/lookup/dto-out.dto'
import { ResponseDto } from '@/api'
import { api } from '@/api/core'

const lookup = {
	get: async (lookupName: string): Promise<ResponseDto<GetLookupOutDto[]>> =>
		await api.fetch(`/lookup/${lookupName}`),
}

export default lookup
