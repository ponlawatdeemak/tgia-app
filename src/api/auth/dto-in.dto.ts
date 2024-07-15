export interface LoginDtoIn {
	username: string
	password: string
}

export interface ForgetPasswordDtoIn {
	email: string
}

export interface ResetPasswordDtoIn {
	email: string
	password: string
	confirmationCode: string
}
