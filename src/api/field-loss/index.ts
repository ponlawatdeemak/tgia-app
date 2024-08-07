import {
	GetAreaStatisticDtoIn,
	GetSearchAdminPolyDtoIn,
	GetSummaryAreaDtoIn,
	GetSummaryPredictedLossDtoIn,
	GetTimeStatisticDtoIn,
} from './dto-in.dto'
import {
	GetAreaStatisticDtoOut,
	GetSearchAdminPolyDtoOut,
	GetSummaryAreaDtoOut,
	GetSummaryPredictedLossDtoOut,
	GetTimeStatisticDtoOut,
} from './dto-out.dto'
import { APIService, ResponseDto } from '@/api/interface'
import { api } from '../core'

const fieldLoss = {
	getSearchAdminPoly: async (payload: GetSearchAdminPolyDtoIn): Promise<ResponseDto<GetSearchAdminPolyDtoOut[]>> =>
		await api.get(`/admin-poly/search?keyword=${payload.keyword}`, APIService.DisasterAPI),
	getSummaryPredictedLoss: async (
		payload: GetSummaryPredictedLossDtoIn,
	): Promise<ResponseDto<GetSummaryPredictedLossDtoOut>> => {
		const params = new URLSearchParams()

		if (payload.lossType !== undefined) params.append('lossType', payload.lossType.toString())
		if (payload.startDate) params.append('startDate', payload.startDate)
		if (payload.endDate) params.append('endDate', payload.endDate)
		if (payload.registrationAreaType !== undefined)
			params.append('registrationAreaType', payload.registrationAreaType.toString())
		if (payload.provinceId !== undefined) params.append('provinceId', payload.provinceId.toString())
		if (payload.districtId !== undefined) params.append('districtId', payload.districtId.toString())

		return await api.get(`/predicted-loss/summary?${params}`, APIService.DisasterAPI)
	},
	getSummaryArea: async (payload: GetSummaryAreaDtoIn): Promise<ResponseDto<GetSummaryAreaDtoOut[]>> => {
		const params = new URLSearchParams()

		if (payload.startDate) params.append('startDate', payload.startDate)
		if (payload.endDate) params.append('endDate', payload.endDate)
		if (payload.registrationAreaType !== undefined)
			params.append('registrationAreaType', payload.registrationAreaType.toString())
		if (payload.provinceId !== undefined) params.append('provinceId', payload.provinceId.toString())
		if (payload.districtId !== undefined) params.append('districtId', payload.districtId.toString())

		return await api.get(`/predicted-loss/summary-area?${params}`, APIService.DisasterAPI)
	},
	getAreaStatistic: async (payload: GetAreaStatisticDtoIn): Promise<ResponseDto<GetAreaStatisticDtoOut>> => {
		const params = new URLSearchParams()

		if (payload.startDate) params.append('startDate', payload.startDate)
		if (payload.endDate) params.append('endDate', payload.endDate)
		if (payload.lossType !== undefined) params.append('lossType', payload.lossType.toString())
		if (payload.registrationAreaType !== undefined)
			params.append('registrationAreaType', payload.registrationAreaType.toString())
		if (payload.sort) params.append('sort', payload.sort)
		if (payload.sortType) params.append('sortType', payload.sortType)

		return await api.get(`/predicted-loss/area-statistic?${params}`, APIService.DisasterAPI)
	},
	getTimeStatistic: async (payload: GetTimeStatisticDtoIn): Promise<ResponseDto<GetTimeStatisticDtoOut>> => {
		const params = new URLSearchParams()

		if (payload.startDate) params.append('startDate', payload.startDate)
		if (payload.endDate) params.append('endDate', payload.endDate)
		if (payload.lossType !== undefined) params.append('lossType', payload.lossType.toString())
		if (payload.registrationAreaType !== undefined)
			params.append('registrationAreaType', payload.registrationAreaType.toString())

		return await api.get(`/predicted-loss/time-statistic?${params}`, APIService.DisasterAPI)
	},
}

export default fieldLoss
