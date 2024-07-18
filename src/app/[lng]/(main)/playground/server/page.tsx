import service from '@/api'
import { updateAccessToken } from '@/api/core'

const ServerPage = async () => {
	// const loginData = await service.auth.login({
	// 	username: process.env.APP_USERNAME || '-',
	// 	password: process.env.APP_PASSWORD || '-',
	// })
	// console.log('loginData?.data : ', loginData)

	// updateAccessToken(loginData?.tokens?.accessToken)
	// const userData = await service.um.getUser({ userId: '295a35cc-80c1-702c-72f1-ad596ac1718a' })
	// console.log('userData:', userData)

	return (
		<div>
			ServerPage
			{/* 	{userData?.data ? <div>User Exist!</div> : <div>User Not Found!</div>} */}
		</div>
	)
}

export default ServerPage
