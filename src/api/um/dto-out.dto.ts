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

export interface CreateProfileImageDtoOut {
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
}

export interface PutProfileDtoOut {
	data: {
		id: string
	}
	message: string
}
