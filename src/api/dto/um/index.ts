import { api } from '@/api/core'
import { CreateProfileImageDtoOut, GetProfileDtoOut, GetUmDtoOut } from '@/api/dto/um/dto-out.dto'
import { GetUmDtoIn } from '@/api/dto/um/dto-in.dto'
import { ResponseDto } from '@/api'

const um = {
	getUser: async (payload: GetUmDtoIn): Promise<ResponseDto<GetUmDtoOut>> => await api.fetch(`/um/${payload.userId}`),
	uploadImg: async (file: File): Promise<ResponseDto<CreateProfileImageDtoOut>> => {
		const formData = new FormData()
		formData.append('file', file)
		return await api.post('/files/upload', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
	},
	getProfile: async (): Promise<ResponseDto<GetProfileDtoOut>> => await api.fetch('/profile'),
}

export default um
