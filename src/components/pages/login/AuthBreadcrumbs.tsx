'use client'
import { Breadcrumbs, Link, Typography } from '@mui/material'
import React from 'react'

import { WithTranslation, withTranslation } from 'react-i18next'

interface AuthBreadcrumbsProps extends WithTranslation {
	name: string
	href: string
}

const AuthBreadcrumbs: React.FC<AuthBreadcrumbsProps> = ({ name, href, t }) => {
	return (
		<Breadcrumbs className='border-0 border-b border-solid border-gray px-12 py-4 text-sm'>
			<Link className='font-semibold' underline='always' href={href}>
				{t('auth.signIn')}
			</Link>
			<Typography className='text-sm font-semibold text-black'>{name}</Typography>
		</Breadcrumbs>
	)
}

export default withTranslation('appbar')(AuthBreadcrumbs)
