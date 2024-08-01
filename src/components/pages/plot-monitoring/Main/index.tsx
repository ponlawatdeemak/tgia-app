'use client'

import MapView from '@/components/common/map/MapView'
import { Paper } from '@mui/material'
import PlotMonitoringSearchForm from './PlotMonitoringSearchForm'
import PlotMonitoringFilter from './PlotMonitoringFilter'
import PlotMonitoringList from './PlotMonitoringList'

export const FieldLossMain = () => {
	return (
		<div className='flex flex-grow flex-col gap-y-[16px]'>
			<PlotMonitoringSearchForm></PlotMonitoringSearchForm>
			<PlotMonitoringFilter></PlotMonitoringFilter>
			<PlotMonitoringList></PlotMonitoringList>
		</div>
	)
}
