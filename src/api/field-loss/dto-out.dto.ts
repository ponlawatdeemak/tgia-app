import { ResponseArea, ResponseLanguage } from '..'

export interface GetSearchAdminPolyDtoOut {
	id: string
	name: string
}

interface LossPredicted extends ResponseArea {
	lossType: string
	percent: number
}

export interface GetSummaryAreaDtoOut {
	name: ResponseLanguage
	lossPredicted: LossPredicted
}
