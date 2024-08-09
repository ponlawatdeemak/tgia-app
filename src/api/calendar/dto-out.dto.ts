export interface GetCalendarDtoOut {
	dateTime: string
	lossType: string
	lossPredicted: LossPredictedType
}
export interface LossPredictedType {
	areaRai: number
	areaPlot: number
}
