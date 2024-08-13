import auth from '@/api/auth'
import fieldLoss from '@/api/field-loss'
import lookup from '@/api/lookup'
import um from '@/api/um'
import { api } from './core'
import { APIService } from './interface'
import calendar from './calendar'

const service = {
	auth,
	um,
	lookup,
	fieldLoss,
	calendar,
	example: { getVersion: async (): Promise<any> => await api.get('/version', APIService.DisasterAPI) },
}

export default service
