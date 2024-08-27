export interface GetSearchPlotDtoIn {
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
	orderBy?: string
	offset?: number
	limit?: number
}

export interface GetAreaSearchPlotDtoIn extends GetSearchPlotDtoIn {}
