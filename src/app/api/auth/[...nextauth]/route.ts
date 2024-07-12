import service from '@/api'
import { updateAccessToken } from '@/api/core'
import { AppPath } from '@/config/app'
import { UserSession } from '@/types/next-auth'
import { NextAuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
	pages: {
		signIn: AppPath.Login,
	},
	session: {
		strategy: 'jwt',
	},
	providers: [
		CredentialsProvider({
			// The name to display on the sign in form (e.g. "Sign in with...")
			name: 'Credentials',
			// `credentials` is used to generate a form on the sign in page.
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials, req) {
				try {
					const { username, password } = credentials as any
					const res = await service.auth.login({ username, password })
					return { ...res.data, tokens: res.tokens }
				} catch (error: any) {
					return null
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			return { ...token, ...user } as JWT
		},
		async session({ session, token }) {
			const accessToken = token?.tokens?.accessToken
			if (accessToken) {
				updateAccessToken(accessToken)
			}
			session.user = token as UserSession
			return session
		},
	},
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
