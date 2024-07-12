'use client'

import { AppPath, appMenuConfig } from '@/config/app'
import useResponsive from '@/hook/responsive'
import { mdiMenu, mdiTune } from '@mdi/js'
import Icon from '@mdi/react'
import { Avatar, Button, IconButton, MenuItem, Typography } from '@mui/material'
import { signOut, useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import AgriculturalDepartmentLogo from './svg/AgriculturalDepartmentLogo'
import ThaicomLogo from './svg/ThaicomLogo'
import TriangleLogo from './svg/TriangleLogo'

const AppBar = () => {
	const router = useRouter()
	const pathname = usePathname()
	const { isDesktop } = useResponsive()
	const { data: session } = useSession()
	const user = session?.user ?? null

	const selectedMenuKey = useMemo(() => {
		return appMenuConfig.find((menu) => menu.path === pathname)?.key
	}, [pathname])

	const handleCloseNavMenu = useCallback(
		(key: keyof typeof AppPath) => {
			router.push(AppPath[key])
		},
		[router],
	)

	const logout = useCallback(() => signOut(), [])

	if (isDesktop) {
		return (
			<div className='mb-4 flex h-[60px] items-center justify-between'>
				<div className='flex'>
					<div className='space-x-3 self-start'>
						<TriangleLogo width={40} height={40} />
						<AgriculturalDepartmentLogo width={40} height={40} />
					</div>
					<div className='ml-6 flex h-12 items-center gap-2 [&_.Mui-selected]:border-primary'>
						{appMenuConfig.map((menu) => (
							<MenuItem
								key={menu.path}
								onClick={() => handleCloseNavMenu(menu.key)}
								className='h-9 border-b-4 border-solid border-transparent bg-inherit px-2'
								selected={selectedMenuKey === menu.key}
							>
								<Typography textAlign='center' className='text-lg text-black'>
									{menu.name}
								</Typography>
							</MenuItem>
						))}
					</div>
				</div>
				<div className='flex gap-6'>
					<div className='flex'>
						<IconButton>
							<Avatar alt='Remy Sharp' src='/static/images/avatar/2.jpg' className='h-9 w-9' />
						</IconButton>
						<span className='self-center text-lg underline decoration-2 underline-offset-2'>
							{`${user?.firstName} ${user?.lastName}.`}
						</span>
					</div>
					<Button className='text-lg text-black' startIcon={<Icon path={mdiTune} size={1} />}>
						พื้นที่ ทบก. (ไร่)
					</Button>
					<div className='flex flex-col'>
						<span className='text-xs'>Powered by</span>
						<ThaicomLogo />
					</div>
					{/* <a href={AppPath.Login}>
						<Button onClick={logout}>Logout</Button>
					</a> */}
					<Button onClick={logout}>Logout</Button>
				</div>
			</div>
		)
	}

	return (
		<div className='flex justify-between'>
			<div className='space-x-3 self-start'>
				<TriangleLogo width={40} height={40} />
				<AgriculturalDepartmentLogo width={40} height={40} />
			</div>
			<IconButton size='large' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
				<Icon path={mdiMenu} size={1} />
			</IconButton>
		</div>
	)
}

export default AppBar
