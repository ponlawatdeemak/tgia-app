import { Button } from '@mui/material'
import PlotMonitoringSearchMain from './Search/PlotMonitoringSearchMain'

const PlotMonitoringMain = () => {
	return (
		<>
			<div>PlotMonitoringMain</div>

			<PlotMonitoringSearchMain></PlotMonitoringSearchMain>
			<Button variant='contained'>Contained</Button>
			<Button variant='outlined'>Outlined</Button>
		</>
	)
}

export default PlotMonitoringMain
