import { extend } from 'dayjs'

interface PlantDtoIn {
	years?: number[]
	registrationAreaType?: number
	provinceCode?: number
	districtCode?: number
	subDistrictCode?: number
}

interface RiceDtoIn extends PlantDtoIn {}
export interface GetTablePlantDtoIn extends PlantDtoIn {}

export interface GetLinePlantDtoIn extends PlantDtoIn {}

export interface GetBarPlantDtoIn extends PlantDtoIn {}

export interface GetTableRiceDtoIn extends RiceDtoIn {}

export interface GetLineRiceDtoIn extends RiceDtoIn {}

export interface GetBarRiceDtoIn extends RiceDtoIn {}
