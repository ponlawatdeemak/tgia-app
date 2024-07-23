import { AreaTypeKey } from '@/enum' 
import { AreaUnitKey } from '@/enum'

export function areaTypeString(key: AreaTypeKey) { 
	if (key === AreaTypeKey.Registration) {
		return 'menu.areaTypeUnit.registration'
	} else {
		return 'menu.areaTypeUnit.insurance'
	}
}

export function areaUnitString(key: AreaUnitKey) {
	if (key === AreaUnitKey.Rai) {
		return 'menu.areaUnitUnit.rai'
	} else {
		return 'menu.areaUnitUnit.landPlot'
	}
}
