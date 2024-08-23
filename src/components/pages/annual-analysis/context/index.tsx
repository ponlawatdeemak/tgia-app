import { addDays } from 'date-fns'
import { create } from 'zustand'

export interface DateRangesType {
	startDate: Date
	endDate: Date
}

interface RangePickerContextType {
	open: boolean
	setOpen: (open: boolean) => void
	resetDateRanges: DateRangesType
}

interface SearchFieldLossContextType {
	queryParams: any
	setQueryParams: (queryParams: any) => void
}

const useYearPicker = create<RangePickerContextType>((set) => ({
	open: false,
	setOpen: (open: boolean) => set({ open }),
	resetDateRanges: { startDate: new Date(), endDate: addDays(new Date(), 15) },
}))

const useSearchAnnualAnalysis = create<SearchFieldLossContextType>((set) => ({
	queryParams: {
		// query params object depending on parameters of API
	},
	setQueryParams: (queryParams: any) => {
		set({ queryParams })
	},
}))

export { useYearPicker, useSearchAnnualAnalysis }
