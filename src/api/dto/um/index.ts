import { api } from '@/api/core'
import { CreateProfileImageDtoOut, GetProfileDtoOut, GetUmDtoOut, PutProfileDtoOut } from '@/api/dto/um/dto-out.dto'
import { CreateProfileImageDtoIn, GetUmDtoIn, PutProfileDtoIn } from '@/api/dto/um/dto-in.dto'
import { ResponseDto } from '@/api'

const um = {
	getUser: async (payload: GetUmDtoIn): Promise<ResponseDto<GetUmDtoOut>> => await api.fetch(`/um/${payload.userId}`),
	uploadImg: async (payload: CreateProfileImageDtoIn): Promise<ResponseDto<CreateProfileImageDtoOut>> => {
		const formData = new FormData()
		formData.append('file', payload.file)
		return await api.post('/files/upload', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
	},
	getProfile: async (): Promise<ResponseDto<GetProfileDtoOut>> => await api.fetch('/profile'),
	putProfile: async (payload: PutProfileDtoIn): Promise<ResponseDto<PutProfileDtoOut>> =>
		await api.put('/profile', payload),
}

export default um
