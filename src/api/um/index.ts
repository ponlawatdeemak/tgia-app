import { api } from '@/api/core'
import { DeleteProfileDtoOut, GetProfileDtoOut, GetSearchUMDtoOut, GetUmDtoOut, PatchStatusDtoOut, PostProfileUMDtoOut, PostUploadFilesDtoOut, PutProfileDtoOut, PutProfileUMDtoOut } from '@/api/um/dto-out.dto'
import { DeleteProfileDtoIn, GetSearchUMDtoIn, GetUmDtoIn, PatchStatusDtoIn, PostProfileUMDtoIn, PostUploadFilesDtoIn, PutProfileDtoIn, PutProfileUMDtoIn } from '@/api/um/dto-in.dto'
import { APIService, ResponseDto } from '@/api/interface'

// Api for Profile and UM
const um = {
	getUM: async (payload: GetUmDtoIn): Promise<ResponseDto<GetUmDtoOut>> => await api.get(`/um/${payload.userId}`),
	postUploadFiles: async (payload: PostUploadFilesDtoIn): Promise<ResponseDto<PostUploadFilesDtoOut>> => {
		const formData = new FormData()
		formData.append('file', payload.file)
		return await api.post('/files/upload', formData, APIService.WebAPI, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
	},
	getProfile: async (): Promise<ResponseDto<GetProfileDtoOut>> => await api.get('/profile'),
	putProfile: async (payload: PutProfileDtoIn): Promise<ResponseDto<PutProfileDtoOut>> =>
		await api.put('/profile', payload),
	getSearchUM: async (payload: GetSearchUMDtoIn): Promise<ResponseDto<GetSearchUMDtoOut[]>> => 
		(await api.get(`/um/search?keyword=${payload.keyword}&sortField=${payload.sortField}&sortOrder=${payload.sortOrder}&limit=${payload.limit}&offset=${payload.offset}`)),
	patchStatus: async (payload: PatchStatusDtoIn) : Promise<ResponseDto<PatchStatusDtoOut>> =>
		await api.patch(`/um/${payload.id}`,payload),
	deleteProfile: async (payload: DeleteProfileDtoIn) : Promise<ResponseDto<DeleteProfileDtoOut>> => await api.delete(`/um/${payload.id}`),
	putProfileUM: async (payload: PutProfileUMDtoIn) : Promise<ResponseDto<PutProfileUMDtoOut>> => await api.put(`/um/${payload.id}`,payload),
	postProfileUM: async (payload: PostProfileUMDtoIn): Promise<ResponseDto<PostProfileUMDtoOut>> => await api.post('/um',payload),
	getTemplateCSVUM: async (): Promise<ResponseDto> => await api.get('/um/import/template/csv')
}

export default um
