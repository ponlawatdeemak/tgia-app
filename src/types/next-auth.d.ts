import NextAuth from 'next-auth'

interface Tokens {
	idToken: string
	accessToken: string
	refreshToken: string
	expiresIn: number
}

interface UserSession {
	email: string
	picture: string
	sub: string
	id: string
	username: string
	firstName: string
	lastName: string
	image: string
	orgCode: string
	role: string
	responsibleProvinceCode: string
	responsibleDistrictCode: string
	flagStatus: string
	createdAt: string
	updatedAt: string
	tokens: Tokens
	iat: number
	exp: number
	jti: string
}

declare module 'next-auth' {
	interface Session {
		user: UserSession
	}
}

declare module 'next-auth/jwt' {
	/** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
	interface JWT extends UserSession {}
}
