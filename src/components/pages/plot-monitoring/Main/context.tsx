import { create } from 'zustand'

interface SearchFormContextType {
	open: boolean
	setOpen: (open: boolean) => void
}

const useSearchForm = create<SearchFormContextType>((set) => ({
	open: false,
	setOpen: (open: boolean) => set({ open }),
}))

export default useSearchForm
