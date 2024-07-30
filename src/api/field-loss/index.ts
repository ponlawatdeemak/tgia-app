import { apiDisaster } from '@/api/core-disaster'
import { GetSearchAdminPolyDtoIn } from './dto-in.dto'
import { GetSearchAdminPolyDtoOut } from './dto-out.dto'
import { ResponseDto } from '@/api'

import axios from 'axios'

const fieldLoss = {
	getSearchAdminPoly: async (payload: GetSearchAdminPolyDtoIn): Promise<ResponseDto<GetSearchAdminPolyDtoOut>> => {
		const xxx = `admin-poly/search?keyword=${payload.keyword}`
		return await apiDisaster.get(`/disasterapis/`)
	},
}

export default fieldLoss
