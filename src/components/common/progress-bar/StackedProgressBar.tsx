'use client'

export interface StackedProgressBarData {
	label: string
	percent: number
	color: string
}

export interface StackedProgressBarProps {
	data: StackedProgressBarData[]
}

const StackedProgressBar: React.FC<StackedProgressBarProps> = ({ data }) => {
	return (
		<div>
			<div className='h-4' style={{}}>
				{/* <div style={{ borderTop: '2px dotted #D6D6D6' }}></div> */}
				{data.map((item, index) => {
					return (
						<div
							key={index}
							className={`float-left bg-[${item.color}] mr-0.5 h-full`}
							style={{
								width: `${item.percent}%`,
								backgroundColor: `${item.color}`,
								// position: 'relative',
								// bottom: '14px',
							}}
						></div>
					)
				})}
			</div>
		</div>
	)
}

export default StackedProgressBar