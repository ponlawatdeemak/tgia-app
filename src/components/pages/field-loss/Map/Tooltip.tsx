import { GetSummaryAreaDtoOut } from '@/api/field-loss/dto-out.dto'
import { Box, IconButton, Paper, Typography } from '@mui/material'
import React from 'react'
import Icon from '@mdi/react'
import { mdiArrowRight } from '@mdi/js'
import useSearchFieldLoss from '../Main/context'
import { ResponseLanguage } from '@/api/interface'
import { useTranslation } from 'react-i18next'
import useAreaUnit from '@/store/area-unit'
import { LossType } from '@/enum'

type HoverInfo = {
	x: number
	y: number
	area: GetSummaryAreaDtoOut | null
	areaCode: number
	layerName: string
}

interface TooltipProps {
	hoverInfo: HoverInfo | null
	setHoverInfo: React.Dispatch<React.SetStateAction<HoverInfo | null>>
}

const Tooltip: React.FC<TooltipProps> = ({ hoverInfo, setHoverInfo }) => {
	const { queryParams, setQueryParams } = useSearchFieldLoss()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['default', 'field-loss'])
	const language = i18n.language as keyof ResponseLanguage

	if (!hoverInfo || !hoverInfo.area) {
		return null
	}

	const handleClickTooltip = (name: string, id: number) => {
		if (name === 'province') {
			setQueryParams({ ...queryParams, provinceCode: id, layerName: name })
		} else if (name === 'district') {
			setQueryParams({ ...queryParams, districtCode: id, layerName: name })
		} else if (name === 'subdistrict') {
			setQueryParams({ ...queryParams, subDistrictCode: id, layerName: name })
		}
		setHoverInfo(null)
	}

	return (
		<Paper
			className='absolute z-10 flex flex-col gap-2 bg-white p-2'
			style={{ left: hoverInfo.x, top: hoverInfo.y }}
		>
			<Box className='flex items-center justify-between'>
				<Typography className='text-base font-semibold text-black'>{hoverInfo.area.name[language]}</Typography>
				{hoverInfo.layerName !== 'endLayer' && (
					<IconButton
						onClick={() => handleClickTooltip(hoverInfo.layerName, hoverInfo.areaCode)}
						className='ml-2 h-6 w-6 rounded-lg border border-solid border-gray p-1'
					>
						<Icon path={mdiArrowRight} className='h-4 w-4 font-normal text-black' />
					</IconButton>
				)}
			</Box>
			<Box className='flex flex-col gap-2'>
				<Typography className='text-xs font-medium text-gray-dark2'>
					{t('damageAreaAnalysis', { ns: 'field-loss' })}
				</Typography>
				{!queryParams.lossType && (
					<Box className='flex flex-col gap-0.5'>
						<div className='flex items-baseline justify-between'>
							<span className='text-sm font-medium text-black'>{t('all')}</span>
							<div className='flex items-baseline gap-1'>
								<span className='text-base font-semibold text-secondary'>
									{hoverInfo.area.totalPredictedArea[areaUnit].toLocaleString()}
								</span>
								<span className='text-sm font-normal text-black'>{t(areaUnit)}</span>
							</div>
						</div>
						<div className='flex items-baseline gap-1'>
							{i18n.language === 'th' && (
								<span className='text-xs font-medium text-gray-dark2'>{'คิดเป็น'}</span>
							)}
							<span className='text-xs font-medium text-secondary'>
								{hoverInfo.area.totalPredictedArea.percent + '%'}
							</span>
							<span className='text-xs font-medium text-gray-dark2'>
								{t('percentRegisteredAreas', { ns: 'field-loss' })}
							</span>
						</div>
					</Box>
				)}
				{((!queryParams.lossType && hoverInfo.area.lossPredicted.find((item) => item.lossType === 'drought')) ||
					queryParams.lossType === LossType.Drought) && (
					<Box className='flex flex-col gap-0.5'>
						<div className='flex items-baseline justify-between'>
							<span className='text-sm font-medium text-black'>{t('drought')}</span>
							<div className='flex items-baseline gap-1'>
								<span className='text-base font-semibold text-secondary'>
									{hoverInfo.area.lossPredicted
										.find((item) => item.lossType === 'drought')
										?.[areaUnit].toLocaleString()}
								</span>
								<span className='text-sm font-normal text-black'>{t(areaUnit)}</span>
							</div>
						</div>
						<div className='flex items-baseline gap-1'>
							{i18n.language === 'th' && (
								<span className='text-xs font-medium text-gray-dark2'>{'คิดเป็น'}</span>
							)}
							<span className='text-xs font-medium text-secondary'>
								{hoverInfo.area.lossPredicted.find((item) => item.lossType === 'drought')?.percent +
									'%'}
							</span>
							<span className='text-xs font-medium text-gray-dark2'>
								{t('percentRegisteredAreas', { ns: 'field-loss' })}
							</span>
						</div>
					</Box>
				)}
				{((!queryParams.lossType && hoverInfo.area.lossPredicted.find((item) => item.lossType === 'flood')) ||
					queryParams.lossType === LossType.Flood) && (
					<Box className='flex flex-col gap-0.5'>
						<div className='flex items-baseline justify-between'>
							<span className='text-sm font-medium text-black'>{t('flood')}</span>
							<div className='flex items-baseline gap-1'>
								<span className='text-base font-semibold text-secondary'>
									{hoverInfo.area.lossPredicted
										.find((item) => item.lossType === 'flood')
										?.[areaUnit].toLocaleString()}
								</span>
								<span className='text-sm font-normal text-black'>{t(areaUnit)}</span>
							</div>
						</div>
						<div className='flex items-baseline gap-1'>
							{i18n.language === 'th' && (
								<span className='text-xs font-medium text-gray-dark2'>{'คิดเป็น'}</span>
							)}
							<span className='text-xs font-medium text-secondary'>
								{hoverInfo.area.lossPredicted.find((item) => item.lossType === 'flood')?.percent + '%'}
							</span>
							<span className='text-xs font-medium text-gray-dark2'>
								{t('percentRegisteredAreas', { ns: 'field-loss' })}
							</span>
						</div>
					</Box>
				)}
			</Box>
		</Paper>
	)
}

export default Tooltip
