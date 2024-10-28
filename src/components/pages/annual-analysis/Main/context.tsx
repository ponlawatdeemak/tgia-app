import { ResponseLanguage } from '@/api/interface'
import { LossType } from '@/enum'
import { addDays } from 'date-fns'
import { create } from 'zustand'

export interface AnnualAnalysisParamsType {
	registrationAreaType?: number
	lossType?: number
	provinceCode?: number
	districtCode?: number
	subDistrictCode?: number
	years?: number[]
}

interface SearchAnnualAnalysisContextType {
	queryParams: AnnualAnalysisParamsType
	setQueryParams: (queryParams: any) => void
}

const initialParams = {
	lossType: undefined,
	registrationAreaType: undefined,
	provinceCode: undefined,
	districtCode: undefined,
	subDistrictCode: undefined,
	years: undefined,
}

export interface SelectOptionType {
	name?: ResponseLanguage
	id?: string
	searchType?: string
	selectedYear?: string
}

interface SelectOptionContextType {
	selectOption: SelectOptionType
	setSelectOption: (selectOption: any) => void
}

const initialSelect = {
	name: undefined,
	id: undefined,
	searchType: undefined,
	selectedYear: undefined,
}

const useSearchAnnualAnalysis = create<SearchAnnualAnalysisContextType>((set) => ({
	queryParams: initialParams,
	setQueryParams: (queryParams: any) => {
		set({ queryParams })
	},
}))

const useSelectOption = create<SelectOptionContextType>((set) => ({
	selectOption: initialSelect,
	setSelectOption: (selectOption: any) => {
		set({ selectOption })
	},
}))

export { useSearchAnnualAnalysis, useSelectOption }
