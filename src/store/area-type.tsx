import { create } from 'zustand'
import { AreaTypeKey } from '@/enum'

type Store = {
	areaType: AreaTypeKey
	setAreaType: (areaType: AreaTypeKey) => void
}

const getInitialAreaType = (): AreaTypeKey => {
	const areaType = (Number(localStorage.getItem('areaType')) || AreaTypeKey.Registration) as AreaTypeKey
	return areaType
}

const useAreaType = create<Store>()((set) => ({
	areaType: getInitialAreaType(),
	setAreaType: (areaType: AreaTypeKey) =>
		set(() => {
			localStorage?.setItem('areaType', areaType.toString())
			return { areaType: areaType }
		}),
}))

export default useAreaType
