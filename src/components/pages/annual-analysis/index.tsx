import service from '@/api'
import { Button } from '@mui/material'

const AnnualAnalysisMain = async () => {
	try {
		const data = await service.example.getVersion()
		console.log('data:', data)
	} catch (error) {
		console.log(error)
	}
	return (
		<>
			<div>AnnualAnalysisMain</div>
			<Button variant='contained'>Contained</Button>
			<Button variant='outlined'>Outlined</Button>
		</>
	)
}

export default AnnualAnalysisMain
