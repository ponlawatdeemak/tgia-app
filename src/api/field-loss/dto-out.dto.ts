import { GetSummaryPredictedLossDtoIn } from './dto-in.dto'
import { ResponseArea, ResponseLanguage } from '../interface'

export interface GetSearchAdminPolyDtoOut {
	id: string
	name: string
}

interface ClaimedArea extends ResponseArea {
	percent: number
}

export interface LossPredicted extends ResponseArea {
	lossType: string
	percent: number
}

export interface GetSummaryAreaDtoOut {
	name: ResponseLanguage
	lossPredicted: LossPredicted
	predictedArea: ClaimedArea
}

export interface GetSummaryPredictedLossDtoOut {
	updatedDate: string
	actArea: ResponseArea
	actAreaNoGeom: ResponseArea
	predictedArea: ResponseArea
	claimedArea: ClaimedArea
	lossPredicted: LossPredicted[]
}

export interface LossTypeAreaPredicted {
	totalPredicted: ResponseArea
	floodPredicted: ResponseArea
	droughtPredicted: ResponseArea
}

export interface GetAreaStatisticDtoOut extends LossTypeAreaPredicted {
	id: string
	name: ResponseLanguage
	order: number
}

export interface GetTimeStatisticDtoOut {
	month: number
	monthYear: ResponseLanguage
	totalPredicted: ResponseArea
	floodPredicted: ClaimedArea
	droughtPredicted: ClaimedArea
}
