import CircularProgress from '@mui/material/CircularProgress'

export default function SplashScreen({ show }: { show?: boolean }) {
	const className = !show ? 'opacity-0 pointer-events-none' : 'opacity-100'
	return (
		<div
			className={`bg-background-primary fixed inset-0 z-50 flex flex-col content-center items-center justify-center transition-opacity ${className}`}
		>
			<CircularProgress size='large' />
		</div>
	)
}
