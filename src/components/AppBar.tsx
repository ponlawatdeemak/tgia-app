'use client'

import { AppPath, appMenuConfig, profileMenuConfig } from '@/config/app'
import { AreaTypeKey, AreaUnitKey, Language } from '@/enum'
import useResponsive from '@/hook/responsive'
import useAreaType from '@/store/area-type'
import useAreaUnit from '@/store/area-unit'
import { areaTypeString, areaUnitString } from '@/utils/area-string'
import { mdiAccountOutline, mdiClose, mdiMenu, mdiTune } from '@mdi/js'
import Icon from '@mdi/react'
import {
	Avatar,
	Button,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Menu,
	MenuItem,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from '@mui/material'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import AgriculturalDepartmentLogo from './svg/AgriculturalDepartmentLogo'
import ThaicomLogo from './svg/ThaicomLogo'
import TriangleLogo from './svg/TriangleLogo'
import { useTranslation } from 'react-i18next'
import { useSwitchLanguage } from '@/i18n/client'
import classNames from 'classnames'

interface AppBarProps {
	className?: string
}

const AppBar: React.FC<AppBarProps> = ({ className = '' }) => {
	const router = useRouter()
	const pathname = usePathname()
	const { areaType, setAreaType } = useAreaType()
	const { areaUnit, setAreaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation('appbar')
	const { i18n: i18nWithCookie } = useSwitchLanguage(i18n.language as Language, 'appbar')
	const { isDesktop } = useResponsive()
	const { data: session } = useSession()
	const user = session?.user ?? null
	const version = process.env.APP_VERSION

	const [image, setImage] = useState<string>(user?.image || '')
	const [anchorOthersMenuEl, setAnchorOthersMenuEl] = React.useState<null | HTMLElement>(null)
	const [anchorToggleMenuEl, setAnchorToggleMenuEl] = React.useState<null | HTMLElement>(null)
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
	const [toggle, setToggle] = useState<boolean>(false)
	const [menuAreaString, setMenuAreaString] = useState<string>('')
	const openOthersMenu = Boolean(anchorOthersMenuEl)
	const openToggleMenu = Boolean(anchorToggleMenuEl)

	useEffect(() => {
		if (!(areaType && areaUnit && i18n.language)) return

		setMenuAreaString(`${t(areaTypeString(areaType))} (${t(areaUnitString(areaUnit))})`)
	}, [i18n.language, areaType, areaUnit, t])

	useEffect(() => {
		setImage(user?.image || '')
	}, [user?.image])

	const selectedMenuKey = useMemo(() => {
		return appMenuConfig.find((menu) => {
			if (menu.children) {
				return menu.children.find((subMenu) => subMenu.path === pathname)
			} else {
				return menu.path === pathname
			}
		})?.key
	}, [pathname])

	const handleCloseNavMenu = (key: keyof typeof AppPath) => {
		router.push(AppPath[key])
		setAnchorOthersMenuEl(null)
		setDrawerOpen(false)
	}

	const handleAreaTypeChange = (event: React.MouseEvent<HTMLElement>, newAreaType: AreaTypeKey) => {
		if (newAreaType !== null) {
			setAreaType(newAreaType)
		}
	}

	const handleAreaUnitChange = (event: React.MouseEvent<HTMLElement>, newAreaUnit: AreaUnitKey) => {
		if (newAreaUnit !== null) {
			setAreaUnit(newAreaUnit)
		}
	}

	const handleLanguageChange = (event: React.MouseEvent<HTMLElement>, newLanguage: Language) => {
		if (newLanguage !== null) {
			i18nWithCookie.changeLanguage(newLanguage)
			const oldLanguage = pathname?.split('/')?.[1]
			window.history.pushState(null, '', window.location.href.replace(`/${oldLanguage}/`, `/${newLanguage}/`))
		}
	}

	const handleImageError = () => {
		setImage('')
	}

	if (isDesktop) {
		return (
			<div className={classNames('mb-3 flex items-center justify-between', className)}>
				<div className='flex items-center gap-4'>
					<div className='ml-1 flex items-center gap-2 py-1'>
						<TriangleLogo width={30} height={30} />
						<AgriculturalDepartmentLogo width={30} height={30} />
					</div>
					<div className='flex items-center gap-3 [&_.Mui-selected]:border-primary'>
						{appMenuConfig.map((menu) =>
							(menu.children?.length || 0) > 0 ? (
								<div key={menu.path}>
									<MenuItem
										onClick={(event: any) => setAnchorOthersMenuEl(event.currentTarget)}
										className='border-b-[2px] border-solid border-transparent bg-inherit p-0'
										selected={selectedMenuKey === menu.key || openOthersMenu}
									>
										<Typography
											textAlign='center'
											className='my-1 text-base font-semibold text-black'
										>
											{t(menu.name)}
										</Typography>
									</MenuItem>
									<Menu
										anchorEl={anchorOthersMenuEl}
										open={openOthersMenu}
										onClose={() => setAnchorOthersMenuEl(null)}
										MenuListProps={{
											'aria-labelledby': 'basic-button',
										}}
										className='[&_.MuiPaper-root]:w-40 [&_.MuiPaper-root]:border [&_.MuiPaper-root]:border-solid [&_.MuiPaper-root]:border-gray'
									>
										{menu?.children?.map((subMenu) =>
											(subMenu.access?.length || 0) > 0 ? (
												subMenu.access?.includes(user?.role || '') && (
													<MenuItem
														key={subMenu.path}
														onClick={() => handleCloseNavMenu(subMenu.key)}
														className='p-3 px-2.5 text-base font-medium'
													>
														{t(subMenu.name)}
													</MenuItem>
												)
											) : (
												<MenuItem
													key={subMenu.path}
													onClick={() => handleCloseNavMenu(subMenu.key)}
													className='p-3 px-2.5 text-base font-medium'
												>
													{t(subMenu.name)}
												</MenuItem>
											),
										)}
									</Menu>
								</div>
							) : (menu.access?.length || 0) > 0 ? (
								menu.access?.includes(user?.role || '') && (
									<MenuItem
										key={menu.path}
										onClick={() => handleCloseNavMenu(menu.key)}
										className='border-b-[2px] border-solid border-transparent bg-inherit p-0'
										selected={selectedMenuKey === menu.key}
									>
										<Typography
											textAlign='center'
											className='my-1 text-base font-semibold text-black'
										>
											{t(menu.name)}
										</Typography>
									</MenuItem>
								)
							) : (
								<MenuItem
									key={menu.path}
									onClick={() => handleCloseNavMenu(menu.key)}
									className='border-b-[2px] border-solid border-transparent bg-inherit p-0'
									selected={selectedMenuKey === menu.key}
								>
									<Typography textAlign='center' className='my-1 text-base font-semibold text-black'>
										{t(menu.name)}
									</Typography>
								</MenuItem>
							),
						)}
					</div>
				</div>
				<div className='flex items-center gap-3'>
					<Button
						className='flex items-center gap-2 px-2 py-[4px] [&_>*]:m-0'
						onClick={() => handleCloseNavMenu(profileMenuConfig.key)}
					>
						{image ? (
							<Avatar
								src={image}
								alt='Profile Image'
								className='h-[24px] w-[24px] bg-success-light'
								onError={handleImageError}
							/>
						) : (
							<Avatar className='h-[24px] w-[24px] bg-success-light'>
								<Icon path={mdiAccountOutline} size={'90px'} className='text-primary' />
							</Avatar>
						)}

						<span className='max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap text-base font-medium text-black underline decoration-2 underline-offset-2'>
							{`${user?.firstName || ''} ${user?.lastName.charAt(0).padEnd(2, '.') || ''}`}
						</span>
					</Button>
					<div>
						<Button
							className='flex gap-1 py-1.5 pl-2 pr-2.5 text-base font-medium text-black [&_>*]:m-0'
							aria-controls='basic-menu2'
							onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
								setAnchorToggleMenuEl(event.currentTarget)
							}
							startIcon={<Icon path={mdiTune} size={1} />}
						>
							{menuAreaString}
						</Button>
						<Menu
							anchorEl={anchorToggleMenuEl}
							open={openToggleMenu}
							onClose={() => setAnchorToggleMenuEl(null)}
							MenuListProps={{
								'aria-labelledby': 'basic-button',
							}}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'right',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							slotProps={{
								paper: {
									className:
										'w-60 p-4 border border-solid border-gray [&_.MuiList-root]:p-0 [&_.MuiList-root]:flex [&_.MuiList-root]:flex-col [&_.MuiList-root]:gap-3',
								},
							}}
							className='[&_.MuiButtonBase-root.Mui-selected]:border [&_.MuiButtonBase-root.Mui-selected]:border-solid [&_.MuiButtonBase-root.Mui-selected]:border-primary [&_.MuiButtonBase-root.Mui-selected]:bg-white [&_.MuiButtonBase-root.Mui-selected]:text-primary [&_button.MuiButtonBase-root]:border-transparent'
						>
							<MenuItem className='flex flex-col items-start gap-2 border-0 border-b border-solid border-gray bg-transparent p-0 pb-3'>
								<Typography className='text-sm'>{t('menu.areaType')}</Typography>
								<ToggleButtonGroup
									className='box-border flex w-full gap-1 bg-gray-light3 p-1'
									value={areaType}
									exclusive
									onChange={handleAreaTypeChange}
								>
									<ToggleButton
										className='w-full rounded px-3 py-0.5 text-base'
										value={AreaTypeKey.Registration}
										aria-label='left aligned'
									>
										{t('menu.areaTypeUnit.registration')}
									</ToggleButton>
									<ToggleButton
										className='w-full rounded px-3 py-0.5 text-base'
										value={AreaTypeKey.Insurance}
										aria-label='right aligned'
									>
										{t('menu.areaTypeUnit.insurance')}
									</ToggleButton>
								</ToggleButtonGroup>
							</MenuItem>
							<MenuItem className='flex flex-col items-start gap-2 border-0 border-b border-solid border-gray bg-transparent p-0 pb-3'>
								<Typography className='text-sm'> {t('menu.areaUnit')} </Typography>
								<ToggleButtonGroup
									className='box-border flex w-full gap-1 bg-gray-light3 p-1'
									value={areaUnit}
									exclusive
									onChange={handleAreaUnitChange}
								>
									<ToggleButton
										className='w-full rounded px-3 py-0.5 text-base'
										value={AreaUnitKey.Rai}
										aria-label='left aligned'
									>
										{t('menu.areaUnitUnit.rai')}
									</ToggleButton>
									<ToggleButton
										className='w-full rounded px-3 py-0.5 text-base'
										value={AreaUnitKey.LandPlot}
										aria-label='right aligned'
									>
										{t('menu.areaUnitUnit.landPlot')}
									</ToggleButton>
								</ToggleButtonGroup>
							</MenuItem>
							<MenuItem className='flex flex-col items-start gap-2 bg-transparent p-0'>
								<Typography className='text-sm'> {t('menu.language')} </Typography>
								<ToggleButtonGroup
									className='box-border flex w-full gap-1 bg-gray-light3 p-1'
									value={i18n.language}
									exclusive
									onChange={handleLanguageChange}
								>
									<ToggleButton
										className='w-full rounded px-3 py-0.5 text-base'
										value={Language.TH}
										aria-label='left aligned'
									>
										TH
									</ToggleButton>
									<ToggleButton
										className='w-full rounded px-3 py-0.5 text-base'
										value={Language.EN}
										aria-label='right aligned'
									>
										EN
									</ToggleButton>
								</ToggleButtonGroup>
							</MenuItem>
						</Menu>
					</div>
					<div className='flex flex-col'>
						<span className='text-2xs font-medium leading-[12px]'>Powered by</span>
						<ThaicomLogo width={70} height={19} />
						<span className='text-[9px]'>Version {version}</span>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div>
			<div className={classNames('mb-2 flex items-center justify-between', className)}>
				<div className='ml-1 flex items-center gap-2 py-[4px]'>
					<TriangleLogo width={24} height={24} />
					<AgriculturalDepartmentLogo width={24} height={24} />
				</div>
				<IconButton
					size='large'
					edge='start'
					color='inherit'
					aria-label='menu'
					className='p-1'
					onClick={() => setDrawerOpen(!drawerOpen)}
				>
					<Icon path={mdiMenu} size={1} />
				</IconButton>
			</div>
			<Drawer
				anchor='top'
				open={drawerOpen}
				onClose={() => setDrawerOpen(!drawerOpen)}
				className='[&_.MuiPaper-root]:flex [&_.MuiPaper-root]:h-screen [&_.MuiPaper-root]:flex-col [&_.MuiPaper-root]:justify-between [&_.MuiPaper-root]:!rounded-none [&_.MuiPaper-root]:bg-background [&_.MuiPaper-root]:!transition-none'
			>
				<div className='flex flex-col overflow-hidden'>
					<div className='mx-4 mt-4 flex items-center justify-between pb-2'>
						<div className='ml-1 flex items-center gap-2 py-[4px]'>
							<TriangleLogo width={24} height={24} />
							<AgriculturalDepartmentLogo width={24} height={24} />
						</div>
						<IconButton
							size='large'
							edge='start'
							color='inherit'
							aria-label='menu'
							className='p-1'
							onClick={() => setDrawerOpen(!drawerOpen)}
						>
							<Icon path={mdiClose} size={1} />
						</IconButton>
					</div>
					<Divider className='border-0 border-b border-solid border-gray' />
					<div className='m-4 flex flex-col overflow-auto'>
						<List className='h-full p-0 [&_li.MuiListItem-root]:border-0 [&_li.MuiListItem-root]:border-b [&_li.MuiListItem-root]:border-solid [&_li.MuiListItem-root]:border-gray [&_li.MuiListItem-root]:px-3 [&_span.MuiTypography-root]:font-medium'>
							{appMenuConfig.map((menu) =>
								(menu.children?.length || 0) > 0 ? (
									<div key={menu.path}>
										{menu.children?.map((subMenu) =>
											(subMenu.access?.length || 0) > 0 ? (
												subMenu.access?.includes(user?.role || '') && (
													<ListItem
														key={subMenu.path}
														onClick={() => handleCloseNavMenu(subMenu.key)}
													>
														<ListItemText primary={t(subMenu.name)} />
													</ListItem>
												)
											) : (
												<ListItem
													key={subMenu.path}
													onClick={() => handleCloseNavMenu(subMenu.key)}
												>
													<ListItemText primary={t(subMenu.name)} />
												</ListItem>
											),
										)}
									</div>
								) : (menu.access?.length || 0) > 0 ? (
									menu.access?.includes(user?.role || '') && (
										<ListItem key={menu.path} onClick={() => handleCloseNavMenu(menu.key)}>
											<ListItemText primary={t(menu.name)} />
										</ListItem>
									)
								) : (
									<ListItem key={menu.path} onClick={() => handleCloseNavMenu(menu.key)}>
										<ListItemText primary={t(menu.name)} />
									</ListItem>
								),
							)}
						</List>
					</div>
				</div>
				<div className='m-4 flex flex-col rounded bg-white'>
					<div className='flex items-center justify-between p-3'>
						<Button
							className='flex items-center gap-2 px-2 py-[4px] [&_>*]:m-0'
							onClick={() => handleCloseNavMenu(profileMenuConfig.key)}
						>
							{image ? (
								<Avatar
									src={image}
									alt='Profile Image'
									className='h-[24px] w-[24px] bg-success-light'
									onError={handleImageError}
								/>
							) : (
								<Avatar className='h-[24px] w-[24px] bg-success-light'>
									<Icon path={mdiAccountOutline} size={'90px'} className='text-primary' />
								</Avatar>
							)}
							<span className='max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap text-base font-normal text-black underline decoration-1 underline-offset-2'>
								{`${user?.firstName || ''} ${user?.lastName.charAt(0).padEnd(2, '.') || ''}`}
							</span>
						</Button>
						<div className='flex gap-3'>
							<div>
								<Button
									className='flex min-w-[90px] gap-1 py-1.5 pl-2 pr-2.5 text-base font-medium text-black focus:border-[1px] focus:border-solid focus:border-primary [&_>*]:m-0'
									aria-controls='basic-menu2'
									onClick={() => setToggle(!toggle)}
									startIcon={<Icon path={mdiTune} size={1} />}
								>
									{t('setting')}
								</Button>
							</div>
							<div className='flex flex-col'>
								<span className='text-2xs font-medium leading-[12px]'>Powered by</span>
								<ThaicomLogo width={70} height={19} />
								<span className='text-[9px]'>Version {version}</span>
							</div>
						</div>
					</div>
					{toggle && (
						<div className='flex flex-col border-0 border-t-[1px] border-solid border-gray [&_.Mui-selected]:bg-white [&_.Mui-selected]:text-primary [&_.MuiButtonBase-root.Mui-selected]:border-primary [&_.MuiButtonBase-root]:border-transparent'>
							<div className='flex flex-col gap-2 px-3 py-2'>
								<Typography className='text-sm font-medium'>{t('menu.areaType')}</Typography>
								<ToggleButtonGroup
									className='box-border flex w-full gap-1 bg-gray-light3 p-1'
									value={areaType}
									exclusive
									onChange={handleAreaTypeChange}
								>
									<ToggleButton
										className='w-full px-3 py-1.5 text-base font-semibold'
										value={AreaTypeKey.Registration}
										aria-label='left aligned'
									>
										{t('menu.areaTypeUnit.registration')}
									</ToggleButton>
									<ToggleButton
										className='w-full rounded px-3 py-1.5 text-base font-semibold'
										value={AreaTypeKey.Insurance}
										aria-label='right aligned'
									>
										{t('menu.areaTypeUnit.insurance')}
									</ToggleButton>
								</ToggleButtonGroup>
							</div>
							<div className='flex border-0 border-t-[1px] border-solid border-gray'>
								<div className='flex w-full flex-col gap-2 border-0 border-r-[1px] border-solid border-gray p-3'>
									<Typography className='text-sm font-medium'> {t('menu.areaUnit')}</Typography>
									<ToggleButtonGroup
										className='box-border flex w-full gap-1 bg-gray-light3 p-1'
										value={areaUnit}
										exclusive
										onChange={handleAreaUnitChange}
									>
										<ToggleButton
											className='w-full px-3 py-1.5 text-base font-semibold'
											value={AreaUnitKey.Rai}
											aria-label='left aligned'
										>
											{t('menu.areaUnitUnit.rai')}
										</ToggleButton>
										<ToggleButton
											className='w-full rounded px-3 py-1.5 text-base font-semibold'
											value={AreaUnitKey.LandPlot}
											aria-label='right aligned'
										>
											{t('menu.areaUnitUnit.landPlot')}
										</ToggleButton>
									</ToggleButtonGroup>
								</div>
								<div className='flex w-full flex-col gap-2 p-3'>
									<Typography className='text-sm font-medium'>ภาษา</Typography>
									<ToggleButtonGroup
										className='box-border flex h-full w-full gap-1 bg-gray-light3 p-1'
										value={i18n.language}
										exclusive
										onChange={handleLanguageChange}
									>
										<ToggleButton
											className='w-full rounded px-3 py-1.5 text-base font-semibold'
											value={Language.TH}
											aria-label='left aligned'
										>
											TH
										</ToggleButton>
										<ToggleButton
											className='w-full rounded px-3 py-1.5 text-base font-semibold'
											value={Language.EN}
											aria-label='right aligned'
										>
											EN
										</ToggleButton>
									</ToggleButtonGroup>
								</div>
							</div>
						</div>
					)}
				</div>
			</Drawer>
		</div>
	)
}

export default AppBar
