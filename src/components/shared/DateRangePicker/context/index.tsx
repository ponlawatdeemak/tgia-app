import { create } from 'zustand'

export interface DateRangesType {
	startDate: Date | undefined
	endDate: Date | undefined
}

interface RangePickerContextType {
	open: boolean
	setOpen: (open: boolean) => void
	dateRanges: DateRangesType
	setDateRanges: (dateRange: DateRangesType) => void
}

const useRangePicker = create<RangePickerContextType>((set) => ({
	open: false,
	setOpen: (open: boolean) => set({ open }),
	dateRanges: { startDate: undefined, endDate: undefined },
	setDateRanges: (dateRanges: DateRangesType) => set({ dateRanges }),
}))

export default useRangePicker
