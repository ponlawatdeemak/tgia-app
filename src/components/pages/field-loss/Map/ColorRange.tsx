import { Box, Paper, Typography } from '@mui/material'
import React from 'react'

interface ColorRangeProps {
	startColor: string
	endColor: string
}

const ColorRange: React.FC<ColorRangeProps> = ({ startColor, endColor }) => {
	return (
		<Paper className='flex flex-col gap-1 bg-white px-2 py-1.5'>
			<Typography className='text-xs font-medium text-black-dark'>
				พื้นที่เสียหายภัยแล้งจากการวิเคราะห์
			</Typography>
			<Box
				className='h-1.5 bg-primary'
				sx={{
					backgroundImage: `linear-gradient(to right, ${startColor} , ${endColor})`,
				}}
			></Box>
			<Box className='flex justify-between'>
				<span className='text-xs font-medium text-black-dark'>0%</span>
				<span className='text-xs font-medium text-black-dark'>100%</span>
			</Box>
		</Paper>
	)
}

export default ColorRange
