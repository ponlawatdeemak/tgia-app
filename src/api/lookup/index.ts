import { ResponseDto } from '..'
import { api } from '../core'
import { GetProfileDtoOut } from '../um/dto-out.dto'
import { GetLookupOutDto } from './dto-out.dto'

const lookup = {
	get: async (lookupName: string): Promise<GetLookupOutDto[]> => await api.fetchLookup(`/lookup/${lookupName}`),
	getProfile: async (): Promise<ResponseDto<GetProfileDtoOut>> => await api.fetch('/profile'),
}

export default lookup
