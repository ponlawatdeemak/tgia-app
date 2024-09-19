import LoginMain from '@/components/pages/login'
import { Language } from '@/enum'
import { cookieName, fallbackLng } from '@/i18n/settings'
import { cookies } from 'next/headers'
// import LoadingScreen from '@/components/common/loading/LoadingScreen'
// import dynamic from 'next/dynamic'

// const LoginMain = dynamic(() => import('@/components/pages/login'), {
// 	loading: () => <LoadingScreen />,
// 	ssr: false,
// })

interface LoginPageProps {
	params: { lng: string }
}

// const LoginPage: React.FC<LoginPageProps> = ({ params: { lng } }) => {
const LoginPage: React.FC<LoginPageProps> = () => {
	// console.log('TLOG ~ lng:', lng)
	// const language: Language = lng === Language.EN ? Language.EN : fallbackLng
	// return <LoginMain lng={language} />
	// return <LoginMain lng={lng as Language} />
	return <LoginMain />
}

export default LoginPage
