import { api } from '@/api/core'
import { GetProfileDtoOut, GetSearchUMDtoOut, GetUmDtoOut, PostUploadFilesDtoOut, PutProfileDtoOut } from '@/api/um/dto-out.dto'
import { GetSearchUMDtoIn, GetUmDtoIn, PostUploadFilesDtoIn, PutProfileDtoIn } from '@/api/um/dto-in.dto'
import { ResponseDto } from '@/api'

// Api for Profile and UM
const um = {
	getUM: async (payload: GetUmDtoIn): Promise<ResponseDto<GetUmDtoOut>> => await api.fetch(`/um/${payload.userId}`),
	postUploadFiles: async (payload: PostUploadFilesDtoIn): Promise<ResponseDto<PostUploadFilesDtoOut>> => {
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
	getSearchUM: async (payload: GetSearchUMDtoIn): Promise<ResponseDto<GetSearchUMDtoOut[]>> => 
		(await api.get(`/um/search?keyword=${payload.keyword}&sortField=${payload.firstName}&sortOrder=${payload.sortOrder}&limit=${payload.limit}&offset=${payload.offset}`))?.data 
}

export default um
