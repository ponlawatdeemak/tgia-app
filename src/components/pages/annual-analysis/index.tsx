'use client'
import service from '@/api'
import DatePickerHorizontal from '@/components/shared/DatePickerHorizontal'
import { Box, Button, Tab, Tabs } from '@mui/material'
import { addDays, addYears } from 'date-fns'
import SearchForm from '../field-loss/Main/SearchForm'
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import LossStatistic from './LossStatistic'
import PlantStatistic from './PlantStatistic'
import RiceStatistic from './RiceStatistic'

interface TabPanelProps {
	children?: React.ReactNode
	index: number
	value: number
}

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	)
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	}
}

const AnnualAnalysisMain = () => {
	const [value, setValue] = React.useState(1)

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue)
	}

	return (
		<>
			<div className='flex flex-col justify-center'>
				<SearchForm />
				<Box sx={{ paddingLeft: '24px', paddingRight: '24px' }}>
					<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
						<Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
							<Tab label='พื้นที่ขึ้นทะเบียนเกษตรกร' {...a11yProps(0)} />
							<Tab label='พื้นที่ปลูกข้าว' {...a11yProps(1)} />
							<Tab label='พื้นที่เสียหายจากภัยพิบัติ' {...a11yProps(2)} />
						</Tabs>
					</Box>
					<CustomTabPanel value={value} index={0}>
						<PlantStatistic />
					</CustomTabPanel>
					<CustomTabPanel value={value} index={1}>
						<RiceStatistic />
					</CustomTabPanel>
					<CustomTabPanel value={value} index={2}>
						<LossStatistic />
					</CustomTabPanel>
				</Box>
			</div>
		</>
	)
}

export default AnnualAnalysisMain
