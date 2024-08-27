import { Polygon } from 'geojson'
import { ResponseArea, ResponseLanguage } from '../interface'

interface LossPredicted extends ResponseArea {
	percent: number
}

export interface GetSearchPlotDtoOut {
	activityId: number
	count: number
	order: number
	address: ResponseLanguage
	year: ResponseLanguage
	predictedRiceArea: ResponseArea
	lossPredicted: LossPredicted
	publicStatus: ResponseLanguage
	riceType: ResponseLanguage
	detailType: ResponseLanguage
	insuredType: ResponseLanguage
	riskType: ResponseLanguage
	geometry: Polygon
}

export interface GetSearchPlotTotalDtoOut {
	total: number
}

export interface GetAreaSearchPlotDtoOut {
	activityId: number
}
