'use client'

import {
	Box,
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
	OutlinedInput,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from '@mui/material'
import React, { useRef, useState } from 'react'
import clsx from 'clsx'
import { LossType } from '@/enum'
import { useTranslation } from 'react-i18next'
import useSearchPlotMonitoring from './context'
import { useRouter } from 'next/navigation'
import { AppPath } from '@/config/app'
import classNames from 'classnames'
import { color } from 'html2canvas/dist/types/css/types/color'
import { CheckBoxOutlined } from '@mui/icons-material'

interface PlotMonitoringFilterProps {
	isFullList: boolean
}

const PlotMonitoringFilter: React.FC<PlotMonitoringFilterProps> = ({ isFullList }) => {
	const { queryParams, setQueryParams } = useSearchPlotMonitoring()
	const { t, i18n } = useTranslation(['default', 'field-loss'])

	const [inputActivityId, setInputActivityId] = useState<string>('')
	const activityIdRef = useRef<HTMLInputElement>(null)

	const [state, setState] = React.useState({
		gilad: true,
		jason: false,
		antoine: false,
	})

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setState({
			...state,
			[event.target.name]: event.target.checked,
		})
	}

	const { gilad, jason, antoine } = state

	const handleChangeActivityIdInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value
		const numericValue = inputValue.replace(/[^0-9]/g, '')
		setInputActivityId(numericValue)
	}

	const handleSubmitActivityId = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		console.log('Form Submit!!!')
		setQueryParams({ ...queryParams, activityId: parseInt(inputActivityId) })
		if (activityIdRef.current) {
			activityIdRef.current.blur()
		}
	}

	const handleLossTypeClick = (_event: React.MouseEvent<HTMLElement>, lossType: LossType | null) => {
		console.log('lossType', lossType)
		setQueryParams({
			...queryParams,
			lossType: lossType,
		})
	}

	return (
		<div
			className={classNames(
				'box-border flex flex-col gap-0 bg-gray-light p-0 lg:w-[30%] lg:min-w-[360px] lg:max-w-[580px] lg:overflow-auto lg:bg-gray-light2 lg:p-6',
				{
					'lg:hidden': isFullList,
				},
			)}
		>
			<Box className='flex flex-col gap-1'>
				<Typography className='text-sm font-medium text-black'>รหัสอ้างอิง (Activity ID)</Typography>
				<form noValidate onSubmit={handleSubmitActivityId} autoComplete='off'>
					<FormControl className='[&_.Mui-focused>fieldset]:border-primary' fullWidth variant='outlined'>
						<OutlinedInput
							className={classNames(
								'text-md font-normal text-[#7A7A7A] [&_fieldset]:rounded-lg [&_fieldset]:border-gray [&_input]:px-3 [&_input]:py-2',
								{
									'!font-medium !text-black': !!inputActivityId,
								},
							)}
							id='activityId'
							value={inputActivityId}
							onChange={handleChangeActivityIdInput}
							inputRef={activityIdRef}
							placeholder='รหัสอ้างอิง'
						/>
					</FormControl>
				</form>
			</Box>
			<Box className='flex flex-col gap-2 border-0 border-b border-solid border-gray py-4'>
				<Typography className='text-sm font-medium text-black-dark'>ประเภทภัยพิบัติ</Typography>
				<ToggleButtonGroup
					value={queryParams.lossType}
					exclusive
					onChange={handleLossTypeClick}
					aria-label='loss-type'
					className='flex flex-wrap gap-2 max-lg:py-3 [&_*]:m-0 [&_*]:rounded [&_*]:border-none [&_*]:px-3 [&_*]:py-1.5 lg:[&_*]:rounded-lg'
				>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': typeof queryParams.lossType !== 'number',
							'text-gray-dark2': typeof queryParams.lossType === 'number',
						})}
						value={''}
					>
						{t('allDisasters')}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': queryParams.lossType === LossType.Drought,
							'text-gray-dark2': queryParams.lossType !== LossType.Drought,
						})}
						value={LossType.Drought}
					>
						{t('drought')}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': queryParams.lossType === LossType.Flood,
							'text-gray-dark2': queryParams.lossType !== LossType.Flood,
						})}
						value={LossType.Flood}
					>
						{t('flood')}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': queryParams.lossType === LossType.NoData,
							'text-gray-dark2': queryParams.lossType !== LossType.NoData,
						})}
						value={LossType.NoData}
					>
						ไม่มีภัยพิบัติ
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>
			<Box className='flex flex-col gap-3 border-0 border-b border-solid border-gray py-4'>
				<Typography className='text-sm font-medium text-black-dark'>สถานะประชาคม</Typography>
				<ToggleButtonGroup
					value={queryParams.lossType}
					exclusive
					//onChange={handleLossTypeClick}
					aria-label='loss-type'
					className='flex gap-2 max-lg:py-3 [&_*]:m-0 [&_*]:rounded [&_*]:border-none [&_*]:px-3 [&_*]:py-1.5 lg:[&_*]:rounded-lg'
				>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': Boolean(queryParams.lossType) === false,
							'text-gray-dark2': Boolean(queryParams.lossType) !== false,
						})}
						value={''}
					>
						{t('allDisasters')}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': queryParams.lossType === LossType.Drought,
							'text-gray-dark2': queryParams.lossType !== LossType.Drought,
						})}
						value={LossType.Drought}
					>
						{t('drought')}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': queryParams.lossType === LossType.Flood,
							'text-gray-dark2': queryParams.lossType !== LossType.Flood,
						})}
						value={LossType.Flood}
					>
						{t('flood')}
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>
			<Box className='flex flex-col gap-3 border-0 border-b border-solid border-gray py-4'>
				<Typography className='text-sm font-medium text-black-dark'>ประเภทของพันธุ์ข้าว</Typography>
				<ToggleButtonGroup
					value={queryParams.lossType}
					exclusive
					//onChange={handleLossTypeClick}
					aria-label='loss-type'
					className='flex gap-2 max-lg:py-3 [&_*]:m-0 [&_*]:rounded [&_*]:border-none [&_*]:px-3 [&_*]:py-1.5 lg:[&_*]:rounded-lg'
				>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': Boolean(queryParams.lossType) === false,
							'text-gray-dark2': Boolean(queryParams.lossType) !== false,
						})}
						value={''}
					>
						{t('allDisasters')}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': queryParams.lossType === LossType.Drought,
							'text-gray-dark2': queryParams.lossType !== LossType.Drought,
						})}
						value={LossType.Drought}
					>
						{t('drought')}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': queryParams.lossType === LossType.Flood,
							'text-gray-dark2': queryParams.lossType !== LossType.Flood,
						})}
						value={LossType.Flood}
					>
						{t('flood')}
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>
			<Box className='flex flex-col gap-3 border-0 border-b border-solid border-gray py-4'>
				<Typography className='text-sm font-medium text-black-dark'>ชนิดของพันธุ์ข้าว</Typography>
				<ToggleButtonGroup
					value={queryParams.lossType}
					exclusive
					//onChange={handleLossTypeClick}
					aria-label='loss-type'
					className='flex gap-2 max-lg:py-3 [&_*]:m-0 [&_*]:rounded [&_*]:border-none [&_*]:px-3 [&_*]:py-1.5 lg:[&_*]:rounded-lg'
				>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': Boolean(queryParams.lossType) === false,
							'text-gray-dark2': Boolean(queryParams.lossType) !== false,
						})}
						value={''}
					>
						{t('allDisasters')}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': queryParams.lossType === LossType.Drought,
							'text-gray-dark2': queryParams.lossType !== LossType.Drought,
						})}
						value={LossType.Drought}
					>
						{t('drought')}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': queryParams.lossType === LossType.Flood,
							'text-gray-dark2': queryParams.lossType !== LossType.Flood,
						})}
						value={LossType.Flood}
					>
						{t('flood')}
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>
			<Box className='flex flex-col gap-3 border-0 border-b border-solid border-gray py-4'>
				<Typography className='text-sm font-medium text-black-dark'>ประกันภัย</Typography>
				<ToggleButtonGroup
					value={queryParams.lossType}
					exclusive
					//onChange={handleLossTypeClick}
					aria-label='loss-type'
					className='flex gap-2 max-lg:py-3 [&_*]:m-0 [&_*]:rounded [&_*]:border-none [&_*]:px-3 [&_*]:py-1.5 lg:[&_*]:rounded-lg'
				>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': Boolean(queryParams.lossType) === false,
							'text-gray-dark2': Boolean(queryParams.lossType) !== false,
						})}
						value={''}
					>
						{t('allDisasters')}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': queryParams.lossType === LossType.Drought,
							'text-gray-dark2': queryParams.lossType !== LossType.Drought,
						})}
						value={LossType.Drought}
					>
						{t('drought')}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': queryParams.lossType === LossType.Flood,
							'text-gray-dark2': queryParams.lossType !== LossType.Flood,
						})}
						value={LossType.Flood}
					>
						{t('flood')}
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>
			<Box className='flex flex-col gap-3 py-4'>
				<Typography className='text-sm font-medium text-black-dark'>พื้นที่ความเสี่ยงภัย</Typography>
				<FormControl component='fieldset' variant='standard'>
					<FormGroup>
						<FormControlLabel
							control={
								<Checkbox
									checkedIcon={<CheckBoxOutlined />}
									checked={gilad}
									onChange={handleChange}
									name='gilad'
								/>
							}
							label='ความเสี่ยงสูง'
							className='m-0 flex items-center gap-2 p-2 [&_.MuiButtonBase-root>svg]:h-[18px] [&_.MuiButtonBase-root>svg]:w-[18px] [&_.MuiButtonBase-root>svg]:!bg-white [&_.MuiButtonBase-root]:p-0 [&_.MuiTypography-root]:text-base [&_.MuiTypography-root]:font-medium [&_.MuiTypography-root]:text-black'
						/>
						<FormControlLabel
							control={
								<Checkbox
									checkedIcon={<CheckBoxOutlined />}
									checked={jason}
									onChange={handleChange}
									name='jason'
								/>
							}
							label='ความเสี่ยงกลาง'
							className='m-0 flex items-center gap-2 p-2 [&_.MuiButtonBase-root>svg]:h-[18px] [&_.MuiButtonBase-root>svg]:w-[18px] [&_.MuiButtonBase-root]:p-0 [&_.MuiTypography-root]:text-base [&_.MuiTypography-root]:font-medium [&_.MuiTypography-root]:text-black'
						/>
						<FormControlLabel
							control={
								<Checkbox
									checkedIcon={<CheckBoxOutlined />}
									checked={antoine}
									onChange={handleChange}
									name='antoine'
								/>
							}
							label='ความเสี่ยงต่ำ'
							className='m-0 flex items-center gap-2 p-2 [&_.MuiButtonBase-root>svg]:h-[18px] [&_.MuiButtonBase-root>svg]:w-[18px] [&_.MuiButtonBase-root]:p-0 [&_.MuiTypography-root]:text-base [&_.MuiTypography-root]:font-medium [&_.MuiTypography-root]:text-black'
						/>
					</FormGroup>
				</FormControl>
			</Box>
		</div>
	)
}

export default PlotMonitoringFilter
