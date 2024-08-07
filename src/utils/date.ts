import { Language } from '@/enum'
import { addYears, format } from 'date-fns'
import { enUS, th } from 'date-fns/locale'

interface DateOptions {
	locale?: Locale
	weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
	firstWeekContainsDate?: number
	useAdditionalWeekYearTokens?: boolean
	useAdditionalDayOfYearTokens?: boolean
}

export const formatDate = (
	date: Date | number,
	dateFormat: string,
	language: string,
	options: Omit<DateOptions, 'locale'> = {},
) => {
	const optionsWithLocale: DateOptions = options
	if (language === Language.TH) {
		date = addYears(date, 543)
		optionsWithLocale['locale'] = th
	} else {
		optionsWithLocale['locale'] = enUS
	}
	return format(date, dateFormat, optionsWithLocale)
}
