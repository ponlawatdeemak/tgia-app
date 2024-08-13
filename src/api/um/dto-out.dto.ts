import { ResponseLanguage } from '../interface'

export interface GetUmDtoOut {
	id: string
	username: string
	firstName: string
	lastName: string
	email: string
	image: string
	orgCode: string
	role: string
	responsibleProvinceCode: any
	responsibleDistrictCode: any
	flagStatus: string
	createdAt: string
	updatedAt: string
}

export interface PostUploadFilesDtoOut {
	download_file_url: string
}

export interface GetProfileDtoOut {
	id: string
	username: string
	firstName: string
	lastName: string
	email: string
	image: string
	orgCode: string
	role: string
	responsibleProvinceCode: any
	responsibleDistrictCode: any
	orgName: ResponseLanguage
	roleName: ResponseLanguage
	responsibleProvinceName: ResponseLanguage
	responsibleDistrictName: ResponseLanguage
	flagStatusName: ResponseLanguage
}

export interface PutProfileDtoOut {
	id: string
}

export interface GetSearchUMDtoOut extends GetProfileDtoOut {
	flagStatus: string
}

export interface PatchStatusDtoOut {
	id : string,
}

export interface DeleteProfileDtoOut {
	id: string
}