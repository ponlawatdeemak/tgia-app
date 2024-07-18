import { create } from 'zustand'
import { AreaUnit } from '@/enum'

type Store = {
	areaUnit: AreaUnit
	setAreaUnit: (areaUnit: AreaUnit) => void
}

const useAreaUnit = create<Store>()((set) => ({
	areaUnit: AreaUnit.Rai,
	setAreaUnit: (areaUnit: AreaUnit) => set(() => ({ areaUnit: areaUnit })),
}))

export default useAreaUnit
