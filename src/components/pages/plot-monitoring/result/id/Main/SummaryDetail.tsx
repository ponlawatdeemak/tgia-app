import { Box } from '@mui/material'
import React from 'react'
import PlantDetail from '../Detail/PlantDetail'
import LossDetail from '../Detail/LossDetail'

interface SummaryDetailProps {
	activityId: string | undefined
}

const SummaryDetail: React.FC<SummaryDetailProps> = ({ activityId }) => {
	return (
		<div className='box-border flex flex-col gap-0 bg-gray-light p-0 lg:w-[30%] lg:min-w-[360px] lg:max-w-[580px] lg:gap-4 lg:overflow-auto lg:bg-gray-light2 lg:px-6 lg:py-4'>
			<Box className='flex h-full flex-col'>
				<div className='h-[40%]'>{`Detail: ${activityId}`}</div>
				<div className='h-[60%]'>
					<PlantDetail />
					<LossDetail />
				</div>
			</Box>
		</div>
	)
}

export default SummaryDetail
