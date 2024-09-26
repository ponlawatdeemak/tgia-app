import {
	DeletePOISDtoIn,
	GetAreaSearchPlotDtoIn,
	GetPlotActivityDetailDtoIn,
	GetPositionSearchPlotDtoIn,
	GetSearchPlotDtoIn,
	PostPOISDtoIn,
} from './dto-in.dto'
import {
	DeletePOISDtoOut,
	GetAreaSearchPlotDtoOut,
	GetPlotActivityLossDetailDtoOut,
	GetPlotActivityPlantDetailDtoOut,
	GetPOISDtoOut,
	GetPositionSearchPlotDtoOut,
	GetSearchPlotDtoOut,
	PostPOISDtoOut,
} from './dto-out.dto'
import { APIService, ResponseDto } from '@/api/interface'
import { api } from '../core'

const plotMonitoring = {
	getSearchPlot: async (payload: GetSearchPlotDtoIn): Promise<ResponseDto<GetSearchPlotDtoOut[]>> => {
		const params = new URLSearchParams()

		if (payload.activityId !== undefined) params.append('activityId', payload.activityId.toString())
		if (payload.year !== undefined) params.append('year', payload.year.toString())
		if (payload.registrationAreaType !== undefined)
			params.append('registrationAreaType', payload.registrationAreaType.toString())
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
		if (payload.registrationAreaType !== undefined)
			params.append('registrationAreaType', payload.registrationAreaType.toString())
		if (payload.provinceCode !== undefined) params.append('provinceCode', payload.provinceCode.toString())
		if (payload.districtCode !== undefined) params.append('districtCode', payload.districtCode.toString())
		if (payload.subDistrictCode !== undefined) params.append('subDistrictCode', payload.subDistrictCode.toString())
		if (payload.lossType !== undefined) params.append('lossType', payload.lossType.toString())
		if (payload.insuredType !== undefined) params.append('insuredType', payload.insuredType.toString())
		if (payload.publicStatus !== undefined) params.append('publicStatus', payload.publicStatus.toString())
		if (payload.riskType !== undefined) payload.riskType.forEach((item) => params.append('riskType', item))
		if (payload.riceType !== undefined) params.append('riceType', payload.riceType.toString())
		if (payload.detailType !== undefined) params.append('detailType', payload.detailType.toString())

		params.append('gzip', 'true')

		return await api.get(`/plot/search/area?${params}`, APIService.DisasterAPI)
	},
	getPositionSearchPlot: async (
		payload: GetPositionSearchPlotDtoIn,
	): Promise<ResponseDto<GetPositionSearchPlotDtoOut>> => {
		const params = new URLSearchParams()

		if (payload.lat !== undefined) params.append('lat', payload.lat.toString())
		if (payload.lon !== undefined) params.append('lon', payload.lon.toString())
		if (payload.year !== undefined) params.append('year', payload.year.toString())

		return await api.get(`/plot/search/position?${params}`, APIService.DisasterAPI)
	},
	getPlotActivityPlantDetail: async (
		payload: GetPlotActivityDetailDtoIn,
	): Promise<ResponseDto<GetPlotActivityPlantDetailDtoOut>> => {
		const params = new URLSearchParams()

		if (payload.count !== undefined) params.append('count', payload.count.toString())

		return await api.get(`/plot/${payload.activityId}/plant-detail?${params}`, APIService.DisasterAPI)
	},
	getPlotActivityLossDetail: async (
		payload: GetPlotActivityDetailDtoIn,
	): Promise<ResponseDto<GetPlotActivityLossDetailDtoOut>> => {
		const params = new URLSearchParams()

		if (payload.count !== undefined) params.append('count', payload.count.toString())

		return await api.get(`/plot/${payload.activityId}/loss-detail?${params}`, APIService.DisasterAPI)
	},
	getPOIS: async (): Promise<ResponseDto<GetPOISDtoOut[]>> => await api.get('/pois'),
	postPOIS: async (payload: PostPOISDtoIn): Promise<ResponseDto<PostPOISDtoOut>> => await api.post('/pois', payload),
	deletePOIS: async (payload: DeletePOISDtoIn): Promise<ResponseDto<DeletePOISDtoOut>> =>
		await api.delete(`/pois/${payload.poiId}`),
}

export default plotMonitoring
