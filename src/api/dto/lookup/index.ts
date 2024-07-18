import { GetProfileDtoOut } from '@/api/dto/um/dto-out.dto'
import { GetLookupOutDto } from '@/api/dto/lookup/dto-out.dto'
import { ResponseDto } from '@/api'
import { api } from '@/api/core'

const lookup = {
	get: async (lookupName: string): Promise<GetLookupOutDto[]> => await api.fetchLookup(`/lookup/${lookupName}`),
	getProfile: async (): Promise<ResponseDto<GetProfileDtoOut>> => await api.fetch('/profile'),
}

export default lookup

 
