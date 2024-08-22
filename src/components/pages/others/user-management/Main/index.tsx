'use client'
import { useState } from 'react'
import { GetSearchUMDtoIn } from '@/api/um/dto-in.dto'
import { SortType } from '@/enum'
import UserManagementSearchForm from './SearchForm'
import UserManagementTable from './Table'
import useResponsive from '@/hook/responsive'
import { useTranslation } from 'react-i18next'

export const UserManagementMain = () => {
	const { t, i18n } = useTranslation(['default', 'um'])
	const [searchParams, setSearchParams] = useState<GetSearchUMDtoIn>({
		keyword: '',
		firstName: '',
		sortField: 'firstName',
		sortOrder: SortType.ASC,
		limit: 10,
		offset: 0,
		respLang: i18n.language,
	})
	const [isSearch, setIsSearch] = useState<boolean>(false)
	const [page, setPage] = useState<number>(1)
	const { isDesktop } = useResponsive()
	return (
		<div className={`flex flex-col ${isDesktop ? 'pl-[32px] pr-[32px]' : 'pl-[8px] pr-[8px]'}`}>
			<UserManagementSearchForm setSearchParams={setSearchParams} setIsSearch={setIsSearch} setPage={setPage} />
			<UserManagementTable
				searchParams={searchParams}
				setSearchParams={setSearchParams}
				isSearch={isSearch}
				setIsSearch={setIsSearch}
				page={page}
				setPage={setPage}
			/>
		</div>
	)
}
