import React from 'react'
import bb, { bar, line } from 'billboard.js'
import 'billboard.js/dist/billboard.css'
import BillboardJS from '@billboard.js/react'

export default function App() {
	const options = {
		data: {
			columns: [
				['data1', 30, 200, 100, 400, 150, 250],
				['data2', 50, 20, 10, 40, 15, 25],
			],
			type: line(),
		},
	}
	const options2 = {
		data: {
			columns: [
				['data1', 30, 200, 100, 400, 150, 250],
				['data2', 130, 100, 140, 200, 150, 50],
			],
			type: bar(), // for ESM specify as: bar()
		},
		bar: {
			width: {
				ratio: 0.5,
			},
		},
	}
	return (
		<>
			<BillboardJS bb={bb} options={options} className={'bb'} />
			<BillboardJS bb={bb} options={options2} className={'bb'} />
		</>
	)
}
