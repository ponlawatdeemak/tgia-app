import React from 'react'

interface TriangleLogoProps {
	width?: number
	height?: number
}

const TriangleLogo: React.FC<TriangleLogoProps> = ({ width = 60, height = 60 }) => {
	return (
		<svg width={width} height={height} viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<g clipPath='url(#clip0_477_132343)'>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M29.9993 0C46.5695 0 60 13.43 60 30.0028C60 46.5755 46.5695 60 29.9993 60C13.4291 60 0 46.57 0 30.0028C0 13.4355 13.4332 0 29.9993 0ZM29.9993 57.0266C44.8944 57.0266 56.9648 44.9539 56.9648 30.0592C56.9648 15.1645 44.8944 3.09182 29.9993 3.09182C15.1043 3.09182 3.03379 15.1659 3.03379 30.0592C3.03379 44.9525 15.1084 57.0266 29.9993 57.0266Z'
					fill='#003764'
				/>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M43.2485 50.1229H16.7524C15.742 49.4648 14.784 48.7339 13.8838 47.9382H46.1171C45.2183 48.7339 44.2602 49.4662 43.2485 50.1229ZM29.9998 54.0558C26.3314 54.0558 22.8585 53.2381 19.7394 51.783H40.2601C37.1438 53.2381 33.6681 54.0558 29.9998 54.0558ZM29.9998 5.45117C43.4233 5.45117 54.3018 16.3331 54.3018 29.7521C54.3018 34.3967 52.9968 38.7371 50.738 42.4277H9.26562C7.00542 38.7371 5.70188 34.3967 5.70188 29.7521C5.70188 16.3331 16.5817 5.45117 30.0011 5.45117H29.9998ZM48.1062 39.6732L29.9874 9.32352L11.8947 39.4832L48.1062 39.6732ZM47.8171 46.2753H12.1865C11.5437 45.5842 10.9408 44.8547 10.3833 44.0906H49.6189C49.0601 44.8547 48.4572 45.5829 47.8171 46.2753Z'
					fill='#003764'
				/>
			</g>
			<defs>
				<clipPath id='clip0_477_132343'>
					<rect width='60' height='60' fill='white' transform='matrix(-1 0 0 1 60 0)' />
				</clipPath>
			</defs>
		</svg>
	)
}

export default TriangleLogo
