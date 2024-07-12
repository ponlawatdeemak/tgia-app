export enum AuthPath {
	Login = '/auth/login',
	ForgetPassword = '/auth/forget-password',
	VerifyEmail = '/auth/verify-email',
	ResetPassword = '/auth/reset-password',
}

export const authPathPrefix = '/auth'

export enum PrivatePath {
	FieldLoss = '/field-loss',
	PlotMonitoring = '/plot-monitoring',
	AnnualAnalysis = '/annual-analysis',
	Others = '/others',
	Report = '/others/report',
	UserManagement = '/others/user-management',
	About = '/others/about',
	Glossary = '/others/glossary',
	Profile = '/profile',
}

export const AppPath = { ...AuthPath, ...PrivatePath }

export const profileMenuConfig: {
	key: keyof typeof AppPath
	name: string
	path: string
} = {
	key: 'Profile',
	name: 'profile',
	path: AppPath.Profile,
}

export const othersMenuConfig: {
	key: keyof typeof AppPath
	name: string
	path: string
}[] = [
	{
		key: 'Report',
		name: 'รายงาน',
		path: AppPath.Report,
	},
	{
		key: 'UserManagement',
		name: 'จัดการผู้ใช้งาน',
		path: AppPath.UserManagement,
	},
	{
		key: 'About',
		name: 'เกี่ยวกับ',
		path: AppPath.About,
	},
	{
		key: 'Glossary',
		name: 'อภิธานศัพท์',
		path: AppPath.Glossary,
	},
]

export const appMenuConfig: {
	key: keyof typeof AppPath
	name: string
	path: string
	children?: typeof othersMenuConfig
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
	{
		key: 'Others',
		name: 'อื่นๆ',
		path: AppPath.Others,
		children: othersMenuConfig,
	},
]

export enum AreaType {
	Registration = 'ทบก',
	Insurance = 'เอาประกัน',
}

export enum AreaUnit {
	Rai = 'ไร่',
	LandPlot = 'แปลง',
}

export enum Language {
	EN = 'en',
	TH = 'th',
}
