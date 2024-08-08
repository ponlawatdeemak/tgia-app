'use client'
import { useState } from 'react'
import { GetSearchUMDtoIn } from '@/api/um/dto-in.dto'
import { SortType } from '@/enum'
import UserManagementSearchForm from './SearchForm'
import UserManagementTable from './Table'

export const UserManagementMain = () => {
	const [searchParams, setSearchParams] = useState<GetSearchUMDtoIn>({
		keyword: '',
		firstName: '',
		sortField: 'firstName',
		sortOrder: SortType.ASC,
		limit: 10,
		offset: 0,
	})
	const [isSearch, setIsSearch] = useState<boolean>(false)
	const [page, setPage] = useState<number>(1)

	return (
		<div className='flex flex-col'>
			<UserManagementSearchForm
				searchParams={searchParams}
				setSearchParams={setSearchParams}
				isSearch={isSearch}
				setIsSearch={setIsSearch}
				page={page}
				setPage={setPage}
			/>
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
