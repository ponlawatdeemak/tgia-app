import { create } from 'zustand'
import { Language } from '@/enum'

type Store = {
	language: Language
	setLanguage: (language: Language) => void
}

const getInitialLanguage = (): Language => {
	const language = (localStorage.getItem('language') || Language.TH) as Language
	return language
}

const useLanguage = create<Store>()((set) => ({
	language: getInitialLanguage(),
	setLanguage: (language: Language) =>
		set(() => {
			localStorage?.setItem('language', language)
			return { language: language }
		}),
}))

export default useLanguage
