'use client'

import * as React from 'react'
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
	Typography,
	Paper,
	Checkbox,
	Avatar,
	Button,
	IconButton,
	Stack,
	Pagination,
	Snackbar,
	Alert,
	PaginationItem,
	CircularProgress,
} from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import { SortType } from '@/enum'
import um from '@/api/um'
import { DeleteProfileDtoIn, GetSearchUMDtoIn, PatchStatusDtoIn } from '@/api/um/dto-in.dto'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useSwitchLanguage } from '@/i18n/client'
import { Language } from '@/enum'
import { GetSearchUMDtoOut } from '@/api/um/dto-out.dto'
import { ResponseLanguage } from '@/api/interface'
import { mdiTrashCanOutline, mdiPencilOutline, mdiAccount, mdiAccountOff, mdiFolderOffOutline } from '@mdi/js'
import Icon from '@mdi/react'
import { AlertInfoType } from '@/components/shared/ProfileForm/interface'
import { useSession } from 'next-auth/react'
import AlertConfirm from '@/components/common/dialog/AlertConfirm'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import useResponsive from '@/hook/responsive'
import classNames from 'classnames'
import { FormMain } from '../Form'
import clsx from 'clsx'

interface Data {
	id: string
	firstName: string
	email: string
	organization: string
	responsibleProvinceName: string
	responsibleDistrictName: string
	role: string
	status: string
	control: string
}

interface HeadCell {
	disablePadding: boolean
	id: string
	label: string
	numeric: boolean
	minWidth: string
	maxWidth: string
}

