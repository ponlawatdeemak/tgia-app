import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { AreaUnitKey } from '@/enum'

// type Store = {
// 	areaUnit: AreaUnitKey
// 	setAreaUnit: (areaUnit: AreaUnitKey) => void
// }

// const getInitialAreaUnit = (): AreaUnitKey => {
// 	const areaUnit = (localStorage.getItem('areaUnit') || AreaUnitKey.Rai) as AreaUnitKey
// 	return areaUnit
// }

// const useAreaUnit = create<Store>()((set) => ({
// 	areaUnit: getInitialAreaUnit(),
// 	setAreaUnit: (areaUnit: AreaUnitKey) =>
// 		set(() => {
// 			localStorage?.setItem('areaUnit', areaUnit)
// 			return { areaUnit: areaUnit }
// 		}),
// }))

type StoreAreaUnitKey = {
	areaUnit: AreaUnitKey
	setAreaUnit: (areaUnit: AreaUnitKey) => void
}

const useAreaUnit = create(
	persist<StoreAreaUnitKey>(
		(set) => ({
			areaUnit: AreaUnitKey.Rai,
			setAreaUnit: (areaUnit: AreaUnitKey) =>
				set(() => {
					return { areaUnit: areaUnit }
				}),
		}),
		{
			name: 'areaUnit', // name of the item in the storage (must be unique)
			storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
		},
	),
)

export default useAreaUnit
