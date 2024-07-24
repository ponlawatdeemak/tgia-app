import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { AreaTypeKey } from '@/enum'

// type Store = {
// 	areaType: AreaTypeKey
// 	setAreaType: (areaType: AreaTypeKey) => void
// }

// const getInitialAreaType = (): AreaTypeKey => {
// 	const areaType = (Number(localStorage.getItem('areaType')) || AreaTypeKey.Registration) as AreaTypeKey
// 	return areaType
// }

// const useAreaType = create<Store>()((set) => ({
// 	areaType: getInitialAreaType(),
// 	setAreaType: (areaType: AreaTypeKey) =>
// 		set(() => {
// 			localStorage?.setItem('areaType', areaType.toString())
// 			return { areaType: areaType }
// 		}),
// }))

type StoreAreaTypeKey = {
	areaType: AreaTypeKey
	setAreaType: (areaType: AreaTypeKey) => void
}

const useAreaType = create(
	persist<StoreAreaTypeKey>(
		(set) => ({
			areaType: AreaTypeKey.Registration,
			setAreaType: (areaType: AreaTypeKey) =>
				set(() => {
					return { areaType: areaType }
				}),
		}),
		{
			name: 'areaType', // name of the item in the storage (must be unique)
			storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
		},
	),
)

export default useAreaType
