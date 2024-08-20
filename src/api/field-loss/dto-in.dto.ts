import { GetAreaStatisticDtoOut } from './dto-out.dto'
export interface GetSearchAdminPolyDtoIn {
	keyword?: string
	id?: number
}

export interface GetSummaryPredictedLossDtoIn {
	lossType?: number
	startDate: string
	endDate: string
	registrationAreaType: number
	provinceCode?: number
	districtCode?: number
}

export interface GetSummaryAreaDtoIn {
	startDate: string
	endDate: string
	registrationAreaType: number
	provinceCode?: number
	districtCode?: number
}

export interface GetAreaStatisticDtoIn {
	startDate?: string
	endDate?: string
	lossType?: number
	registrationAreaType: number
	sort?: string
	sortType?: string
}

export interface GetTimeStatisticDtoIn {
	startDate?: string
	endDate?: string
	lossType?: number
	registrationAreaType: number
}
