export interface GetAreaSearchPlotDtoIn {
	activityId?: number
	year: number
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

export interface GetPlotActivityPlantDetailDtoIn {
	activityId?: number
}

export interface GetPlotActivityLossDetailDtoIn {
	activityId?: number
}
