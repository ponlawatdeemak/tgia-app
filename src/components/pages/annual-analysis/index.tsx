import service from '@/api'
import DatePickerHorizontal from '@/components/shared/DatePickerHorizontal'
import { Button } from '@mui/material'
import { addDays, addYears } from 'date-fns'

const AnnualAnalysisMain = async () => {
	// try {
	// 	const data = await service.example.getVersion()
	// } catch (error) {
	// 	// console.log(error)
	// }
	return (
		<>
			{/* <div>AnnualAnalysisMain</div>
			<Button variant='contained'>Contained</Button>
			<Button variant='outlined'>Outlined</Button> */}
			<div className='flex justify-center'>
				<div className='w-[800px]'>
					<DatePickerHorizontal startDate={new Date()} endDate={addDays(new Date(), 36)} />
				</div>
			</div>
		</>
	)
}

export default AnnualAnalysisMain
