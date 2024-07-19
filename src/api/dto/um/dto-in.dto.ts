export interface GetUmDtoIn {
	userId: string
}

export interface CreateProfileImageDtoIn {
	file: File
}

export interface PutProfileDtoIn {
	id: string
	firstName: string
	lastName: string
	email: string
	image: string
	responsibleProvinceCode: string
	responsibleDistrictCode: string
}
