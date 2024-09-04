import { LossType } from '@/enum'
import { addDays } from 'date-fns'
import { create } from 'zustand'

export interface AnnualAnalysisParamsType {
	// years: string[]
	// yearStart?: string
	// yearEnd?: string
	registrationAreaType?: number
	lossType?: number
	provinceCode?: number
	districtCode?: number
	subDistrictCode?: number
	years?: number[]
}

interface SearchAnnualAnalysisContextType {
	queryParams: AnnualAnalysisParamsType // change to specifice interface
	setQueryParams: (queryParams: any) => void
}

const initialParams = {
	// yearStart: undefined,
	// yearEnd: undefined,
	lossType: undefined,
	registrationAreaType: undefined,
	provinceCode: undefined,
	districtCode: undefined,
	subDistrictCode: undefined,
	years: undefined,
}

const useSearchAnnualAnalysis = create<SearchAnnualAnalysisContextType>((set) => ({
	queryParams: initialParams,
	setQueryParams: (queryParams: any) => {
		set({ queryParams })
	},
}))

export { useSearchAnnualAnalysis }
