import { create } from 'zustand'
import { Language } from '@/enum'

type Store = {
	language: Language
	setLanguage: (language: Language) => void
}

const useLanguage = create<Store>()((set) => ({
	language: Language.TH,
	setLanguage: (language: Language) => set(() => ({ language: language })),
}))

export default useLanguage
