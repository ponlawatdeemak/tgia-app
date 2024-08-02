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

export const LossTypeColor = {
	total: '#B23B56',
	noData: '#38A700',
	drought: '#E34A33',
	flood: '#3182BD',
}

export const TextColor = {
	text1: '#575757',
	text2: '#9F1853',
}

export const SummaryBarChartColor = {
	plant: {
		type1: '#5F5F5F',
		type2: '#9F9F9F',
		type3: '#B23B56',
		type4: '#E5B2BD',
	},
	rice: {
		type1: '#5F5F5F',
		type2: '#B23B56',
	},
	loss: {
		type1: '#5F5F5F',
		type2: '#B23B56',
		type3: '#B23B56',
	},
}

export const SummaryLineChartColor = {
	...SummaryBarChartColor,
	...{
		loss: {
			noData: '#5F5F5F',
			drought: '#E34A33',
			flood: '#3182BD',
		},
	},
}

export const TotalTileColor = {
	level1: '#F2D8DE',
	level2: '#E5B2BD',
	level3: '#D47F92',
	level4: '#B23B56',
	level5: '#722637',
}

export const DroughtTileColor = {
	level1: '#FFEFD9',
	level2: '#FDCC8A',
	level3: '#FC8E59',
	level4: '#E34A33',
	level5: '#B30100',
}

export const FolodTileColor = {
	level1: '#EFF3FF',
	level2: '#BDD7E7',
	level3: '#6BAED6',
	level4: '#3182BD',
	level5: '#08519C',
}

export const TileLayerColor = {
	disabled: '#E2E2E2',
	flood: '#3182BD',
	drought: '#E34A33',
	rice: '#38A700',
}