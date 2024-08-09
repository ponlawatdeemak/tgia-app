import { create } from 'zustand'

export interface FieldLossParamsType {
	startDate?: Date
	endDate?: Date
	provinceId?: number
	districtId?: number
}

const initialParams = {
	startDate: undefined,
	endDate: undefined,
	provinceId: undefined,
	districtId: undefined,
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
