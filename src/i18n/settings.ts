import { Language } from '@/enum'

export const fallbackLng = Language.TH
export const appLanguages = [fallbackLng, Language.EN]
export const defaultNS = 'appbar'
export const cookieName = 'i18next'

export function getOptions(lng = fallbackLng, ns = defaultNS) {
	return {
		// debug: true,
		supportedLngs: appLanguages,
		fallbackLng,
		lng,
		fallbackNS: defaultNS,
		defaultNS,
		ns,
	}
}
