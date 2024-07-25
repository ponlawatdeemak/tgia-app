import { Button, FormControl, Input, InputAdornment, Paper } from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import React from 'react'

const UserManagementSearchForm = () => {
	return (
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
	)
}

export default UserManagementSearchForm
