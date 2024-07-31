import { GetSearchAdminPolyDtoIn } from './dto-in.dto'
import { GetSearchAdminPolyDtoOut } from './dto-out.dto'
import { ResponseDto } from '@/api'
import { apiDisaster } from '../core'

const fieldLoss = {
	getSearchAdminPoly: async (payload: GetSearchAdminPolyDtoIn): Promise<ResponseDto<GetSearchAdminPolyDtoOut>> =>
		await apiDisaster.fetch(`/admin-poly/search?keyword=${payload.keyword}`),
}

export default fieldLoss
