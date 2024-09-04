import { extend } from 'dayjs'

interface PlantDtoIn {
	years?: number[]
	registrationAreaType?: number
	provinceCode?: number
	districtCode?: number
	subDistrictCode?: number
}

interface RiceDtoIn extends PlantDtoIn {}

interface LossDtoIn extends PlantDtoIn {
	lossType?: number
}
export interface GetTablePlantDtoIn extends PlantDtoIn {}

export interface GetLinePlantDtoIn extends PlantDtoIn {}

export interface GetBarPlantDtoIn extends PlantDtoIn {}

export interface GetTableRiceDtoIn extends RiceDtoIn {}

export interface GetLineRiceDtoIn extends RiceDtoIn {}

export interface GetBarRiceDtoIn extends RiceDtoIn {}

export interface GetTableLossDtoIn extends LossDtoIn {}

export interface GetLineLossDtoIn extends LossDtoIn {}

export interface GetBarLossDtoIn extends LossDtoIn {}
