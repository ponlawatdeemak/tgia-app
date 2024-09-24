export interface GetAreaSearchPlotDtoIn {
	activityId?: number
	year: number
	registrationAreaType: number
	provinceCode?: number
	districtCode?: number
	subDistrictCode?: number
	lossType?: number
	insuredType?: number
	publicStatus?: number
	riskType?: string[]
	riceType?: number
	detailType?: number
}

export interface GetSearchPlotDtoIn extends GetAreaSearchPlotDtoIn {
	orderBy?: string
	offset?: number
	limit?: number
}

export interface GetPositionSearchPlotDtoIn {
	lat: number
	lon: number
	year?: number
}

export interface GetPlotActivityDetailDtoIn {
	activityId: number
	count?: number
}

export interface DeletePOISDtoIn {
	poiId: string
}
