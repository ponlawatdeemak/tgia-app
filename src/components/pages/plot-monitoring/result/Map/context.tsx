import { create } from 'zustand'

interface MapPinContextType {
	open: boolean
	setOpen: (open: boolean) => void
}

const useMapPin = create<MapPinContextType>((set) => ({
	open: false,
	setOpen: (open: boolean) => set({ open }),
}))

export default useMapPin
