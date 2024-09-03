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
import { BreedType, DetailType, InsuredType, LossType, PublicType, RiskType } from '@/enum'
import { useTranslation } from 'react-i18next'
import useSearchPlotMonitoring from './context'
import { useRouter } from 'next/navigation'
import { AppPath } from '@/config/app'
import classNames from 'classnames'
import { color } from 'html2canvas/dist/types/css/types/color'
import { CheckBoxOutlined } from '@mui/icons-material'

const defaultRiskType: { [key: string]: boolean } = {
	high: false,
	medium: false,
	low: false,
}

interface PlotMonitoringFilterProps {
	isFullList: boolean
}

const PlotMonitoringFilter: React.FC<PlotMonitoringFilterProps> = ({ isFullList }) => {
	const { queryParams, setQueryParams } = useSearchPlotMonitoring()
	const { t, i18n } = useTranslation(['default', 'field-loss'])

	const [inputActivityId, setInputActivityId] = useState<string>('')
	const activityIdRef = useRef<HTMLInputElement>(null)
	const [riskType, setRiskType] = React.useState<{ [key: string]: boolean }>(defaultRiskType)

	const handleChangeActivityIdInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value
		const numericValue = inputValue.replace(/[^0-9]/g, '')
		setInputActivityId(numericValue)
	}

	const handleSubmitActivityId = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		//console.log('Form Submit!!!')
		setQueryParams({ ...queryParams, activityId: parseInt(inputActivityId) })
		if (activityIdRef.current) {
			activityIdRef.current.blur()
		}
	}

	const handleLossTypeClick = (_event: React.MouseEvent<HTMLElement>, lossType: LossType | null) => {
		//console.log('lossType', lossType)
		setQueryParams({
			...queryParams,
			lossType: lossType,
		})
	}

	const handlePublicStatusClick = (_event: React.MouseEvent<HTMLElement>, publicStatus: PublicType | null) => {
		setQueryParams({
			...queryParams,
			publicStatus: publicStatus,
		})
	}

	const handleRiceTypeClick = (_event: React.MouseEvent<HTMLElement>, riceType: DetailType | null) => {
		setQueryParams({
			...queryParams,
			riceType: riceType,
		})
	}

	const handleDetailTypeClick = (_event: React.MouseEvent<HTMLElement>, detailType: BreedType | null) => {
		setQueryParams({
			...queryParams,
			detailType: detailType,
		})
	}

	const handleInsuredTypeClick = (_event: React.MouseEvent<HTMLElement>, insuredType: InsuredType | null) => {
		setQueryParams({
			...queryParams,
			insuredType: insuredType,
		})
	}

	const handleRiskTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRiskType({
			...riskType,
			[event.target.name]: event.target.checked,
		})
		const riskTypes: RiskType[] = queryParams.riskType || []
		if (event.target.checked) {
			riskTypes.push(event.target.name as RiskType)
			setQueryParams({ ...queryParams, riskType: riskTypes })
		} else {
			const filteredRiskTypes = riskTypes.filter((item) => item !== event.target.name)
			setQueryParams({ ...queryParams, riskType: filteredRiskTypes })
		}
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
					value={queryParams.publicStatus}
					exclusive
					onChange={handlePublicStatusClick}
					aria-label='loss-type'
					className='flex flex-wrap gap-2 max-lg:py-3 [&_*]:m-0 [&_*]:rounded [&_*]:border-none [&_*]:px-3 [&_*]:py-1.5 lg:[&_*]:rounded-lg'
				>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': typeof queryParams.publicStatus !== 'number',
							'text-gray-dark2': typeof queryParams.publicStatus === 'number',
						})}
						value={''}
					>
						{'ทั้งหมด'}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': queryParams.publicStatus === PublicType.NoPublic,
							'text-gray-dark2': queryParams.publicStatus !== PublicType.NoPublic,
						})}
						value={PublicType.NoPublic}
					>
						{'ยังไม่ประชาคม'}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': queryParams.publicStatus === PublicType.Public,
							'text-gray-dark2': queryParams.publicStatus !== PublicType.Public,
						})}
						value={PublicType.Public}
					>
						{'ประชาคมแล้ว'}
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>
			<Box className='flex flex-col gap-3 border-0 border-b border-solid border-gray py-4'>
				<Typography className='text-sm font-medium text-black-dark'>ประเภทของพันธุ์ข้าว</Typography>
				<ToggleButtonGroup
					value={queryParams.riceType}
					exclusive
					onChange={handleRiceTypeClick}
					aria-label='loss-type'
					className='flex flex-wrap gap-2 max-lg:py-3 [&_*]:m-0 [&_*]:rounded [&_*]:border-none [&_*]:px-3 [&_*]:py-1.5 lg:[&_*]:rounded-lg'
				>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': !queryParams.riceType,
							'text-gray-dark2': !!queryParams.riceType,
						})}
						value={''}
					>
						{'ทั้งหมด'}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white':
								queryParams.riceType === DetailType.PhotoperiodSensitiveRice,
							'text-gray-dark2': queryParams.riceType !== DetailType.PhotoperiodSensitiveRice,
						})}
						value={DetailType.PhotoperiodSensitiveRice}
					>
						{'ข้าวไวแสง'}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white':
								queryParams.riceType === DetailType.NonPhotoperiodSensitiveRice,
							'text-gray-dark2': queryParams.riceType !== DetailType.NonPhotoperiodSensitiveRice,
						})}
						value={DetailType.NonPhotoperiodSensitiveRice}
					>
						{'ข้าวไม่ไวแสง'}
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>
			<Box className='flex flex-col gap-3 border-0 border-b border-solid border-gray py-4'>
				<Typography className='text-sm font-medium text-black-dark'>ชนิดของพันธุ์ข้าว</Typography>
				<ToggleButtonGroup
					value={queryParams.detailType}
					exclusive
					onChange={handleDetailTypeClick}
					aria-label='loss-type'
					className='flex flex-wrap gap-2 max-lg:py-3 [&_*]:m-0 [&_*]:rounded [&_*]:border-none [&_*]:px-3 [&_*]:py-1.5 lg:[&_*]:rounded-lg'
				>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': !queryParams.detailType,
							'text-gray-dark2': !!queryParams.detailType,
						})}
						value={''}
					>
						{'ทั้งหมด'}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': queryParams.detailType === BreedType.JasmineRice,
							'text-gray-dark2': queryParams.detailType !== BreedType.JasmineRice,
						})}
						value={BreedType.JasmineRice}
					>
						{'ข้าวเจ้า'}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': queryParams.detailType === BreedType.GlutinousRice,
							'text-gray-dark2': queryParams.detailType !== BreedType.GlutinousRice,
						})}
						value={BreedType.GlutinousRice}
					>
						{'ข้าวเหนียว'}
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>
			<Box className='flex flex-col gap-3 border-0 border-b border-solid border-gray py-4'>
				<Typography className='text-sm font-medium text-black-dark'>ประกันภัย</Typography>
				<ToggleButtonGroup
					value={queryParams.insuredType}
					exclusive
					onChange={handleInsuredTypeClick}
					aria-label='loss-type'
					className='flex flex-wrap gap-2 max-lg:py-3 [&_*]:m-0 [&_*]:rounded [&_*]:border-none [&_*]:px-3 [&_*]:py-1.5 lg:[&_*]:rounded-lg'
				>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': typeof queryParams.insuredType !== 'number',
							'text-gray-dark2': typeof queryParams.insuredType === 'number',
						})}
						value={''}
					>
						{'ทั้งหมด'}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white':
								queryParams.insuredType === InsuredType.BasicInsurance,
							'text-gray-dark2': queryParams.insuredType !== InsuredType.BasicInsurance,
						})}
						value={InsuredType.BasicInsurance}
					>
						{'ประกันภัยพื้นฐาน (Tier 1)'}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white':
								queryParams.insuredType === InsuredType.VoluntaryInsurance,
							'text-gray-dark2': queryParams.insuredType !== InsuredType.VoluntaryInsurance,
						})}
						value={InsuredType.VoluntaryInsurance}
					>
						{'ประกันภัยโดยสมัครใจ (Tier 2)'}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-base', {
							'bg-primary font-semibold text-white': queryParams.insuredType === InsuredType.NoInsurance,
							'text-gray-dark2': queryParams.insuredType !== InsuredType.NoInsurance,
						})}
						value={InsuredType.NoInsurance}
					>
						{'ไม่มีประกันภัย'}
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
									checked={riskType.high}
									onChange={handleRiskTypeChange}
									name={RiskType.High}
								/>
							}
							label='ความเสี่ยงสูง'
							className='m-0 flex items-center gap-2 p-2 [&_.MuiButtonBase-root>svg]:h-[18px] [&_.MuiButtonBase-root>svg]:w-[18px] [&_.MuiButtonBase-root>svg]:!bg-white [&_.MuiButtonBase-root]:p-0 [&_.MuiTypography-root]:text-base [&_.MuiTypography-root]:font-medium [&_.MuiTypography-root]:text-black'
						/>
						<FormControlLabel
							control={
								<Checkbox
									checkedIcon={<CheckBoxOutlined />}
									checked={riskType.medium}
									onChange={handleRiskTypeChange}
									name={RiskType.Medium}
								/>
							}
							label='ความเสี่ยงกลาง'
							className='m-0 flex items-center gap-2 p-2 [&_.MuiButtonBase-root>svg]:h-[18px] [&_.MuiButtonBase-root>svg]:w-[18px] [&_.MuiButtonBase-root]:p-0 [&_.MuiTypography-root]:text-base [&_.MuiTypography-root]:font-medium [&_.MuiTypography-root]:text-black'
						/>
						<FormControlLabel
							control={
								<Checkbox
									checkedIcon={<CheckBoxOutlined />}
									checked={riskType.low}
									onChange={handleRiskTypeChange}
									name={RiskType.Low}
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
