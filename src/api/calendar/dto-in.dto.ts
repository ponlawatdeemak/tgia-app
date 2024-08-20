import { AreaTypeKey } from '@/enum'

export interface GetCalendarDtoIn {
	startDate: string
	endDate: string
	registrationAreaType: AreaTypeKey
	provinceCode: number | undefined
	districtCode: number | undefined
}
