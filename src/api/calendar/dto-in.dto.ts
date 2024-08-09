import { AreaTypeKey } from '@/enum'

export interface GetCalendarDtoIn {
	startDate: string
	endDate: string
	registrationAreaType: AreaTypeKey
	provinceId: number | undefined
	districtId: number | undefined
}
