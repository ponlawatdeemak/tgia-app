export enum AppPath {
	FieldLoss = '/field-loss',
	PlotMonitoring = '/plot-monitoring',
	AnnualAnalysis = '/annual-analysis',
}

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
