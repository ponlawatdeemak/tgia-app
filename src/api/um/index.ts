import { ResponseDto } from '..'
import { api } from '../core'
import { CreateProfileImageDtoIn, GetUmDtoIn } from './dto-in.dto'
import { CreateProfileImageDtoOut, GetProfileDtoOut, GetUmDtoOut } from './dto-out.dto'

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
