import { GetSummaryAreaDtoOut } from '@/api/field-loss/dto-out.dto'
import { Box, Paper, Typography } from '@mui/material'
import React, { CSSProperties } from 'react'

type HoverInfo = {
	x: number
	y: number
	province: GetSummaryAreaDtoOut | null
}

interface TooltipProps {
	info: HoverInfo | null
}

const Tooltip: React.FC<TooltipProps> = ({ info }) => {
	if (!info || !info.province) {
		return null
	}

	return (
		<Paper className='absolute z-10 flex flex-col gap-2 bg-white p-2' style={{ left: info.x, top: info.y }}>
			<Typography className='text-base font-semibold text-black'>{info.province.name.th}</Typography>
			<Box className='flex flex-col gap-2'>
				<Typography className='text-xs font-medium text-gray-dark2'>พื้นที่เสียหายจากการวิเคราะห์</Typography>
				<Box className='flex flex-col gap-0.5'>
					<div className='flex items-baseline justify-between'>
						<span className='text-sm font-medium text-black'>ทั้งหมด</span>
						<div className='flex items-baseline gap-1'>
							<span className='text-base font-semibold text-secondary'>
								{info.province.predictedArea.areaRai.toLocaleString()}
							</span>
							<span className='text-sm font-normal text-black'>ไร่</span>
						</div>
					</div>
					<div className='flex items-baseline gap-1'>
						<span className='text-xs font-medium text-gray-dark2'>คิดเป็น</span>
						<span className='text-xs font-medium text-secondary'>
							{info.province.predictedArea.percent + '%'}
						</span>
						<span className='text-xs font-medium text-gray-dark2'>ของพื้นที่ลงทะเบียน</span>
					</div>
				</Box>
				<Box className='flex flex-col gap-0.5'>
					<div className='flex items-baseline justify-between'>
						<span className='text-sm font-medium text-black'>ทั้งหมด</span>
						<div className='flex items-baseline gap-1'>
							<span className='text-base font-semibold text-secondary'>
								{info.province.predictedArea.areaRai.toLocaleString()}
							</span>
							<span className='text-sm font-normal text-black'>ไร่</span>
						</div>
					</div>
					<div className='flex items-baseline gap-1'>
						<span className='text-xs font-medium text-gray-dark2'>คิดเป็น</span>
						<span className='text-xs font-medium text-secondary'>
							{info.province.predictedArea.percent + '%'}
						</span>
						<span className='text-xs font-medium text-gray-dark2'>ของพื้นที่ลงทะเบียน</span>
					</div>
				</Box>
				<Box className='flex flex-col gap-0.5'>
					<div className='flex items-baseline justify-between'>
						<span className='text-sm font-medium text-black'>ทั้งหมด</span>
						<div className='flex items-baseline gap-1'>
							<span className='text-base font-semibold text-secondary'>
								{info.province.predictedArea.areaRai.toLocaleString()}
							</span>
							<span className='text-sm font-normal text-black'>ไร่</span>
						</div>
					</div>
					<div className='flex items-baseline gap-1'>
						<span className='text-xs font-medium text-gray-dark2'>คิดเป็น</span>
						<span className='text-xs font-medium text-secondary'>
							{info.province.predictedArea.percent + '%'}
						</span>
						<span className='text-xs font-medium text-gray-dark2'>ของพื้นที่ลงทะเบียน</span>
					</div>
				</Box>
			</Box>
		</Paper>
	)
}

export default Tooltip
