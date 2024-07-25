'use client'

import { Button, FormControl, Input, InputAdornment, Paper } from '@mui/material'
import { FormMain } from '../Form'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import React, { FormEvent, useState } from 'react'

const UserManagementSearchForm = () => {
	const [openForm, setOpenForm] = useState<boolean>(false)

	const handleSubmitUser = async (event: FormEvent) => {
		console.log('Form submitted')
		// Add your form submission logic here
	}

	return (
		<>
			<Paper className='flex gap-[6px] bg-[#D9E0EB] p-[6px]'>
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
						disableUnderline={true}
					/>
				</FormControl>
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
