import { create } from 'zustand'
import { AreaType } from '@/enum'

type Store = {
	areaType: AreaType
	setAreaType: (areaType: AreaType) => void
}

const useAreaType = create<Store>()((set) => ({
	areaType: AreaType.Registration,
	setAreaType: (areaType: AreaType) => set(() => ({ areaType: areaType })),
}))

export default useAreaType
