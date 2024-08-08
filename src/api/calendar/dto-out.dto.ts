export interface GetCalendarDtoOut {
	dateTime: string
	lossType: string
	lossPredicted: LossPredicted
}

interface LossPredicted {
	areaRai: number
	areaPlot: number
}
