import { api } from '@/api/core'
import { APIService, ResponseDto } from '@/api/interface'
import { CreateProfileImageDtoIn, GetUmDtoIn, PutProfileDtoIn } from '@/api/um/dto-in.dto'
import { CreateProfileImageDtoOut, GetProfileDtoOut, GetUmDtoOut, PutProfileDtoOut } from '@/api/um/dto-out.dto'

const um = {
	getUser: async (payload: GetUmDtoIn): Promise<ResponseDto<GetUmDtoOut>> => await api.get(`/um/${payload.userId}`),
	uploadImg: async (payload: CreateProfileImageDtoIn): Promise<ResponseDto<CreateProfileImageDtoOut>> => {
		const formData = new FormData()
		formData.append('file', payload.file)
		return await api.post('/files/upload', formData, APIService.WebAPI, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
	},
	getProfile: async (): Promise<ResponseDto<GetProfileDtoOut>> => (await api.get('/profile')).data,
	putProfile: async (payload: PutProfileDtoIn): Promise<ResponseDto<PutProfileDtoOut>> =>
		await api.put('/profile', payload),
}

export default um
