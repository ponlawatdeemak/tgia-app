import {
	GetAreaSearchPlotDtoIn,
	GetPlotActivityLossDetailDtoIn,
	GetPlotActivityPlantDetailDtoIn,
	GetSearchPlotDtoIn,
} from './dto-in.dto'
import {
	GetAreaSearchPlotDtoOut,
	GetPlotActivityLossDetailDtoOut,
	GetPlotActivityPlantDetailDtoOut,
	GetSearchPlotDtoOut,
} from './dto-out.dto'
import { APIService, ResponseDto } from '@/api/interface'
import { api } from '../core'

const plotMonitoring = {
	getSearchPlot: async (payload: GetSearchPlotDtoIn): Promise<ResponseDto<GetSearchPlotDtoOut[]>> => {
		const params = new URLSearchParams()

		if (payload.activityId !== undefined) params.append('activityId', payload.activityId.toString())
		if (payload.year !== undefined) params.append('year', payload.year.toString())
		if (payload.provinceCode !== undefined) params.append('provinceCode', payload.provinceCode.toString())
		if (payload.districtCode !== undefined) params.append('districtCode', payload.districtCode.toString())
		if (payload.subDistrictCode !== undefined) params.append('subDistrictCode', payload.subDistrictCode.toString())
		if (payload.lossType !== undefined) params.append('lossType', payload.lossType.toString())
		if (payload.insuredType !== undefined) params.append('insuredType', payload.insuredType.toString())
		if (payload.publicStatus !== undefined) params.append('publicStatus', payload.publicStatus.toString())
		if (payload.riskType !== undefined) payload.riskType.forEach((item) => params.append('riskType', item))
		if (payload.riceType !== undefined) params.append('riceType', payload.riceType.toString())
		if (payload.detailType !== undefined) params.append('detailType', payload.detailType.toString())
		if (payload.orderBy) params.append('orderBy', payload.orderBy)
		if (payload.offset !== undefined) params.append('offset', payload.offset.toString())
		if (payload.limit !== undefined) params.append('limit', payload.limit.toString())

		return await api.get(`/plot/search?${params}`, APIService.DisasterAPI)
	},
	getAreaSearchPlot: async (payload: GetAreaSearchPlotDtoIn): Promise<ResponseDto<GetAreaSearchPlotDtoOut[]>> => {
		const params = new URLSearchParams()

		if (payload.activityId !== undefined) params.append('activityId', payload.activityId.toString())
		if (payload.year !== undefined) params.append('year', payload.year.toString())
		if (payload.provinceCode !== undefined) params.append('provinceCode', payload.provinceCode.toString())
		if (payload.districtCode !== undefined) params.append('districtCode', payload.districtCode.toString())
		if (payload.subDistrictCode !== undefined) params.append('subDistrictCode', payload.subDistrictCode.toString())
		if (payload.lossType !== undefined) params.append('lossType', payload.lossType.toString())
		if (payload.insuredType !== undefined) params.append('insuredType', payload.insuredType.toString())
		if (payload.publicStatus !== undefined) params.append('publicStatus', payload.publicStatus.toString())
		if (payload.riskType !== undefined) payload.riskType.forEach((item) => params.append('riskType', item))
		if (payload.riceType !== undefined) params.append('riceType', payload.riceType.toString())
		if (payload.detailType !== undefined) params.append('detailType', payload.detailType.toString())
		if (payload.orderBy) params.append('orderBy', payload.orderBy)
		if (payload.offset !== undefined) params.append('offset', payload.offset.toString())
		if (payload.limit !== undefined) params.append('limit', payload.limit.toString())

		return await api.get(`/plot/search/area?${params}`, APIService.DisasterAPI)
	},
	getPlotActivityPlantDetail: async (
		payload: GetPlotActivityPlantDetailDtoIn,
	): Promise<ResponseDto<GetPlotActivityPlantDetailDtoOut>> => {
		return await api.get(`/plot/${payload.activityId}/plant-detail`, APIService.DisasterAPI)
	},
	getPlotActivityLossDetail: async (
		payload: GetPlotActivityLossDetailDtoIn,
	): Promise<ResponseDto<GetPlotActivityLossDetailDtoOut>> => {
		return await api.get(`/plot/${payload.activityId}/loss-detail`, APIService.DisasterAPI)
	},
}

export default plotMonitoring
