import { Breadcrumbs, Link, Typography } from '@mui/material'
import React from 'react'

interface AuthBreadcrumbsProps {
	name: string
	href: string
}

const AuthBreadcrumbs: React.FC<AuthBreadcrumbsProps> = ({ name, href }) => {
	return (
		<Breadcrumbs className='border-gray border-0 border-b border-solid px-12 py-4 text-sm'>
			<Link className='font-semibold' underline='always' href={href}>
				ลงชื่อเข้าใช้
			</Link>
			<Typography className='text-sm font-semibold text-black'>{name}</Typography>
		</Breadcrumbs>
	)
}

export default AuthBreadcrumbs
