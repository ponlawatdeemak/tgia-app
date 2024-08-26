import { api } from '../core'
import { APIService, ResponseAnnualAnalysisBarDto, ResponseAnnualAnalysisLineDto, ResponseDto } from '../interface'

const annualAnalysis = {
	getTablePlantStatistic: async (
		payload: any,
	): Promise<ResponseDto> => //add dtoout data
		await api.get(`/summary/plant-statistic/table`, APIService.DisasterAPI),
	getLinePlantStatistic: async (
		payload: any,
	): Promise<ResponseAnnualAnalysisLineDto> => //add dtoout T3 = values
		await api.get(`/summary/plant-statistic/line`, APIService.DisasterAPI),
	getBarPlantStatistic: async (
		payload: any,
	): Promise<ResponseAnnualAnalysisBarDto> => // add dtoout T2 = legends
		await api.get(`/summary/plant-statistic/bar`, APIService.DisasterAPI),
}

export default annualAnalysis
