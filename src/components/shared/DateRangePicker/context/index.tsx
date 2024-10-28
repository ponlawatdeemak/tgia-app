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

const useRangePicker = create<RangePickerContextType>((set) => ({
	open: false,
	setOpen: (open: boolean) => set({ open }),
	resetDateRanges: { startDate: new Date(), endDate: addDays(new Date(), 15) },
}))

export default useRangePicker
