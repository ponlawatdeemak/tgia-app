import { UserRole } from '@/enum/um.enum'

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
	PasswordReset = '/profile/password-reset',
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
	access?: string[]
}[] = [
	{
		key: 'Report',
		name: 'menu.report',
		path: AppPath.Report,
		access: [UserRole.Root, UserRole.Admin, UserRole.Analyst],
	},
	{
		key: 'UserManagement',
		name: 'menu.userManagement',
		path: AppPath.UserManagement,
		access: [UserRole.Root, UserRole.Admin],
	},
	{
		key: 'About',
		name: 'menu.about',
		path: AppPath.About,
	},
	{
		key: 'Glossary',
		name: 'menu.glossary',
		path: AppPath.Glossary,
	},
]

export const appMenuConfig: {
	key: keyof typeof AppPath
	name: string
	path: string
	children?: typeof othersMenuConfig
	access?: string[]
}[] = [
	{
		key: 'FieldLoss',
		name: 'menu.fieldLoss',
		path: AppPath.FieldLoss,
	},
	{
		key: 'PlotMonitoring',
		name: 'menu.plotMonitoring',
		path: AppPath.PlotMonitoring,
	},
	{
		key: 'AnnualAnalysis',
		name: 'menu.annualAnalysis',
		path: AppPath.AnnualAnalysis,
	},
	{
		key: 'Others',
		name: 'menu.others',
		path: AppPath.Others,
		children: othersMenuConfig,
	},
]