interface UserManagementTableProps {
	searchParams: GetSearchUMDtoIn
	setSearchParams: React.Dispatch<React.SetStateAction<GetSearchUMDtoIn>>
	isSearch: boolean
	setIsSearch: React.Dispatch<React.SetStateAction<boolean>>
	page: number
	setPage: React.Dispatch<React.SetStateAction<number>>
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({
	searchParams,
	setSearchParams,
	isSearch,
	setIsSearch,
	page,
	setPage,
}) => {
	const { data: session } = useSession()
	const [order, setOrder] = React.useState<SortType>(SortType.ASC)
	const [orderBy, setOrderBy] = React.useState<string>('firstName')
	const [selected, setSelected] = React.useState<readonly string[]>([])
	const [dense, setDense] = React.useState(false)
	const queryClient = useQueryClient()

	const { t, i18n } = useTranslation(['default', 'um'])
	const { i18n: i18nWithCookie } = useSwitchLanguage(i18n.language as Language, 'appbar')
	const { isDesktop } = useResponsive()

	// Define TableHead
	const headCells: readonly HeadCell[] = [
		{
			id: 'firstName',
			numeric: false,
			disablePadding: true,
			label: t('nameSurname'),
			maxWidth: '',
			minWidth: '292px',
		},
		{
			id: 'email',
			numeric: false,
			disablePadding: false,
			label: t('email'),
			maxWidth: '220px',
			minWidth: '220px',
		},
		{
			id: 'organization',
			numeric: false,
			disablePadding: false,
			label: t('org'),
			maxWidth: '120px',
			minWidth: '120px',
		},
		{
			id: 'role',
			numeric: false,
			disablePadding: false,
			label: t('role'),
			maxWidth: '120px',
			minWidth: '140px',
		},
		{
			id: 'respProvince',
			numeric: false,
			disablePadding: false,
			label: t('belongProvince', { ns: 'um' }),
			maxWidth: '120px',
			minWidth: '160px',
		},
		{
			id: 'respDistrict',
			numeric: false,
			disablePadding: false,
			label: t('belongDistrict', { ns: 'um' }),
			maxWidth: '120px',
			minWidth: '160px',
		},
		{
			id: 'status',
			numeric: false,
			disablePadding: false,
			label: t('status'),
			maxWidth: '176px',
			minWidth: '100px',
		},
	]

	// TableData State
	const [tableData, setTableData] = React.useState<GetSearchUMDtoOut[]>([])
	const [total, setTotal] = React.useState<number>(0)
	const [currentDeleteId, setCurrentDeleteId] = React.useState<string>('')
	const [currentEditId, setCurrentEditId] = React.useState<string>('')
	const [alertInfo, setAlertInfo] = React.useState<AlertInfoType>({
		open: false,
		severity: 'success',
		message: '',
	})
	const [isEditOpen, setIsEditOpen] = React.useState<boolean>(false)
	const [isConfirmDeleteOneOpen, setIsConfirmDeleteOneOpen] = React.useState<boolean>(false)
	const [isConfirmDeleteManyOpen, setIsConfirmDeleteManyOpen] = React.useState<boolean>(false)
	const [isConfirmOpenManyOpen, setIsConfirmOpenManyOpen] = React.useState<boolean>(false)
	const [isConfirmCloseManyOpen, setIsConfirmCloseManyOpen] = React.useState<boolean>(false)

	// ModalAction

	const { data: resData, isLoading: isTableDataLoading } = useQuery({
		queryKey: ['getSearchUM'],
		queryFn: async () => {
			const res = await um.getSearchUM(searchParams)
			setIsSearch(false)
			return res
		},
		enabled: isSearch && searchParams && JSON.stringify(searchParams).length !== 0,
	})

	const {
		data: patchStatusData,
		error: patchStatusError,
		mutateAsync: mutatePatchStatus,
	} = useMutation({
		mutationFn: async (payload: PatchStatusDtoIn) => {
			return await um.patchStatus(payload)
		},
	})

	const {
		data: deleteProfileData,
		error: deleteProfileError,
		mutateAsync: mutateDeleteProfile,
	} = useMutation({
		mutationFn: async (payload: DeleteProfileDtoIn) => {
			return await um.deleteProfile(payload)
		},
	})

	React.useEffect(() => {
		setIsSearch(true)
	}, [setIsSearch])

	React.useEffect(() => {
		if (resData) {
			setTableData(resData.data || [])
			setTotal(resData.total || 0)
		}
	}, [resData])

	React.useEffect(() => {
		setSelected([])
	}, [isSearch])

	const handleRequestSort = React.useCallback(
		(event: React.MouseEvent<unknown>, property: string) => {
			const isAsc = orderBy === property && order === SortType.ASC
			setSearchParams((prevSearch) => ({
				...prevSearch,
				sortField: property,
				sortOrder: isAsc ? SortType.DESC : SortType.ASC,
				respLang: i18n.language,
			}))
			setIsSearch(true)
			setOrder(isAsc ? SortType.DESC : SortType.ASC)
			setOrderBy(property)
		},
		[order, orderBy, setIsSearch, setSearchParams],
	)

	const handleSelectAllClick = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			if (event.target.checked) {
				const newSelected = tableData.filter((n) => n.id !== session?.user.id).map((n) => n.id)
				setSelected(newSelected)
			} else {
				setSelected([])
			}
		},
		[session?.user.id, tableData],
	)

	const createSortHandler = React.useCallback(
		(property: string) => (event: React.MouseEvent<unknown>) => {
			handleRequestSort(event, property)
		},
		[handleRequestSort],
	)

	const handleClick = React.useCallback(
		(event: React.MouseEvent<unknown>, id: string) => {
			const selectedIndex = selected.indexOf(id)
			let newSelected: readonly string[] = []
			if (id === session?.user.id) {
				return
			}
			if (selectedIndex === -1) {
				newSelected = newSelected.concat(selected, id)
			} else if (selectedIndex === 0) {
				newSelected = newSelected.concat(selected.slice(1))
			} else if (selectedIndex === selected.length - 1) {
				newSelected = newSelected.concat(selected.slice(0, -1))
			} else if (selectedIndex > 0) {
				newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
			}
			setSelected(newSelected)
		},
		[selected, session?.user.id],
	)

	// Case deleteOne
	const handleOnClickConfirmDelete = React.useCallback(
		async (id: string) => {
			try {
				// filter out current session userid
				if (id === session?.user.id) {
					return
				}
				const payload: DeleteProfileDtoIn = { id: id }
				const res = await mutateDeleteProfile(payload)
				queryClient.invalidateQueries({ queryKey: ['getSearchUM', searchParams] })
				setIsSearch(true)
				setAlertInfo({ open: true, severity: 'success', message: t('profileDeleteSuccess', { ns: 'um' }) })
				console.log(res)
			} catch (error: any) {
				setAlertInfo({
					open: true,
					severity: 'error',
					message: error?.title ? error.title : t('error.somethingWrong'),
				})
			}
		},
		[mutateDeleteProfile, queryClient, searchParams, session?.user.id, setIsSearch, t],
	)

	// Case deleteMany
	const handleOnClickDeleteUser = React.useCallback(async () => {
		try {
			const requestMap: DeleteProfileDtoIn[] = selected
				.filter((n) => n !== session?.user.id)
				.map((n) => {
					return {
						id: n,
					}
				})

			const promises = requestMap.map((request) => mutateDeleteProfile(request))
			Promise.all(promises)
				.then((res) => {
					console.log(res)
					queryClient.invalidateQueries({ queryKey: ['getSearchUM', searchParams] })
					setIsSearch(true)
					setAlertInfo({ open: true, severity: 'success', message: t('profileDeleteSuccess', { ns: 'um' }) })
				})
				.catch((error) => {
					console.log(error)
				})
		} catch (error: any) {
			setAlertInfo({
				open: true,
				severity: 'error',
				message: error?.title ? error.title : t('error.somethingWrong'),
			})
		}
	}, [mutateDeleteProfile, queryClient, searchParams, selected, session?.user.id, setIsSearch, t])

	// Case openMany
	const handleOnClickOpenUser = React.useCallback(async () => {
		try {
			const requestMap: PatchStatusDtoIn[] = selected
				.filter((n) => n !== session?.user.id)
				.map((n) => {
					return {
						id: n,
						flagStatus: 'A',
					}
				})
			const promises = requestMap.map((request) => mutatePatchStatus(request))
			Promise.all(promises)
				.then((res) => {
					console.log(res)
					queryClient.invalidateQueries({ queryKey: ['getSearchUM', searchParams] })
					setIsSearch(true)
					setAlertInfo({ open: true, severity: 'success', message: t('profileUpdate', { ns: 'um' }) })
				})
				.catch((error) => {
					console.log(error)
				})
		} catch (error: any) {
			console.error(error)
			setAlertInfo({
				open: true,
				severity: 'error',
				message: error?.title ? error.title : t('error.somethingWrong'),
			})
		}
	}, [mutatePatchStatus, queryClient, searchParams, selected, session?.user.id, setIsSearch, t])

	// Case closeMany
	const handleOnClickCloseUser = React.useCallback(async () => {
		try {
			const requestMap: PatchStatusDtoIn[] = selected
				.filter((n) => n !== session?.user.id)
				.map((n) => {
					return {
						id: n,
						flagStatus: 'C',
					}
				})
			const promises = requestMap.map((request) => mutatePatchStatus(request))
			Promise.all(promises)
				.then((res) => {
					console.log(res)
					queryClient.invalidateQueries({ queryKey: ['getSearchUM', searchParams] })
					setIsSearch(true)
					setAlertInfo({ open: true, severity: 'success', message: t('profileUpdate', { ns: 'um' }) })
				})
				.catch((error) => {
					console.log('promise err :: ', error)
					setAlertInfo({
						open: true,
						severity: 'error',
						message: error?.title ? error.title : t('error.somethingWrong'),
					})
				})
		} catch (error: any) {
			console.error('error :: ', error)
			setAlertInfo({
				open: true,
				severity: 'error',
				message: error?.title ? error.title : t('error.somethingWrong'),
			})
		}
	}, [mutatePatchStatus, queryClient, searchParams, selected, session?.user.id, setIsSearch, t])

	const handlePagination = React.useCallback(
		(event: React.ChangeEvent<unknown>, value: number) => {
			if (value === page + 1 || value === page - 1) {
				setSearchParams((prevSearch) => ({
					...prevSearch,
					offset: page < value ? prevSearch.offset + 10 : prevSearch.offset - 10,
					respLang: i18n.language,
				}))
			} else {
				setSearchParams((prevSearch) => ({
					...prevSearch,
					offset: (value - 1) * 10,
					respLang: i18n.language,
				}))
			}
			setIsSearch(true)
			setPage(value)
		},
		[setSearchParams, setIsSearch, setPage, page],
	)

	const isSelected = (id: string) => selected.indexOf(id) !== -1

	const handleSubmitUser = async (event: React.FormEvent) => {
		console.log('Form submitted')
		// Add your form submission logic here
	}

	// Avoid a layout jump when reaching the last page with empty rows.
	// const emptyRows = page > Math.ceil(total / 10) - 1 ? Math.max(0, 10 - tableData.length) : 0

	return (
		<div
			className={classNames('py-[16px]', {
				'pb-[8px] pt-[12px]': !isDesktop,
			})}
		>
			<Paper className='relative flex flex-col gap-[8px] px-[24px] py-[16px]'>
				<div className='flex items-baseline gap-[12px]'>
					<Typography variant='body1' className='font-semibold'>
						{t('userList', { ns: 'um' })}
					</Typography>
					<Typography variant='body2' className='text-[#7A7A7A]'>
						{total !== 0 && (
							<>
								{t('showing', { ns: 'um' })} {(page - 1) * 10 + 1}-{Math.min(page * 10, total)}{' '}
								{t('of', { ns: 'um' })} {total} {t('item', { ns: 'um' })}
							</>
						)}
					</Typography>
				</div>

				<Box className='flex h-[calc(100vh-200px)] flex-col justify-between lg:h-[calc(100vh-220px)]'>
					<TableContainer className='flex h-full grow flex-col overflow-y-auto' component={'div'}>
						{selected.length > 0 && (
							<Box
								// sx={{ display: 'inline-flex', backgroundColor: '#F8FAFD', position: 'sticky', left: 0 }}
								// className={
								// 	isDesktop
								// 		? 'flex h-[48px] w-auto rounded-[2px] rounded-lg p-2'
								// 		: 'flex h-[100px] w-auto flex-col rounded-[2px] rounded-lg p-2'
								// }
								className={clsx('sticky left-0 top-0 z-[100] inline-flex !bg-[#F2F2F2]', {
									'flex h-[48px] w-auto rounded-[2px] rounded-lg p-2': isDesktop,
									'flex h-[100px] w-auto flex-col rounded-[2px] rounded-lg p-2': !isDesktop,
								})}
							>
								<Typography className='m-4 flex items-center font-medium'>
									{t('selecting', { ns: 'um' })}{' '}
									<span className='inline-block font-bold text-primary'>
										&nbsp;{selected.length}&nbsp;
									</span>{' '}
									{t('names', { ns: 'um' })}
								</Typography>
								<Stack direction='row' spacing={1} className='flex items-center'>
									<Button
										className='flex h-[40px] shrink-0 gap-[8px] bg-white py-[8px] pl-[12px] pr-[16px] text-sm font-medium text-black [&_.MuiButton-startIcon]:m-0'
										variant='contained'
										color='primary'
										startIcon={<Icon path={mdiAccount} size={1} color='var(--black-color)' />}
										onClick={() => {
											setIsConfirmOpenManyOpen(true)
										}}
									>
										{isDesktop && t('enableUser', { ns: 'um' })}
									</Button>
									<Button
										className='flex h-[40px] shrink-0 gap-[8px] bg-white py-[8px] pl-[12px] pr-[16px] text-sm font-medium text-black [&_.MuiButton-startIcon]:m-0'
										variant='contained'
										color='primary'
										startIcon={<Icon path={mdiAccountOff} size={1} color='var(--black-color)' />}
										onClick={() => {
											setIsConfirmCloseManyOpen(true)
										}}
									>
										{isDesktop && t('disableUser', { ns: 'um' })}
									</Button>
									<Button
										className='flex h-[40px] shrink-0 gap-[8px] bg-white py-[8px] pl-[12px] pr-[16px] text-sm font-medium text-black [&_.MuiButton-startIcon]:m-0'
										variant='contained'
										color='primary'
										startIcon={
											<Icon path={mdiTrashCanOutline} size={1} color='var(--black-color)' />
										}
										onClick={() => {
											setIsConfirmDeleteManyOpen(true)
										}}
									>
										{isDesktop && t('deleteUser', { ns: 'um' })}
									</Button>
								</Stack>
							</Box>
						)}
						{total === 0 ? (
							<Box className='flex grow flex-col items-center justify-center'>
								<Box className='flex flex-col items-center'>
									<Icon path={mdiFolderOffOutline} size={6} color='var(--light-gray-color)' />
									<Typography variant='body1' className='!font-semibold text-gray'>
										{t('noItem', { ns: 'um' })}
									</Typography>
								</Box>
							</Box>
						) : (
							<Table
								aria-labelledby='tableTitle'
								size={dense ? 'small' : 'medium'}
								stickyHeader
								aria-label='sticky table'
								className='relative max-h-full w-full'
							>
								<TableHead>
									<TableRow
										// sx={{
										// 	position: 'sticky',
										// 	top: selected.length > 0 ? (isDesktop ? '46px' : '78px') : 0,
										// 	zIndex: 9998,
										// }}
										className={clsx('sticky z-[100]', {
											'top-[64px]': selected.length > 0 && isDesktop,
											'top-[115.42px]': selected.length > 0 && !isDesktop,
										})}
										//change this value according to height of selection control box
									>
										<TableCell padding='checkbox'>
											<Checkbox
												color='primary'
												indeterminate={
													selected.length > 0 && selected.length < tableData.length - 1
												}
												checked={
													total === 0
														? false
														: selected.length ===
															tableData.filter((n) => n.id !== session?.user.id).length
												}
												disabled={total === 0}
												onChange={handleSelectAllClick}
												inputProps={{
													'aria-label': 'select all desserts',
												}}
											/>
										</TableCell>
										{headCells.map((headCell) => (
											<TableCell
												key={headCell.id}
												// align={headCell.id === "status" ? 'center':'left'}
												align={'left'}
												padding={headCell.disablePadding ? 'none' : 'normal'}
												sortDirection={orderBy === headCell.id ? order : false}
												className={`text-sm font-semibold`}
												sx={{
													minWidth: headCell.minWidth,
												}}
											>
												<TableSortLabel
													active={orderBy === headCell.id}
													direction={orderBy === headCell.id ? order : SortType.ASC}
													onClick={createSortHandler(headCell.id)}
												>
													{headCell.label}
													{orderBy === headCell.id ? (
														<Box component='span' sx={visuallyHidden}>
															{order === SortType.DESC
																? 'sorted descending'
																: 'sorted ascending'}
														</Box>
													) : null}
												</TableSortLabel>
											</TableCell>
										))}
										<TableCell />
									</TableRow>
								</TableHead>
								<TableBody className='overflow-y max-h-[40px] min-h-[40px]'>
									{tableData.map((row, index) => {
										const isItemSelected = isSelected(row.id)
										const labelId = `enhanced-table-checkbox-${index}`
										return (
											<TableRow
												hover
												onClick={(event) => handleClick(event, row.id)}
												role='checkbox'
												aria-checked={isItemSelected}
												tabIndex={-1}
												key={row.id}
												selected={isItemSelected}
												sx={{ cursor: 'pointer' }}
											>
												<TableCell padding='checkbox'>
													<Checkbox
														color='primary'
														checked={isItemSelected}
														inputProps={{
															'aria-labelledby': labelId,
														}}
														disabled={session?.user.id === row.id}
													/>
												</TableCell>
												<TableCell component='th' id={labelId} scope='row' padding='none'>
													<Box className='flex'>
														{
															<Avatar
																className='mr-[4px] h-[24px] w-[24px] bg-primary'
																src={row.image}
															/>
														}{' '}
														{row.firstName} {row.lastName}
													</Box>
												</TableCell>
												<TableCell>{row.email}</TableCell>
												<TableCell>
													{row.orgName[i18n.language as keyof ResponseLanguage]}
												</TableCell>
												<TableCell>
													{row.roleName[i18n.language as keyof ResponseLanguage]}
												</TableCell>
												<TableCell>
													{
														row.responsibleProvinceName[
															i18n.language as keyof ResponseLanguage
														]
													}
												</TableCell>
												<TableCell>
													{
														row.responsibleDistrictName[
															i18n.language as keyof ResponseLanguage
														]
													}
												</TableCell>
												<TableCell>
													{
														<div
															className={`flex items-center justify-center rounded-2xl ${row.flagStatus === 'A' ? 'bg-success-light' : 'bg-error-light'} h-[25px] w-[64px]`}
														>
															<Typography
																className={`p-0.5 text-${row.flagStatus === 'A' ? 'success' : 'error'} text-sm`}
															>
																{
																	row.flagStatusName[
																		i18n.language as keyof ResponseLanguage
																	]
																}
															</Typography>
														</div>
													}
												</TableCell>
												<TableCell>
													<Box>
														<Stack direction='row' spacing={1}>
															<IconButton
																onClick={(e) => {
																	e.stopPropagation()
																	setCurrentEditId(row.id)
																	setIsEditOpen(true)
																}}
															>
																<Icon
																	path={mdiPencilOutline}
																	size={1}
																	color='var(--black-color)'
																/>
															</IconButton>
															<IconButton
																onClick={(e) => {
																	// stop event propagation to prevent row select
																	e.stopPropagation()
																	setCurrentDeleteId(row.id)
																	setIsConfirmDeleteOneOpen(true)
																}}
																disabled={session?.user.id === row.id}
															>
																<Icon
																	path={mdiTrashCanOutline}
																	size={1}
																	color={
																		session?.user.id === row.id
																			? 'var(--dark-gray-color)'
																			: 'var(--error-color-1)'
																	}
																/>
															</IconButton>
														</Stack>
													</Box>
												</TableCell>
											</TableRow>
										)
									})}
									{/* {emptyRows > 0 && (
										<TableRow
											style={{
												// height: (dense ? 33 : 53) * emptyRows,
												height: total === 0 ? '100%' : 168 * emptyRows, //total height is around 396px at dev screen height when total === 0
											}}
											// className={clsx(`h-[${168 * emptyRows}px]`, {
											// 	'h-[calc(100vh-404px)]': total === 0,
											// })}
										>
											<TableCell colSpan={10} />
										</TableRow>
									)} */}
								</TableBody>
							</Table>
						)}
					</TableContainer>
					<Box className={'mt-4 flex w-full items-center justify-between'}>
						<Typography className='text-base font-normal'>
							{total !== 0 && (
								<>
									{t('page', { ns: 'um' })} {page} {t('of', { ns: 'um' })} {Math.ceil(total / 10)}
								</>
							)}
						</Typography>
						{total !== 0 && (
							<Pagination
								className={
									isDesktop
										? 'um-table-pagination [&_ul]:divide-x [&_ul]:divide-y-0 [&_ul]:divide-solid [&_ul]:divide-gray [&_ul]:rounded [&_ul]:border [&_ul]:border-solid [&_ul]:border-gray'
										: 'mobile-um-table-pagination [&_ul]:divide-x [&_ul]:divide-y-0 [&_ul]:divide-solid [&_ul]:divide-gray [&_ul]:rounded [&_ul]:border [&_ul]:border-solid [&_ul]:border-gray'
								}
								count={Math.ceil(total / 10)}
								variant='outlined'
								shape='rounded'
								siblingCount={isDesktop ? 1 : 0}
								boundaryCount={isDesktop ? 1 : 0}
								onChange={handlePagination}
								page={page}
								sx={{
									gap: 0,
								}}
								renderItem={(item) => (
									<PaginationItem
										slots={{
											previous: () => (
												<>
													<ArrowBackIcon className='h-[20px] w-[20px]' />
													{isDesktop && t('previous')}
												</>
											),
											next: () => (
												<>
													{isDesktop && t('next')}
													<ArrowForwardIcon className='h-[20px] w-[20px]' />
												</>
											),
										}}
										{...item}
									/>
								)}
							/>
						)}
					</Box>
				</Box>
				{/* OverlayLoading */}
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						display: isTableDataLoading ? 'flex' : 'none',
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: 'rgba(255, 255, 255, 0.7)',
						zIndex: 10,
						borderRadius: '8px',
					}}
				>
					<CircularProgress />
				</Box>
			</Paper>
			{/* <AlertConfirm/> x 4 forEach function */}
			{/* Alert Confirm DeleteOne */}
			<AlertConfirm
				open={isConfirmDeleteOneOpen}
				title={t('alert.deleteUserProfile', { ns: 'um' })}
				content={t('alert.confirmDeleteUserProfile', { ns: 'um' })}
				onClose={() => {
					setIsConfirmDeleteOneOpen(false)
				}}
				onConfirm={() => {
					handleOnClickConfirmDelete(currentDeleteId)
					setIsConfirmDeleteOneOpen(false)
				}}
			/>
			{/* Alert Confirm Delete Many */}
			<AlertConfirm
				open={isConfirmDeleteManyOpen}
				title={t('alert.deleteUserProfile', { ns: 'um' })}
				content={t('alert.confirmDeleteUserProfile', { ns: 'um' })}
				onClose={() => {
					setIsConfirmDeleteManyOpen(false)
				}}
				onConfirm={() => {
					handleOnClickDeleteUser()
					setIsConfirmDeleteManyOpen(false)
				}}
			/>
			{/* Alert Confirm Open Many */}
			<AlertConfirm
				open={isConfirmOpenManyOpen}
				title={t('alert.enableUserProfile', { ns: 'um' })}
				content={t('alert.confirmEnableUserProfile', { ns: 'um' })}
				onClose={() => {
					setIsConfirmOpenManyOpen(false)
				}}
				onConfirm={() => {
					handleOnClickOpenUser()
					setIsConfirmOpenManyOpen(false)
				}}
			/>
			{/* Alert Confirm Close Many */}
			<AlertConfirm
				open={isConfirmCloseManyOpen}
				title={t('alert.disableUserProfile', { ns: 'um' })}
				content={t('alert.confirmDisableUserProfile', { ns: 'um' })}
				onClose={() => {
					setIsConfirmCloseManyOpen(false)
				}}
				onConfirm={() => {
					handleOnClickCloseUser()
					setIsConfirmCloseManyOpen(false)
				}}
			/>
			<Snackbar
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				open={alertInfo.open}
				autoHideDuration={6000}
				onClose={() => setAlertInfo({ ...alertInfo, open: false })}
				className='w-[300px]'
			>
				<Alert
					onClose={() => setAlertInfo({ ...alertInfo, open: false })}
					severity={alertInfo.severity}
					className='w-full'
				>
					{alertInfo.message}
				</Alert>
			</Snackbar>

			<FormMain
				open={isEditOpen}
				onClose={() => setIsEditOpen(false)}
				userId={currentEditId}
				isEdit={true}
				setOpen={setIsEditOpen}
				setIsSearch={setIsSearch}
			/>
		</div>
	)
}

export default UserManagementTable
