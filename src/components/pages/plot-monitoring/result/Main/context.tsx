import { BreedType, DetailType, InsuredType, LossType, PublicType, RiskType } from '@/enum'
import { OrderBy } from '@/enum/plot-monitoring.enum'
import { create } from 'zustand'

export interface PlotMonitoringParamsType {
	activityId?: number
	year: number
	provinceCode?: number
	districtCode?: number
	subDistrictCode?: number
	lossType?: LossType | null
	insuredType?: InsuredType | null
	publicStatus?: PublicType | null
	riskType?: RiskType[] | null
	riceType?: DetailType | null
	detailType?: BreedType | null
	orderBy?: string
	offset?: number
	limit?: number
}

const initialParams = {
	activityId: undefined,
	year: new Date().getFullYear(),
	provinceCode: undefined,
	districtCode: undefined,
	subDistrictCode: undefined,
	lossType: undefined,
	insuredType: undefined,
	publicStatus: undefined,
	riskType: [RiskType.High, RiskType.Medium, RiskType.Low],
	riceType: undefined,
	detailType: undefined,
	orderBy: OrderBy.ActivityId,
	offset: undefined,
	limit: 10,
}

interface SearchPlotMonitoringContextType {
	queryParams: PlotMonitoringParamsType
	setQueryParams: (queryParams: PlotMonitoringParamsType) => void
}

const useSearchPlotMonitoring = create<SearchPlotMonitoringContextType>((set) => ({
	queryParams: initialParams,
	setQueryParams: (queryParams: PlotMonitoringParamsType) => set({ queryParams }),
}))

export default useSearchPlotMonitoring
