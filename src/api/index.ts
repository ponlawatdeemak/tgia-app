import auth from '@/api/auth'
import fieldLoss from '@/api/field-loss'
import lookup from '@/api/lookup'
import um from '@/api/um'
import annualAnalysis from './annual-analysis'
import { api } from './core'
import { APIService } from './interface'
import calendar from './calendar'
import plotMonitoring from './plot-monitoring'
import report from './report'

const service = {
	auth,
	um,
	lookup,
	fieldLoss,
	annualAnalysis,
	plotMonitoring,
	calendar,
	example: { getVersion: async (): Promise<any> => await api.get('/version', APIService.DisasterAPI) },
    report
}

export default service
