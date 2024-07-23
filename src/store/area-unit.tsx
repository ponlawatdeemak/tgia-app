import { create } from 'zustand'
import { AreaUnitKey } from '@/enum'

type Store = {
	areaUnit: AreaUnitKey
	setAreaUnit: (areaUnit: AreaUnitKey) => void
}

const getInitialAreaUnit = (): AreaUnitKey => {
	const areaUnit = (localStorage.getItem('areaUnit') || AreaUnitKey.Rai) as AreaUnitKey
	return areaUnit
}

const useAreaUnit = create<Store>()((set) => ({
	areaUnit: getInitialAreaUnit(),
	setAreaUnit: (areaUnit: AreaUnitKey) =>
		set(() => {
			localStorage?.setItem('areaUnit', areaUnit)
			return { areaUnit: areaUnit }
		}),
}))

export default useAreaUnit
