import { Box, Typography } from '@mui/material'
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined'
import React from 'react'

const FieldLossCard = () => {
	return (
		<Box className='flex flex-col gap-[4px] rounded-lg border-[1px] border-solid border-gray p-[8px]'>
			<Box className='flex items-center justify-between'>
				<div className='flex items-center gap-[4px]'>
					<WbSunnyOutlinedIcon className='h-[20px] w-[20px] font-light text-[#FC8E59]' />
					<div className='flex items-baseline gap-[4px]'>
						<span className='leading-[20px] text-black'>ภัยแล้ง</span>
						<span className='font-semibold leading-[16px] text-[#9F1853]'>12.5%</span>
					</div>
				</div>
				<div className='flex items-baseline gap-[4px]'>
					<span className='font-semibold leading-[16px] text-[#9F1853]'>150,000</span>
					<span className='font-normal leading-[20px] text-black'>ไร่</span>
				</div>
			</Box>
			<Box className='flex items-center justify-between'>
				<span className='font-normal leading-[20px] text-black'>พื้นที่ขึ้นทะเบียนที่มีขอบแปลง</span>
				<div className='flex items-baseline gap-[4px]'>
					<span className='font-semibold leading-[16px] text-[#575757]'>1,200,000</span>
					<span className='font-normal leading-[20px] text-black'>ไร่</span>
				</div>
			</Box>
		</Box>
	)
}

export default FieldLossCard
