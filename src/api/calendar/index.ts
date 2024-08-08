import { api } from '@/api/core'
import { APIService, ResponseDto } from '@/api/interface'
import { GetCalendarDtoIn } from '@/api/calendar/dto-in.dto'
import { GetCalendarDtoOut } from '@/api/calendar/dto-out.dto'

const calendar = {
	getCalendar: async (payload: GetCalendarDtoIn): Promise<ResponseDto<GetCalendarDtoOut[]>> => {
		const query = Object.keys(payload)
			.filter((key) => !!payload[key])
			.map((key) => `${key}=${payload[key]}`)
			.join('&')
		console.log('query : ', query)
		return await api.get(`/calendar?${query}`, APIService.DisasterAPI)
	},
}

export default calendar
