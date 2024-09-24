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

interface PredictedRiceAreaPosition extends PredictedRiceArea {
	areaPlot: number
}

interface LossPredictedPosition extends LossPredicted {
	areaPlot: number
}

interface PositionSearchResult {
	count: number
	lossPredicted: LossPredictedPosition
}

export interface GetPositionSearchPlotDtoOut {
	activityId: number
	predictedRiceArea: PredictedRiceAreaPosition
	results: PositionSearchResult[]
}

interface ResponseActArea {
	areaRai: number
	areaNgan: number
	areaWa: number
}
interface ResponsePredeicted {
	areaRai: number
	percent: number
}

export interface GetPlotActivityPlantDetailDtoOut {
	activityId: number
	count: number
	lossType: string
	address: ResponseLanguage
	year: ResponseLanguage
	insuredStatus: ResponseLanguage
	insuredType: ResponseLanguage
	publicStatus: ResponseLanguage
	riskType: ResponseLanguage
	riceType: ResponseLanguage
	detailType: ResponseLanguage
	plantDate: ResponseLanguage
	produceDate: ResponseLanguage
	actArea: ResponseActArea
	predictedRiceArea: ResponsePredeicted
	predictedNonRiceArea: ResponsePredeicted
	updateDoaeDate: ResponseLanguage
	predictedRiceAreaDate: ResponseLanguage
}

interface ResponselossPredicted {
	lossType: string
	areaRai: number
	percent: number
}

interface ResponseDisasterArea {
	areaRai: number
}

export interface GetPlotActivityLossDetailDtoOut {
	activityId: number
	count: number
	lossType: string
	address: ResponseLanguage
	year: ResponseLanguage
	insuredStatus: ResponseLanguage
	insuredType: ResponseLanguage
	publicStatus: ResponseLanguage
	riskType: ResponseLanguage
	actArea: ResponseActArea
	disasterArea: ResponseDisasterArea
	predictedRiceArea: ResponsePredeicted
	lossPredicted: ResponselossPredicted
	updateDisasterDate: ResponseLanguage
	startObsDate: ResponseLanguage
	endObsDate: ResponseLanguage
	updateLossDate: ResponseLanguage
	predictedLossDate: ResponseLanguage
}

export interface GetPOISDtoOut {
	poiId: string
	userId: string
	title: string
	lat: number
	lng: number
	createdAt: string
	updatedAt: string
}

export interface DeletePOISDtoOut {
	id: string
}
