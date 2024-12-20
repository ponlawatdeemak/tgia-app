import { api } from '@/api/core'
import { APIService, ResponseDto } from '@/api/interface'
import { GetCalendarDtoIn } from '@/api/calendar/dto-in.dto'
import { GetCalendarDtoOut } from '@/api/calendar/dto-out.dto'
import { getQueryParams } from '@/utils/api'

const calendar = {
	getCalendar: async (payload: GetCalendarDtoIn): Promise<ResponseDto<GetCalendarDtoOut[]>> => {
		const query = getQueryParams(payload)
		return await api.get(`/calendar?${query}`, APIService.DisasterAPI)
	},
}

export default calendar
