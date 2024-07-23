'use client'
import { Breadcrumbs, Link, Typography } from '@mui/material'
import React from 'react'

import useLanguage from '@/store/language'
import { useTranslation } from '@/i18n/client'

interface AuthBreadcrumbsProps {
	name: string
	href: string
}

const AuthBreadcrumbs: React.FC<AuthBreadcrumbsProps> = ({ name, href }) => {
	const { language } = useLanguage()
	const { t } = useTranslation(language, 'appbar')
	return (
		<Breadcrumbs className='border-0 border-b border-solid border-gray px-12 py-4 text-sm'>
			<Link className='font-semibold' underline='always' href={href}>
				{t('auth.signIn')}
			</Link>
			<Typography className='text-sm font-semibold text-black'>{name}</Typography>
		</Breadcrumbs>
	)
}

export default AuthBreadcrumbs
