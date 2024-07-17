import VerifyEmailMain from '@/components/pages/login/VerifyEmailMain'
interface VerifyEmailPageProps {
	searchParams: { [key: string]: string | string[] | undefined }
}

const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ searchParams }) => {
	const email = typeof searchParams?.email === 'string' ? searchParams?.email : '-'
	return <VerifyEmailMain email={email} />
}

export default VerifyEmailPage
