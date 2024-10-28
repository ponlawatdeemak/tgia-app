'use client'

import { Button } from '@mui/material'
import { signOut } from 'next-auth/react'
import { useCallback } from 'react'

const ProfileMain = () => {
	const logout = useCallback(() => signOut(), [])

	return (
		<div>
			<div>ProfileMain</div>
			<Button onClick={logout}>Logout</Button>
		</div>
	)
}

export default ProfileMain
