import service from '@/api'
import { refreshAccessToken, updateAccessToken } from '@/api/core'
import { AppPath } from '@/config/app'
import { UserSession } from '@/types/next-auth'
import { NextAuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'

const parseJwt = (token: string) => {
	return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
}

const authOptions: NextAuthOptions = {
	pages: {
		signIn: AppPath.Login,
	},
	session: {
		strategy: 'jwt',
	},
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				try {
					const { username, password } = credentials as any
					console.log('route', username, password)
					const res = await service.auth.login({ username, password })
					console.log('route res', res)
					if (res.data?.id) return { ...res.data, tokens: res.tokens }
					return null
				} catch (error: any) {
					return null
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user, session, trigger }) {
			delete token.error
			// console.log('TLOG ~ session:', session)
			// console.log('TLOG ~ user:', user)
			// console.log('TLOG ~ token:', token)
			if (trigger === 'update' && session) {
				// เมื่อมีการแก้ไข profile ต้องเอาค่าจาก session เข้าไปด้วย
				return { ...token, ...user, ...session } as JWT
			}
			const accessToken = token?.tokens?.accessToken
			const jwt = { ...token, ...user }
			// console.log('TLOG ~ jwt:', jwt)
			if (accessToken) {
				try {
					const data = parseJwt(accessToken)
					// console.log('TLOG ~ data:', data)
					const expiredTime = data?.exp
					const currentTime = Math.floor(Date.now() / 1000)
					// console.log('TLOG ~ currentTime:', currentTime)
					if (currentTime >= expiredTime) {
						const newToken = await refreshAccessToken()
						if (newToken?.accessToken) jwt.tokens.accessToken = newToken?.accessToken
						if (newToken?.refreshToken) jwt.tokens.refreshToken = newToken?.refreshToken
					}
				} catch (error) {
					jwt.error = 'RefreshAccessTokenError'
				}
			}
			return jwt as JWT
		},
		async session({ session, token }) {
			const userId = token?.id
			const accessToken = token?.tokens?.accessToken
			const refreshToken = token?.tokens?.refreshToken
			// console.log('------- session -------')
			// console.log('TLOG ~ accessToken:', accessToken)
			// console.log('TLOG ~ refreshToken:', refreshToken)

			const { error, ...user } = token
			session.user = user as UserSession
			console.log('route session ', accessToken)
			if (accessToken) {
				updateAccessToken({ accessToken, refreshToken, userId })
				session.user.tokens.accessToken = accessToken
				session.user.tokens.refreshToken = refreshToken
			}
			session.error = error
			return session
		},
	},
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
