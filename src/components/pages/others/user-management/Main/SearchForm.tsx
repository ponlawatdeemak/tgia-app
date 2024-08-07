'use client'

import { Button, FormControl, Input, InputAdornment, Paper } from '@mui/material'
import { FormMain } from '../Form'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { GetSearchUMDtoIn } from '@/api/um/dto-in.dto'

export interface UserManagementSearchFormProps {
	searchParams: GetSearchUMDtoIn
	setSearchParams: React.Dispatch<React.SetStateAction<GetSearchUMDtoIn>>
	isSearch: boolean
	setIsSearch: React.Dispatch<React.SetStateAction<boolean>>
}

const UserManagementSearchForm: React.FC<UserManagementSearchFormProps> = ({
	searchParams,
	setSearchParams,
	isSearch,
	setIsSearch,
}) => {
	const [openForm, setOpenForm] = useState<boolean>(false)
	const [searchString, setSearchString] = useState<string>('')
	// Change Event to useCallback
	const handleSubmitUser = async (event: FormEvent) => {
		console.log('Form submitted')
		// Add your form submission logic here
	}

	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchString(event.target.value)
		setSearchParams((prevSearch) => ({
			...prevSearch,
			keyword: event.target.value,
		}))
	}

	const handleOnBlur = (
		event: React.FocusEvent<HTMLInputElement> | React.FormEvent<Element>
	) => {
		// Blur Will Toggle all the time
		event.preventDefault()
		console.log('onBlur')
		setIsSearch(true)
	}

	return (
		<>
			<Paper className='flex gap-[6px] bg-[#D9E0EB] p-[6px]'>
				<form onSubmit={(event) => {
					handleOnBlur(event)
				}}>
					<FormControl fullWidth variant='standard' className='h-[40px] rounded-[8px] bg-white'>
						<Input
							className='flex h-[40px] gap-[8px] px-[12px] py-[8px] [&_.MuiInputAdornment-positionStart]:m-0'
							id='standard-search'
							placeholder='ค้นหา ชื่อ, อีเมล, จังหวัด, อำเภอ'
							type='search'
							startAdornment={
								<InputAdornment position='start'>
									<SearchOutlinedIcon className='h-[24px] w-[24px] text-black' />
								</InputAdornment>
							}
							onChange={handleSearchChange}
							onBlur={handleOnBlur}
							disableUnderline={true}
						/>
					</FormControl>
				</form>
				<Button
					className='flex h-[40px] shrink-0 gap-[8px] bg-white py-[8px] pl-[12px] pr-[16px] text-sm font-medium text-black [&_.MuiButton-startIcon]:m-0'
					variant='contained'
					startIcon={<GroupAddOutlinedIcon className='h-[24px] w-[24px]' />}
					onClick={() => setOpenForm(true)}
				>
					เพิ่มผู้ใช้งาน
				</Button>
				<Button
					className='flex h-[40px] shrink-0 gap-[8px] bg-white py-[8px] pl-[12px] pr-[16px] text-sm font-medium text-black [&_.MuiButton-startIcon]:m-0'
					variant='contained'
					color='primary'
					startIcon={<SystemUpdateAltIcon className='h-[24px] w-[24px]' />}
				>
					นำเข้าผู้ใช้งาน
				</Button>
			</Paper>
			<FormMain open={openForm} onClose={() => setOpenForm(false)} onSubmitUser={handleSubmitUser} />
		</>
	)
}

export default UserManagementSearchForm
