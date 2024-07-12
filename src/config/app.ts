export enum AuthPath {
	Login = '/auth/login',
	ForgetPassword = '/auth/forget-password',
	VerifyEmail = '/auth/verify-email',
	ResetPassword = '/auth/reset-password',
}

export enum PrivatePath {
	FieldLoss = '/field-loss',
	PlotMonitoring = '/plot-monitoring',
	AnnualAnalysis = '/annual-analysis',
}

export const AppPath = { ...AuthPath, ...PrivatePath }

export const authPathPrefix = '/auth'

export const appMenuConfig: {
	key: keyof typeof AppPath
	name: string
	path: string
}[] = [
	{
		key: 'FieldLoss',
		name: 'วิเคราะห์ความเสียหาย',
		path: AppPath.FieldLoss,
	},
	{
		key: 'PlotMonitoring',
		name: 'ตรวจสอบรายแปลง',
		path: AppPath.PlotMonitoring,
	},
	{
		key: 'AnnualAnalysis',
		name: 'วิเคราะห์สถิติรายปี',
		path: AppPath.AnnualAnalysis,
	},
]
