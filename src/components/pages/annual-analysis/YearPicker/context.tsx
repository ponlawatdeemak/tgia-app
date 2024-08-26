import { create } from 'zustand'

export interface DateRangesType {
	startDate: Date
	endDate: Date
}

interface RangePickerContextType {
	// years: string[]
	open: boolean
	setOpen: (open: boolean) => void
}

const useYearPicker = create<RangePickerContextType>((set) => ({
	// years: string[],
	open: false,
	setOpen: (open: boolean) => set({ open }),
}))

export { useYearPicker }
