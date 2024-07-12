// 'use client'

import service from '@/api'
import { Button, Paper } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

const FieldLossMain = () => {
	// const userData = await service.um.getUser({ userId: '295a35cc-80c1-702c-72f1-ad596ac1718a' })
	// console.log('TLOG ~ userData:', userData)

	// const { data: session } = useSession()
	// const { data: userData, isLoading } = useQuery({
	// 	queryKey: ['getUser'],
	// 	queryFn: () => service.um.getUser({ userId: session?.user?.id || '' }),
	// 	enabled: !!session?.user?.id,
	// })
	// console.log('TLOG ~ userData:', userData)

	return (
		<div className='flex flex-grow flex-col gap-y-6'>
			<div className='rounded-lg bg-white p-4'>Search Bar</div>
			<Paper className='flex-grow'>
				<Button variant='contained'>Contained</Button>
				<Button variant='outlined'>Outlined</Button>
			</Paper>
		</div>
	)
}

export default FieldLossMain
