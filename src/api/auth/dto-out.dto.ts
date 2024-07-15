export interface LoginDtoOut {
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

export interface ForgetPasswordDtoOut {
	success: boolean
}

export interface ResetPasswordDtoOut {
	success: boolean
}
