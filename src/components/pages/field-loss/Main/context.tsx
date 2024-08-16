import { ResponseArea } from '@/api/interface'
import { LossType, SortType } from '@/enum'
import { create } from 'zustand'

interface Data {
	//id: number
	totalPredicted: ResponseArea
	droughtPredicted: ResponseArea
	floodPredicted: ResponseArea
}

export interface FieldLossParamsType {
	startDate?: Date
	endDate?: Date
	provinceId?: number
	districtId?: number
	lossType?: LossType | null
	sortType?: SortType
	sortTypeField?: keyof Data
}

const initialParams = {
	startDate: undefined,
	endDate: undefined,
	provinceId: undefined,
	districtId: undefined,
	LossType: undefined,
	sortType: SortType.DESC,
	sortTypeField: undefined,
}

interface SearchFieldLossContextType {
	queryParams: FieldLossParamsType
	setQueryParams: (queryParams: FieldLossParamsType) => void
}

const useSearchFieldLoss = create<SearchFieldLossContextType>((set) => ({
	queryParams: initialParams,
	setQueryParams: (queryParams: FieldLossParamsType) => set({ queryParams }),
}))

export default useSearchFieldLoss
