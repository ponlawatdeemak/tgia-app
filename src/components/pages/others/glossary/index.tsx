'use client'

import { Typography } from '@mui/material'
import { glossaryData } from './data'
import { useTranslation } from 'react-i18next'
import { ResponseLanguage } from '@/api/interface'

const GlossaryMain = () => {
	const { t, i18n } = useTranslation(['appbar'])
	const language = i18n.language as keyof ResponseLanguage

	return (
		<div className='box-border flex h-full flex-col p-4'>
			<div className='box-border flex h-full flex-col space-y-4 rounded-lg bg-white p-6'>
				<Typography className='mb-2 text-base font-semibold'>{t('menu.glossary')}</Typography>
				<div className='overflow-scroll'>
					{glossaryData.map((item, index) => (
						<div key={index} className='mb-4 space-y-2 rounded-lg bg-gray-light2 p-4'>
							<Typography className='text-base font-semibold'>{item.word[language]}</Typography>
							<Typography className='text-sm font-normal'>{item.meaning[language]}</Typography>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default GlossaryMain
