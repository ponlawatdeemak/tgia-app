'use client'

import { CheckBoxOutlined } from '@mui/icons-material'
import {
	Box,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from '@mui/material'
import React, { useCallback } from 'react'
import useSearchPlotMonitoring from '../Main/context'
import { useTranslation } from 'react-i18next'
import { BreedType, DetailType, InsuredType, LossType, PublicType, RiskType } from '@/enum'
import clsx from 'clsx'

const FilterButtonMain = () => {
	const { queryParams, setQueryParams } = useSearchPlotMonitoring()
	const { t, i18n } = useTranslation(['default', 'field-loss'])

	const handleLossTypeClick = useCallback(
		(_event: React.MouseEvent<HTMLElement>, lossType: LossType | null) => {
			setQueryParams({
				...queryParams,
				lossType: lossType,
			})
		},
		[queryParams, setQueryParams],
	)

	const handlePublicStatusClick = useCallback(
		(_event: React.MouseEvent<HTMLElement>, publicStatus: PublicType | null) => {
			setQueryParams({
				...queryParams,
				publicStatus: publicStatus,
			})
		},
		[queryParams, setQueryParams],
	)

	const handleRiceTypeClick = useCallback(
		(_event: React.MouseEvent<HTMLElement>, riceType: DetailType | null) => {
			setQueryParams({
				...queryParams,
				riceType: riceType,
			})
		},
		[queryParams, setQueryParams],
	)

	const handleDetailTypeClick = useCallback(
		(_event: React.MouseEvent<HTMLElement>, detailType: BreedType | null) => {
			setQueryParams({
				...queryParams,
				detailType: detailType,
			})
		},
		[queryParams, setQueryParams],
	)

	const handleInsuredTypeClick = useCallback(
		(_event: React.MouseEvent<HTMLElement>, insuredType: InsuredType | null) => {
			setQueryParams({
				...queryParams,
				insuredType: insuredType,
			})
		},
		[queryParams, setQueryParams],
	)

	const handleRiskTypeClick = useCallback(
		(_event: React.MouseEvent<HTMLElement>, riskType: RiskType | null) => {
			if (!riskType) {
				setQueryParams({ ...queryParams, riskType: [RiskType.High, RiskType.Medium, RiskType.Low] })
			} else {
				setQueryParams({ ...queryParams, riskType: [riskType] })
			}
		},
		[queryParams, setQueryParams],
	)

	const handleRiskTypeChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const riskTypes: RiskType[] = queryParams.riskType || []
			if (event.target.checked) {
				riskTypes.push(event.target.name as RiskType)
				setQueryParams({ ...queryParams, riskType: riskTypes })
			} else {
				const filteredRiskTypes = riskTypes.filter((item) => item !== event.target.name)
				setQueryParams({ ...queryParams, riskType: filteredRiskTypes })
			}
		},
		[queryParams, setQueryParams],
	)

	return (
		<Box className='flex flex-col gap-0'>
			<Box className='flex flex-col gap-2 border-0 border-b border-solid border-gray py-3 lg:py-4'>
				<Typography className='text-xs font-medium text-black-dark lg:text-sm'>ประเภทภัยพิบัติ</Typography>
				<ToggleButtonGroup
					value={queryParams.lossType}
					exclusive
					onChange={handleLossTypeClick}
					aria-label='loss-type'
					className='flex flex-wrap gap-2 [&_*]:m-0 [&_*]:rounded [&_*]:border-none [&_*]:px-3 [&_*]:py-1.5 lg:[&_*]:rounded-lg'
				>
					<ToggleButton
						className={clsx('text-sm lg:text-base', {
							'bg-primary font-semibold text-white': typeof queryParams.lossType !== 'number',
							'text-gray-dark2 max-lg:!border max-lg:!border-solid max-lg:!border-gray':
								typeof queryParams.lossType === 'number',
						})}
						value={''}
					>
						{t('allDisasters')}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-sm lg:text-base', {
							'bg-primary font-semibold text-white': queryParams.lossType === LossType.Drought,
							'text-gray-dark2 max-lg:!border max-lg:!border-solid max-lg:!border-gray':
								queryParams.lossType !== LossType.Drought,
						})}
						value={LossType.Drought}
					>
						{t('drought')}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-sm lg:text-base', {
							'bg-primary font-semibold text-white': queryParams.lossType === LossType.Flood,
							'text-gray-dark2 max-lg:!border max-lg:!border-solid max-lg:!border-gray':
								queryParams.lossType !== LossType.Flood,
						})}
						value={LossType.Flood}
					>
						{t('flood')}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-sm lg:text-base', {
							'bg-primary font-semibold text-white': queryParams.lossType === LossType.NoData,
							'text-gray-dark2 max-lg:!border max-lg:!border-solid max-lg:!border-gray':
								queryParams.lossType !== LossType.NoData,
						})}
						value={LossType.NoData}
					>
						ไม่มีภัยพิบัติ
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>
			<Box className='flex flex-col gap-3 border-0 border-b border-solid border-gray py-3 lg:py-4'>
				<Typography className='text-xs font-medium text-black-dark lg:text-sm'>สถานะประชาคม</Typography>
				<ToggleButtonGroup
					value={queryParams.publicStatus}
					exclusive
					onChange={handlePublicStatusClick}
					aria-label='public-status'
					className='flex flex-wrap gap-2 [&_*]:m-0 [&_*]:rounded [&_*]:border-none [&_*]:px-3 [&_*]:py-1.5 lg:[&_*]:rounded-lg'
				>
					<ToggleButton
						className={clsx('text-sm lg:text-base', {
							'bg-primary font-semibold text-white': typeof queryParams.publicStatus !== 'number',
							'text-gray-dark2 max-lg:!border max-lg:!border-solid max-lg:!border-gray':
								typeof queryParams.publicStatus === 'number',
						})}
						value={''}
					>
						{'ทั้งหมด'}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-sm lg:text-base', {
							'bg-primary font-semibold text-white': queryParams.publicStatus === PublicType.NoPublic,
							'text-gray-dark2 max-lg:!border max-lg:!border-solid max-lg:!border-gray':
								queryParams.publicStatus !== PublicType.NoPublic,
						})}
						value={PublicType.NoPublic}
					>
						{'ยังไม่ประชาคม'}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-sm lg:text-base', {
							'bg-primary font-semibold text-white': queryParams.publicStatus === PublicType.Public,
							'text-gray-dark2 max-lg:!border max-lg:!border-solid max-lg:!border-gray':
								queryParams.publicStatus !== PublicType.Public,
						})}
						value={PublicType.Public}
					>
						{'ประชาคมแล้ว'}
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>
			<Box className='flex flex-col gap-3 border-0 border-b border-solid border-gray py-3 lg:py-4'>
				<Typography className='text-xs font-medium text-black-dark lg:text-sm'>ประเภทของพันธุ์ข้าว</Typography>
				<ToggleButtonGroup
					value={queryParams.riceType}
					exclusive
					onChange={handleRiceTypeClick}
					aria-label='rice-type'
					className='flex flex-wrap gap-2 [&_*]:m-0 [&_*]:rounded [&_*]:border-none [&_*]:px-3 [&_*]:py-1.5 lg:[&_*]:rounded-lg'
				>
					<ToggleButton
						className={clsx('text-sm lg:text-base', {
							'bg-primary font-semibold text-white': !queryParams.riceType,
							'text-gray-dark2 max-lg:!border max-lg:!border-solid max-lg:!border-gray':
								!!queryParams.riceType,
						})}
						value={''}
					>
						{'ทั้งหมด'}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-sm lg:text-base', {
							'bg-primary font-semibold text-white':
								queryParams.riceType === DetailType.PhotoperiodSensitiveRice,
							'text-gray-dark2 max-lg:!border max-lg:!border-solid max-lg:!border-gray':
								queryParams.riceType !== DetailType.PhotoperiodSensitiveRice,
						})}
						value={DetailType.PhotoperiodSensitiveRice}
					>
						{'ข้าวไวแสง'}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-sm lg:text-base', {
							'bg-primary font-semibold text-white':
								queryParams.riceType === DetailType.NonPhotoperiodSensitiveRice,
							'text-gray-dark2 max-lg:!border max-lg:!border-solid max-lg:!border-gray':
								queryParams.riceType !== DetailType.NonPhotoperiodSensitiveRice,
						})}
						value={DetailType.NonPhotoperiodSensitiveRice}
					>
						{'ข้าวไม่ไวแสง'}
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>
			<Box className='flex flex-col gap-3 border-0 border-b border-solid border-gray py-3 lg:py-4'>
				<Typography className='text-xs font-medium text-black-dark lg:text-sm'>ชนิดของพันธุ์ข้าว</Typography>
				<ToggleButtonGroup
					value={queryParams.detailType}
					exclusive
					onChange={handleDetailTypeClick}
					aria-label='detail-type'
					className='flex flex-wrap gap-2 [&_*]:m-0 [&_*]:rounded [&_*]:border-none [&_*]:px-3 [&_*]:py-1.5 lg:[&_*]:rounded-lg'
				>
					<ToggleButton
						className={clsx('text-sm lg:text-base', {
							'bg-primary font-semibold text-white': !queryParams.detailType,
							'text-gray-dark2 max-lg:!border max-lg:!border-solid max-lg:!border-gray':
								!!queryParams.detailType,
						})}
						value={''}
					>
						{'ทั้งหมด'}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-sm lg:text-base', {
							'bg-primary font-semibold text-white': queryParams.detailType === BreedType.JasmineRice,
							'text-gray-dark2 max-lg:!border max-lg:!border-solid max-lg:!border-gray':
								queryParams.detailType !== BreedType.JasmineRice,
						})}
						value={BreedType.JasmineRice}
					>
						{'ข้าวเจ้า'}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-sm lg:text-base', {
							'bg-primary font-semibold text-white': queryParams.detailType === BreedType.GlutinousRice,
							'text-gray-dark2 max-lg:!border max-lg:!border-solid max-lg:!border-gray':
								queryParams.detailType !== BreedType.GlutinousRice,
						})}
						value={BreedType.GlutinousRice}
					>
						{'ข้าวเหนียว'}
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>
			<Box className='flex flex-col gap-3 border-0 border-b border-solid border-gray py-3 lg:py-4'>
				<Typography className='text-xs font-medium text-black-dark lg:text-sm'>ประกันภัย</Typography>
				<ToggleButtonGroup
					value={queryParams.insuredType}
					exclusive
					onChange={handleInsuredTypeClick}
					aria-label='insured-type'
					className='flex flex-wrap gap-2 [&_*]:m-0 [&_*]:rounded [&_*]:border-none [&_*]:px-3 [&_*]:py-1.5 lg:[&_*]:rounded-lg'
				>
					<ToggleButton
						className={clsx('text-sm lg:text-base', {
							'bg-primary font-semibold text-white': typeof queryParams.insuredType !== 'number',
							'text-gray-dark2 max-lg:!border max-lg:!border-solid max-lg:!border-gray':
								typeof queryParams.insuredType === 'number',
						})}
						value={''}
					>
						{'ทั้งหมด'}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-sm lg:text-base', {
							'bg-primary font-semibold text-white':
								queryParams.insuredType === InsuredType.BasicInsurance,
							'text-gray-dark2 max-lg:!border max-lg:!border-solid max-lg:!border-gray':
								queryParams.insuredType !== InsuredType.BasicInsurance,
						})}
						value={InsuredType.BasicInsurance}
					>
						{'ประกันภัยพื้นฐาน (Tier 1)'}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-sm lg:text-base', {
							'bg-primary font-semibold text-white':
								queryParams.insuredType === InsuredType.VoluntaryInsurance,
							'text-gray-dark2 max-lg:!border max-lg:!border-solid max-lg:!border-gray':
								queryParams.insuredType !== InsuredType.VoluntaryInsurance,
						})}
						value={InsuredType.VoluntaryInsurance}
					>
						{'ประกันภัยโดยสมัครใจ (Tier 2)'}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-sm lg:text-base', {
							'bg-primary font-semibold text-white': queryParams.insuredType === InsuredType.NoInsurance,
							'text-gray-dark2 max-lg:!border max-lg:!border-solid max-lg:!border-gray':
								queryParams.insuredType !== InsuredType.NoInsurance,
						})}
						value={InsuredType.NoInsurance}
					>
						{'ไม่มีประกันภัย'}
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>
			<Box className='flex flex-col gap-3 py-3 lg:hidden'>
				<Typography className='text-xs font-medium text-black-dark'>พื้นที่ความเสี่ยงภัย</Typography>
				<ToggleButtonGroup
					exclusive
					onChange={handleRiskTypeClick}
					aria-label='risk-type'
					className='flex flex-wrap gap-2 [&_*]:m-0 [&_*]:rounded [&_*]:border-none [&_*]:px-3 [&_*]:py-1.5'
				>
					<ToggleButton
						className={clsx('text-sm', {
							'bg-primary font-semibold text-white': queryParams.riskType?.length === 3,
							'!border !border-solid !border-gray text-gray-dark2': queryParams.riskType?.length !== 3,
						})}
						value={''}
					>
						{'ทั้งหมด'}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-sm', {
							'bg-primary font-semibold text-white':
								(queryParams.riskType?.length === 1 && queryParams.riskType?.[0]) === RiskType.High,
							'!border !border-solid !border-gray text-gray-dark2':
								(queryParams.riskType?.length === 1 && queryParams.riskType?.[0]) !== RiskType.High,
						})}
						value={RiskType.High}
					>
						{'สูง'}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-sm', {
							'bg-primary font-semibold text-white':
								(queryParams.riskType?.length === 1 && queryParams.riskType?.[0]) === RiskType.Medium,
							'!border !border-solid !border-gray text-gray-dark2':
								(queryParams.riskType?.length === 1 && queryParams.riskType?.[0]) !== RiskType.Medium,
						})}
						value={RiskType.Medium}
					>
						{'กลาง'}
					</ToggleButton>
					<ToggleButton
						className={clsx('text-sm', {
							'bg-primary font-semibold text-white':
								(queryParams.riskType?.length === 1 && queryParams.riskType?.[0]) === RiskType.Low,
							'!border !border-solid !border-gray text-gray-dark2':
								(queryParams.riskType?.length === 1 && queryParams.riskType?.[0]) !== RiskType.Low,
						})}
						value={RiskType.Low}
					>
						{'ต่ำ'}
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>
			<Box className='flex flex-col gap-3 py-3 max-lg:hidden lg:py-4'>
				<Typography className='text-xs font-medium text-black-dark lg:text-sm'>พื้นที่ความเสี่ยงภัย</Typography>
				<FormControl component='fieldset' variant='standard'>
					<FormGroup>
						<FormControlLabel
							control={
								<Checkbox
									checkedIcon={<CheckBoxOutlined />}
									checked={queryParams.riskType?.includes(RiskType.High)}
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
									checked={queryParams.riskType?.includes(RiskType.Medium)}
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
									checked={queryParams.riskType?.includes(RiskType.Low)}
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
		</Box>
	)
}

export default FilterButtonMain
