'use client'

import { api } from '@/api/core'
import { Button } from '@mui/material'
import { QueryClient, useMutation } from '@tanstack/react-query'
import { signOut, useSession } from 'next-auth/react'
import { useCallback } from 'react'

const ProfileMain = () => {
	const queryClient = new QueryClient()
	const { data: session, update } = useSession()
	console.log('TLOG ~ session:', session)

	const {
		data,
		error,
		mutateAsync: mutateUpdateProfile,
	} = useMutation({
		mutationFn: async (payload: any) => {
			await api.put('/profile', payload)
			queryClient.invalidateQueries({ queryKey: ['getProfile'] })
		},
	})

	const logout = useCallback(() => signOut(), [])

	return (
		<div>
			<div>ProfileMain</div>
			<div className='flex flex-row'>
				<Button
					variant='contained'
					onClick={async () => {
						await mutateUpdateProfile({
							id: 'a9ca55ec-2021-70db-d789-23418c367f05',
							firstName: 'Suthika',
							lastName: 'Wongsiridech',
							email: 'w.suthika@gmail.com',
							image: '',
						})
						// ใช้ update ค่า data จาก useSession
						await update({
							firstName: 'Suthika',
						})
					}}
				>
					Update Profile
				</Button>
				<Button
					variant='contained'
					onClick={async () => {
						const profile = await api.fetch('/profile')
						console.log('profile : ', profile)
					}}
				>
					Get Profile
				</Button>

				<Button variant='contained' onClick={logout}>
					Logout
				</Button>
			</div>
		</div>
	)
}

export default ProfileMain
