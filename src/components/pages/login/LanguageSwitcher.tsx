'use client'

import { Language } from '@/enum'
import { useSwitchLanguage } from '@/i18n/client'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { usePathname } from 'next/navigation'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

interface LanguageSwitcherProps {}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = () => {
	const pathname = usePathname()
	const { i18n } = useTranslation()
	const { i18n: i18nWithCookie } = useSwitchLanguage(i18n.language as Language, 'appbar')

	const handleChangeLanguage = useCallback(
		(_: React.MouseEvent<HTMLElement>, newLanguage: Language) => {
			if (newLanguage !== null) {
				i18nWithCookie.changeLanguage(newLanguage)
				const oldLanguage = pathname?.split('/')?.[1]
				window.history.pushState(null, '', window.location.href.replace(`/${oldLanguage}/`, `/${newLanguage}/`))
			}
		},
		[i18nWithCookie, pathname],
	)

	return (
		<ToggleButtonGroup
			className='box-border flex p-1'
			value={i18nWithCookie.language}
			exclusive
			color='primary'
			onChange={handleChangeLanguage}
		>
			<ToggleButton
				className='primary-color rounded px-3 py-0.5 text-sm'
				value={Language.TH}
				aria-label='left aligned'
			>
				TH
			</ToggleButton>
			<ToggleButton className='rounded px-3 py-0.5 text-sm' value={Language.EN} aria-label='right aligned'>
				EN
			</ToggleButton>
		</ToggleButtonGroup>
	)
}

export default LanguageSwitcher
