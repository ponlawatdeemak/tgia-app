import { Box, Paper, Typography } from '@mui/material'
import React from 'react'

const CardDetail = () => {
	return (
		<div className='flex justify-center gap-4 bg-white py-4'>
			<Paper className='w-[204px] bg-gray-light3'></Paper>
			<Box className='flex flex-col gap-2'>
				<div className='flex items-center justify-between'>
					<Typography className='text-md font-semibold text-black-dark'>1453664775</Typography>
					<span className='text-sm font-semibold text-black'>ภัยแล้ง ครั้งที่ 1</span>
				</div>
				<div className='flex flex-col gap-1'>
					<Box className='flex items-center gap-1'>
						<span className='text-sm font-normal text-black'>ปีชุดข้อมูล :</span>
						<span className='text-sm font-semibold text-black'>2567</span>
					</Box>
					<Box className='flex items-center gap-1'>
						<span className='text-sm font-normal text-black'>ที่ตั้ง:</span>
						<span className='text-sm font-semibold text-black'>หมู่ 5 มิตรภาพ,สีคิ้ว, นครราชสีมา</span>
					</Box>
					<Box className='flex items-center gap-1'>
						<span className='text-sm font-normal text-black'>สถานะประชาคม:</span>
						<span className='text-sm font-semibold text-black'>ประชาคมแล้ว</span>
					</Box>
					<Box className='flex items-center gap-1'>
						<span className='text-sm font-normal text-black'>ประเภทของพันธุ์ข้าว</span>
						<span className='text-sm font-semibold text-black'>ข้าวไม่ไวแสง</span>
					</Box>
					<Box className='flex items-center gap-1'>
						<span className='text-sm font-normal text-black'>ชนิดของพันธุ์ข้าว</span>
						<span className='text-sm font-semibold text-black'>ข้าวเหนียว</span>
					</Box>
					<Box className='flex items-center gap-1'>
						<span className='text-sm font-normal text-black'>ประกันภัย</span>
						<span className='text-sm font-semibold text-black'>ประกันภัยพื้นฐาน (Tier 1)</span>
					</Box>
					<Box className='flex items-center gap-1'>
						<span className='text-sm font-normal text-black'>พื้นที่ความเสี่ยงภัย</span>
						<span className='text-sm font-semibold text-black'>ต่ำ</span>
					</Box>
				</div>
				<div className='flex gap-2'>
					<Box className='flex w-40 items-center justify-between rounded-lg bg-gray-light3 px-2 py-1'>
						<div className='flex items-center gap-1'>
							<span className='text-base font-medium text-black'>ปลูกข้าวได้</span>
							<span className='text-base font-semibold text-secondary'>75%</span>
						</div>
						<div className='flex items-center gap-1'>
							<span className='text-base font-semibold text-secondary'>9</span>
							<span className='text-base font-normal text-black'>ไร่</span>
						</div>
					</Box>
					<Box className='flex w-[148px] items-center justify-between rounded-lg bg-gray-light3 px-2 py-1'>
						<div className='flex items-center gap-1'>
							<span className='text-base font-medium text-black'>ภัยแล้ง</span>
							<span className='text-base font-semibold text-secondary'>25%</span>
						</div>
						<div className='flex items-center gap-1'>
							<span className='text-base font-semibold text-secondary'>3</span>
							<span className='text-base font-normal text-black'>ไร่</span>
						</div>
					</Box>
				</div>
			</Box>
		</div>
	)
}

export default CardDetail
