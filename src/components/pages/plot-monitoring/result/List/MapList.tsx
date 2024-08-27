'use client'

import MapView from '@/components/common/map/MapView'
import classNames from 'classnames'
import React, { useMemo } from 'react'
import useSearchPlotMonitoring from '../Main/context'
import useResponsive from '@/hook/responsive'
import useAreaType from '@/store/area-type'
import useAreaUnit from '@/store/area-unit'
import { useTranslation } from 'react-i18next'
import { ResponseLanguage } from '@/api/interface'
import { GetAreaSearchPlotDtoIn } from '@/api/plot-monitoring/dto-in.dto'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'

interface MapListProps {
	areaDetail: string
}

const MapList: React.FC<MapListProps> = ({ areaDetail }) => {
	const { queryParams } = useSearchPlotMonitoring()
	const { isDesktop } = useResponsive()
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['default', 'field-loss'])
	const language = i18n.language as keyof ResponseLanguage

	const filterAreaSearchPlot = useMemo(() => {
		const filter: GetAreaSearchPlotDtoIn = {
			activityId: queryParams.activityId || undefined,
			year: queryParams.year,
			provinceCode: queryParams.provinceCode || undefined,
			districtCode: queryParams.districtCode || undefined,
			subDistrictCode: queryParams.subDistrictCode || undefined,
		}
		return filter
	}, [queryParams])

	const { data: areaSearchPlot, isLoading: isAreaSearchPlotLoading } = useQuery({
		queryKey: ['getAreaSearchPlot', filterAreaSearchPlot],
		queryFn: () => service.plotMonitoring.getAreaSearchPlot(filterAreaSearchPlot),
	})

	//console.log('areaSearchPlot', areaSearchPlot)

	return (
		<div
			className={classNames('relative h-[390px] w-full max-lg:overflow-hidden max-lg:rounded lg:h-full', {
				'lg:hidden': areaDetail !== 'map',
			})}
		>
			<MapView />
		</div>
	)
}

export default MapList
