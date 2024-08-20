import { ErrorResponse, ResponseDto, ResponseLanguage } from '../interface'

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
	id: string
}

export interface DeleteProfileDtoOut {
	id: string
}

export interface PutProfileUMDtoOut extends PutProfileDtoOut {}

export interface PostProfileUMDtoOut {
	id: string
}

export interface GetTemplateCSVUMDtoOut {
	blob: Blob | MediaSource
}

export interface GetTemplateXLSXUMDtoOut extends GetTemplateCSVUMDtoOut {}

export interface PostImportCSVUMDtoOut {
	firstName: string
	lastName: string
	email: string
	role: string
	orgCode: string
	rowNo: number
	success: boolean
	result: string
}

export interface PostImportXLSXUMDtoOut extends PostImportCSVUMDtoOut {}

export interface PostImportCSVErrorDtoOut {}
