import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Language } from '@/enum'

// type Store = {
// 	language: Language
// 	setLanguage: (language: Language) => void
// }

// const getInitialLanguage = (): Language => {
// 	const language = (localStorage.getItem('language') || Language.TH) as Language
// 	return language
// }

// const useLanguage = create<Store>()((set) => ({
// 	language: getInitialLanguage(),
// 	setLanguage: (language: Language) =>
// 		set(() => {
// 			localStorage?.setItem('language', language)
// 			return { language: language }
// 		}),
// }))

type StoreLanguage = {
	language: Language
	setLanguage: (language: Language) => void
}

const useLanguage = create(
	persist<StoreLanguage>(
		(set) => ({
			language: Language.TH,
			setLanguage: (language: Language) =>
				set(() => {
					return { language: language }
				}),
		}),
		{
			name: 'language', // name of the item in the storage (must be unique)
			storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
		},
	),
)

export default useLanguage
