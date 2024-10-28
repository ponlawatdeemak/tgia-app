import { ResponseArea, ResponseLanguage } from '../interface'

export interface dataAreas extends ResponseArea {
	column: ResponseLanguage
}
interface plantLegendItems {
	label: ResponseLanguage
	color: string
}

interface dataCategories {
	label: ResponseLanguage
	value: {
		area: ResponseArea
		percent: ResponseArea
	}
}

interface valuesArea {
	areaRai: number[]
	areaPlot: number[]
}
export interface DataPlantStatisticDtoOut {
	id: string
	name: ResponseLanguage
	areas: dataAreas
	categories: dataCategories[]
}

export interface LegendPlantStatisticDtoOut {
	visibility: number
	items: plantLegendItems[]
}

export interface ValuesPlantStatisticDtoOut {
	label: ResponseLanguage
	area: valuesArea
}

export interface DataLossStatisticDtoOut {
	name: ResponseLanguage
	label: ResponseLanguage
	value: {
		area: ResponseArea
		percent: ResponseArea
	}
	categories: dataCategories[]
}

export interface LegendLossStatisticDtoOut extends LegendPlantStatisticDtoOut {}

export interface ValuesLossStatisticDtoOut {}
