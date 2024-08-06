import { api } from '@/api/core'
import { APIService, ResponseDto } from '@/api/interface'
import { GetSearchAdminPolyDtoIn } from './dto-in.dto'
import { GetSearchAdminPolyDtoOut } from './dto-out.dto'

const fieldLoss = {
	getSearchAdminPoly: async (payload: GetSearchAdminPolyDtoIn): Promise<ResponseDto<GetSearchAdminPolyDtoOut>> =>
		await api.get(`/admin-poly/search?keyword=${payload.keyword}`, APIService.DisasterAPI),
}

export default fieldLoss
