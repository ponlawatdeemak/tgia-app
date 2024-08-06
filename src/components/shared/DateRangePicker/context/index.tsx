import { Dayjs } from 'dayjs'
import { create } from 'zustand'

export interface DateRangeType {
	startDate: Dayjs | null
	endDate: Dayjs | null
}

interface RangePickerContextType {
	open: boolean
	setOpen: (open: boolean) => void
	dateRange: DateRangeType
	setDateRange: (dateRange: DateRangeType) => void
}

const useRangePicker = create<RangePickerContextType>((set) => ({
	open: false,
	setOpen: (open: boolean) => set({ open }),
	dateRange: { startDate: null, endDate: null },
	setDateRange: (dateRange: DateRangeType) => set({ dateRange }),
}))

export default useRangePicker
