import { api } from '../core'
import { APIService, ResponseAnnualAnalysisBarDto, ResponseAnnualAnalysisLineDto, ResponseDto } from '../interface'
import {
	GetBarLossDtoIn,
	GetBarPlantDtoIn,
	GetBarRiceDtoIn,
	GetLineLossDtoIn,
	GetLinePlantDtoIn,
	GetLineRiceDtoIn,
	GetTableLossDtoIn,
	GetTablePlantDtoIn,
	GetTableRiceDtoIn,
} from './dto-in.dto'
import {
	DataLossStatisticDtoOut,
	DataPlantStatisticDtoOut,
	LegendLossStatisticDtoOut,
	LegendPlantStatisticDtoOut,
	ValuesPlantStatisticDtoOut,
} from './dto-out.dto'

const annualAnalysis = {
	getTablePlantStatistic: async (payload: GetTablePlantDtoIn): Promise<ResponseDto<DataPlantStatisticDtoOut[]>> => {
		//add dtoout data
		const params = new URLSearchParams()
		for (const key in payload) {
			if (Object.prototype.hasOwnProperty.call(payload, key)) {
				const value = payload[key as keyof GetTablePlantDtoIn]
				if (value) {
					params.append(key, value.toString())
				}
			}
		}
		return await api.get(`/summary/plant-statistic/table?${params}`, APIService.DisasterAPI)
	},
	getLinePlantStatistic: async (
		payload: GetLinePlantDtoIn,
	): Promise<
		ResponseAnnualAnalysisLineDto<
			DataPlantStatisticDtoOut[],
			LegendPlantStatisticDtoOut,
			ValuesPlantStatisticDtoOut[]
		>
	> => {
		const params = new URLSearchParams()
		for (const key in payload) {
			if (Object.prototype.hasOwnProperty.call(payload, key)) {
				const value = payload[key as keyof GetLinePlantDtoIn]
				if (value) {
					params.append(key, value.toString())
				}
			}
		}
		console.log('params :: ', params.toString())

		return await api.get(`/summary/plant-statistic/line?${params}`, APIService.DisasterAPI)
	},
	getBarPlantStatistic: async (
		payload: GetBarPlantDtoIn,
	): Promise<ResponseAnnualAnalysisBarDto<DataPlantStatisticDtoOut[], LegendPlantStatisticDtoOut>> => {
		// add dtoout T2 = legends
		const params = new URLSearchParams()
		for (const key in payload) {
			if (Object.prototype.hasOwnProperty.call(payload, key)) {
				const value = payload[key as keyof GetBarPlantDtoIn]
				if (value) {
					params.append(key, value.toString())
				}
			}
		}

		return await api.get(`/summary/plant-statistic/bar?${params}`, APIService.DisasterAPI)
	},
	getTableRiceStatistic: async (payload: GetTableRiceDtoIn): Promise<ResponseDto> => {
		//add dtoout data
		const params = new URLSearchParams()
		for (const key in payload) {
			if (Object.prototype.hasOwnProperty.call(payload, key)) {
				const value = payload[key as keyof GetTableRiceDtoIn]
				if (value) {
					params.append(key, value.toString())
				}
			}
		}
		return await api.get(`/summary/rice-statistic/table?${params}`, APIService.DisasterAPI)
	},
	getLineRiceStatistic: async (payload: GetLineRiceDtoIn): Promise<ResponseAnnualAnalysisLineDto> => {
		const params = new URLSearchParams()
		for (const key in payload) {
			if (Object.prototype.hasOwnProperty.call(payload, key)) {
				const value = payload[key as keyof GetLineRiceDtoIn]
				if (value) {
					params.append(key, value.toString())
				}
			}
		}
		console.log('params :: ', params.toString())
		return await api.get(`/summary/rice-statistic/line?${params}`, APIService.DisasterAPI)
	},
	getBarRiceStatistic: async (payload: GetBarRiceDtoIn): Promise<ResponseAnnualAnalysisBarDto> => {
		const params = new URLSearchParams()
		for (const key in payload) {
			if (Object.prototype.hasOwnProperty.call(payload, key)) {
				const value = payload[key as keyof GetBarRiceDtoIn]
				if (value) {
					params.append(key, value.toString())
				}
			}
		}
		console.log('params :: ', params.toString())
		return await api.get(`/summary/rice-statistic/bar?${params}`, APIService.DisasterAPI)
	},
	getTableLossStatistic: async (payload: GetTableLossDtoIn): Promise<ResponseDto> => {
		const params = new URLSearchParams()
		for (const key in payload) {
			if (Object.prototype.hasOwnProperty.call(payload, key)) {
				const value = payload[key as keyof GetTableLossDtoIn]
				if (value) {
					params.append(key, value.toString())
				}
			}
		}
		return await api.get(`/summary/loss-statistic/table?${params}`, APIService.DisasterAPI)
	},
	getLineLossStatistic: async (payload: GetLineLossDtoIn): Promise<ResponseAnnualAnalysisLineDto> => {
		const params = new URLSearchParams()
		for (const key in payload) {
			if (Object.prototype.hasOwnProperty.call(payload, key)) {
				const value = payload[key as keyof GetLineLossDtoIn]
				if (value) {
					params.append(key, value.toString())
				}
			}
		}
		return await api.get(`/summary/loss-statistic/line?${params}`, APIService.DisasterAPI)
	},
	getBarLossStatistic: async (
		payload: GetBarLossDtoIn,
	): Promise<ResponseAnnualAnalysisBarDto<DataLossStatisticDtoOut[], LegendLossStatisticDtoOut>> => {
		const params = new URLSearchParams()
		for (const key in payload) {
			if (Object.prototype.hasOwnProperty.call(payload, key)) {
				const value = payload[key as keyof GetBarLossDtoIn]
				if (value) {
					params.append(key, value.toString())
				}
			}
		}
		return await api.get(`/summary/loss-statistic/bar?${params}`, APIService.DisasterAPI)
	},
}

export default annualAnalysis
