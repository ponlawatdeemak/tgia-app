'use client'

import service from '@/api'
import { updateAccessToken } from '@/api/core'
import { Button } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'

const ClientPage = () => {
	const userId = '295a35cc-80c1-702c-72f1-ad596ac1718a'
	// const {
	// 	data: loginData,
	// 	isPending,
	// 	error,
	// 	isSuccess,
	// 	mutateAsync: mutateLogin,
	// } = useMutation({
	// 	mutationFn: service.auth.login,
	// })

	// updateAccessToken(loginData?.tokens?.accessToken)
	const {
		data: userData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['getUser', { userId }],
		queryFn: () => service.um.getUser({ userId }),
		// enabled: !!loginData?.data,
	})

	console.log('error : ', error)

	// if (isPending || isLoading) {
	// 	return <div>Loading...</div>
	// } else if (error) {
	// 	return <div>{error?.message}</div>
	// }

	return (
		<div>
			{/* {!isSuccess && (
				<Button
					onClick={() =>
						mutateLogin({
							username: process.env.APP_USERNAME || '-',
							password: process.env.APP_PASSWORD || '-',
						})
					}
				>
					Login
				</Button>
			)} */}
			<div>ClientPage</div>
			{userData?.data ? <div>User Exist!</div> : <div>User Not Found!</div>}
		</div>
	)
}

export default ClientPage
