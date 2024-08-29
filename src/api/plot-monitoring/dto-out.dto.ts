import { Polygon } from 'geojson'
import { ResponseArea, ResponseLanguage } from '../interface'
import { LossType } from '@/enum'

interface PredictedRiceArea {
	areaRai: number
	percent: number
}

interface LossPredicted extends PredictedRiceArea {
	lossType: string
}

export interface GetSearchPlotDtoOut {
	activityId: number
	count: number
	order: number
	address: ResponseLanguage
	year: ResponseLanguage
	predictedRiceArea: PredictedRiceArea
	lossPredicted: LossPredicted
	publicStatus: ResponseLanguage
	riceType: ResponseLanguage
	detailType: ResponseLanguage
	insuredType: ResponseLanguage
	riskType: ResponseLanguage
	geometry: Polygon
}

export interface GetAreaSearchPlotDtoOut {
	activityId: number
}
