import { api } from '../core'
import { APIService, ResponseAnnualAnalysisBarDto, ResponseAnnualAnalysisLineDto, ResponseDto } from '../interface'
import {
	DataLossStatisticDtoOut,
	DataPlantStatisticDtoOut,
	LegendLossStatisticDtoOut,
	LegendPlantStatisticDtoOut,
	ValuesPlantStatisticDtoOut,
} from './dto-out.dto'

const annualAnalysis = {
	getTablePlantStatistic: async (
		payload: any,
	): Promise<ResponseDto<DataPlantStatisticDtoOut[]>> => //add dtoout data
		await api.get(`/summary/plant-statistic/table`, APIService.DisasterAPI),
	getLinePlantStatistic: async (
		payload: any,
	): Promise<
		ResponseAnnualAnalysisLineDto<
			DataPlantStatisticDtoOut[],
			LegendPlantStatisticDtoOut,
			ValuesPlantStatisticDtoOut[]
		>
	> => await api.get(`/summary/plant-statistic/line`, APIService.DisasterAPI),
	getBarPlantStatistic: async (
		payload: any,
	): Promise<ResponseAnnualAnalysisBarDto<DataPlantStatisticDtoOut[], LegendPlantStatisticDtoOut>> => // add dtoout T2 = legends
		await api.get(`/summary/plant-statistic/bar`, APIService.DisasterAPI),
	getTableRiceStatistic: async (
		payload: any,
	): Promise<ResponseDto> => //add dtoout data
		await api.get(`/summary/rice-statistic/table`, APIService.DisasterAPI),
	getLineRiceStatistic: async (
		payload: any,
	): Promise<ResponseAnnualAnalysisLineDto> => //add dtoout T3 = values
		await api.get(`/summary/rice-statistic/line`, APIService.DisasterAPI),
	getBarRiceStatistic: async (
		payload: any,
	): Promise<ResponseAnnualAnalysisBarDto> => // add dtoout T2 = legends
		await api.get(`/summary/rice-statistic/bar`, APIService.DisasterAPI),
	getTableLossStatistic: async (payload: any): Promise<ResponseDto> =>
		await api.get(`/summary/loss-statistic/table`, APIService.DisasterAPI),
	getLineLossStatistic: async (payload: any): Promise<ResponseAnnualAnalysisLineDto> =>
		await api.get(`/summary/loss-statistic/line`, APIService.DisasterAPI),
	getBarLossStatistic: async (
		payload: any,
	): Promise<ResponseAnnualAnalysisBarDto<DataLossStatisticDtoOut[], LegendLossStatisticDtoOut>> =>
		await api.get(`/summary/loss-statistic/bar`, APIService.DisasterAPI),
}

export default annualAnalysis
