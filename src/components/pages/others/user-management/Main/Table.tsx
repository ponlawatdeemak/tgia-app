'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import { visuallyHidden } from '@mui/utils'
import { SortType } from '@/enum'
import { Delete, Sort } from '@mui/icons-material'
import um from '@/api/um'
import { DeleteProfileDtoIn, GetSearchUMDtoIn, PatchStatusDtoIn } from '@/api/um/dto-in.dto'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useSwitchLanguage } from '@/i18n/client'
import { Language } from '@/enum'
import { Button, PropTypes } from '@mui/material'
import { GetSearchUMDtoOut } from '@/api/um/dto-out.dto'
import { ResponseLanguage } from '@/api/interface'
import { IconButton } from '@mui/material'
import { mdiTrashCanOutline } from '@mdi/js'
import Icon from '@mdi/react'
import { mdiPencilOutline } from '@mdi/js'
import Stack from '@mui/material/Stack'
import TableFooter from '@mui/material/TableFooter'
import Pagination from '@mui/material/Pagination'
import service from '@/api'
import { request } from 'http'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import CloseIcon from '@mui/icons-material/Close'
import { AlertInfoType } from '@/components/shared/ProfileForm/interface'
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { useSession } from 'next-auth/react'

interface Data {
	id: number
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
	id: keyof Data
	label: string
	numeric: boolean
}

interface UserManagementTableProps {
	searchParams: GetSearchUMDtoIn
	setSearchParams: React.Dispatch<React.SetStateAction<GetSearchUMDtoIn>>
	isSearch: boolean
	setIsSearch: React.Dispatch<React.SetStateAction<boolean>>
	page: number
	setPage: React.Dispatch<React.SetStateAction<number>>
}

interface ConfirmModalProps {
	isOpen: boolean
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
	mode: string
	id: string
	handleOnClickConfirmDelete: (id: string) => Promise<void>
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, setIsOpen, mode, id, handleOnClickConfirmDelete }) => {
	const { t, i18n } = useTranslation('default')
	const handleClose = () => {
		setIsOpen(false)
	}
	return (
		<Dialog
			open={isOpen}
			onClose={handleClose}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle id='alert-dialog-title'>
				{i18n.language === 'th' ? 'ลบบัญชีผู้ใช้งาน' : 'Delete User'}
			</DialogTitle>
			<IconButton
				aria-label='close'
				onClick={handleClose}
				sx={{
					position: 'absolute',
					right: 8,
					top: 8,
					color: (theme) => theme.palette.grey[500],
				}}
			>
				<CloseIcon />
			</IconButton>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{i18n.language === 'th'
						? 'ต้องการยืนยันการลบบัญชีผู้ใช้งานนี้ใช่หรือไม่'
						: 'Are you sure you want to delete this user ?'}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>{t('cancel')}</Button>
				<Button
					onClick={() => {
						handleOnClickConfirmDelete(id)
						handleClose()
					}}
				>
					{t('confirm')}
				</Button>
			</DialogActions>
		</Dialog>
	)
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
	const [orderBy, setOrderBy] = React.useState<keyof Data>('firstName')
	const [selected, setSelected] = React.useState<readonly string[]>([])
	const [dense, setDense] = React.useState(false)
	const queryClient = useQueryClient()

	const { t, i18n } = useTranslation(['default', 'profile'])
	const { i18n: i18nWithCookie } = useSwitchLanguage(i18n.language as Language, 'appbar')

	// Define TableHead
	const headCells: readonly HeadCell[] = [
		{
			id: 'firstName',
			numeric: false,
			disablePadding: true,
			label: t('firstName') + ' ' + t('lastName'),
		},
		{
			id: 'email',
			numeric: false,
			disablePadding: false,
			label: t('email'),
		},
		{
			id: 'organization',
			numeric: false,
			disablePadding: false,
			label: t('org'),
		},
		{
			id: 'role',
			numeric: false,
			disablePadding: false,
			label: t('role'),
		},
		{
			id: 'responsibleProvinceName',
			numeric: false,
			disablePadding: false,
			label: t('belongProvince', { ns: 'profile' }),
		},
		{
			id: 'responsibleDistrictName',
			numeric: false,
			disablePadding: false,
			label: t('belongDistrict', { ns: 'profile' }),
		},
		{
			id: 'status',
			numeric: false,
			disablePadding: false,
			label: 'สถานะ',
		},
	]

	// TableData State
	const [tableData, setTableData] = React.useState<GetSearchUMDtoOut[]>([])
	const [total, setTotal] = React.useState<number>(0)
	const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState<boolean>(false)
	const [currentDeleteId, setCurrentDeleteId] = React.useState<string>('')
	const [isSelectAll, setIsSelectAll] = React.useState<boolean>(false)
	const [alertInfo, setAlertInfo] = React.useState<AlertInfoType>({
		open: false,
		severity: 'success',
		message: '',
	})

	const { data: resData, isLoading: isTableDataLoading } = useQuery({
		queryKey: ['getSearchUM', searchParams],
		queryFn: () => {
			const res = um.getSearchUM(searchParams)
			setIsSearch(false)
			return res
		},
		enabled: isSearch,
	})
	const {
		data: patchStatusData,
		error: patchStatusError,
		mutateAsync: mutatePatchStatus,
	} = useMutation({
		mutationFn: async (payload: PatchStatusDtoIn) => {
			// Promise.all each payload um.patchStatus
			//const res[] = await Promise.all[ eachpayload]
			return await um.patchStatus(payload)
			// console.log("finish")
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
	}, [])

	// React.useEffect(() => {
	// 	console.log(selected)
	// }, [selected])

	React.useEffect(() => {
		if (resData) {
			setTableData(resData.data || [])
			setTotal(resData.total || 1)
		}
	}, [resData])

	React.useEffect(() => {
		setSelected([])
	}, [isSearch])

	React.useEffect(() => {
		// console.log(searchParams)
	}, [searchParams])

	const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
		const isAsc = orderBy === property && order === SortType.ASC
		setSearchParams((prevSearch) => ({
			...prevSearch,
			sortField: property,
			sortOrder: isAsc ? SortType.DESC : SortType.ASC,
		}))
		setIsSearch(true)
		setOrder(isAsc ? SortType.DESC : SortType.ASC)
		setOrderBy(property)
	}

	const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			const newSelected = tableData.filter((n) => n.id !== session?.user.id).map((n) => n.id)
			setSelected(newSelected)
		} else {
			setSelected([])
		}
	}

	const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
		handleRequestSort(event, property)
	}

	const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
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
	}

	const handleOnClickConfirmDelete = async (id: string) => {
		try {
			// filter out current session userid
			if (id === session?.user.id) {
				return
			}
			const payload: DeleteProfileDtoIn = { id: id }
			const res = await mutateDeleteProfile(payload)
			queryClient.invalidateQueries({ queryKey: ['getSearchUM', searchParams] })
			setIsSearch(true)
			// setAlertInfo
			console.log(res)
		} catch (error) {
			console.error(error)
		}
	}

	const handleOnClickOpenUser = async () => {
		// console.log(selected)
		// flag status A
		try {
			const requestMap: PatchStatusDtoIn[] = selected
				.filter((n) => n !== session?.user.id)
				.map((n) => {
					return {
						id: n,
						flagStatus: 'A',
					}
				})
			// const requestMap: PatchStatusDtoIn[] = selected.map((select) => {
			// 	// filter out current session userId
			// 	return {
			// 		id: select,
			// 		flagStatus: 'A',
			// 	}
			// })
			const promises = requestMap.map((request) => mutatePatchStatus(request))
			Promise.all(promises)
				.then((res) => {
					console.log(res)
					queryClient.invalidateQueries({ queryKey: ['getSearchUM', searchParams] })
					setIsSearch(true)
					setAlertInfo({ open: true, severity: 'success', message: t('success.profileUpdate') })
				})
				.catch((error) => {
					console.log(error)
				})
		} catch (error) {
			console.error(error)
		}
	}

	const handleOnClickCloseUser = async () => {
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
					setAlertInfo({ open: true, severity: 'success', message: t('success.profileUpdate') })
				})
				.catch((error) => {
					console.log(error)
				})
		} catch (error) {
			console.error(error)
		}
	}

	const handleOnClickDeleteUser = async () => {
		try {
			//filter currentuserid
			const requestMap: DeleteProfileDtoIn[] = selected.map((select) => {
				return {
					id: select,
				}
			})
			const promises = requestMap.map((request) => mutateDeleteProfile(request))
			Promise.all(promises)
				.then((res) => {
					console.log(res)
					queryClient.invalidateQueries({ queryKey: ['getSearchUM', searchParams] })
					setIsSearch(true)
					setAlertInfo({ open: true, severity: 'success', message: t('success.profileDelete') })
				})
				.catch((error) => {
					console.log(error)
				})
		} catch (error) {}
	}

	const handlePagination = (event: React.ChangeEvent<unknown>, value: number) => {
		setSearchParams((prevSearch) => ({
			...prevSearch,
			offset: page < value ? prevSearch.offset + 10 : prevSearch.offset - 10,
		}))
		setIsSearch(true)
		setPage(value)
	}

	const isSelected = (id: string) => selected.indexOf(id) !== -1

	// Avoid a layout jump when reaching the last page with empty rows.
	// const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableData.length) : 0

	return (
		<div className='py-[16px]'>
			<Paper className='flex flex-col gap-[8px] px-[24px] py-[16px]'>
				<div className='flex items-baseline gap-[12px]'>
					<Typography variant='body1' className='font-semibold'>
						รายชื่อผู้ใช้งาน
					</Typography>
					<Typography variant='body2' className='text-[#7A7A7A]'>
						แสดง {(page - 1) * 10 + 1}-{Math.min(page * 10, total)} จาก {total} รายการ
					</Typography>
				</div>
				{selected.length > 0 && (
					<Box
						sx={{ display: 'inline-flex', backgroundColor: '#F8FAFD' }}
						className='flex h-[48px] rounded-lg p-2'
					>
						<Typography className='m-4 flex items-center font-medium'>
							กำลังเลือก{' '}
							<span className='inline-block font-bold text-primary'>&nbsp;{selected.length}&nbsp;</span>{' '}
							รายชื่อ
						</Typography>
						<Stack direction='row' spacing={1} className='flex items-center'>
							<Button
								className='flex h-[40px] shrink-0 gap-[8px] bg-white py-[8px] pl-[12px] pr-[16px] text-sm font-medium text-black [&_.MuiButton-startIcon]:m-0'
								variant='contained'
								color='primary'
								onClick={handleOnClickOpenUser}
							>
								เปิดใช้งาน
							</Button>
							<Button
								className='flex h-[40px] shrink-0 gap-[8px] bg-white py-[8px] pl-[12px] pr-[16px] text-sm font-medium text-black [&_.MuiButton-startIcon]:m-0'
								variant='contained'
								color='primary'
								onClick={handleOnClickCloseUser}
							>
								ปิดใช้งาน
							</Button>
							<Button
								className='flex h-[40px] shrink-0 gap-[8px] bg-white py-[8px] pl-[12px] pr-[16px] text-sm font-medium text-black [&_.MuiButton-startIcon]:m-0'
								variant='contained'
								color='primary'
								startIcon={<Icon path={mdiTrashCanOutline} size={1} color='var(--black-color)' />}
								onClick={handleOnClickDeleteUser}
							>
								ลบผู้ใช้งาน
							</Button>
						</Stack>
					</Box>
				)}

				<Box className='flex flex-col gap-[16px]'>
					<TableContainer>
						<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size={dense ? 'small' : 'medium'}>
							<TableHead>
								<TableRow>
									<TableCell padding='checkbox'>
										<Checkbox
											color='primary'
											indeterminate={
												selected.length > 0 && selected.length < tableData.length - 1
											}
											checked={
												selected.length ===
												tableData.filter((n) => n.id !== session?.user.id).length
											}
											onChange={handleSelectAllClick}
											inputProps={{
												'aria-label': 'select all desserts',
											}}
										/>
									</TableCell>
									{headCells.map((headCell) => (
										<TableCell
											key={headCell.id}
											align={headCell.numeric ? 'right' : 'left'}
											padding={headCell.disablePadding ? 'none' : 'normal'}
											sortDirection={orderBy === headCell.id ? order : false}
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
							<TableBody>
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
												{row.firstName} {row.lastName}
											</TableCell>
											<TableCell>{row.email}</TableCell>
											<TableCell>
												{row.orgName[i18n.language as keyof ResponseLanguage]}
											</TableCell>
											<TableCell>
												{row.roleName[i18n.language as keyof ResponseLanguage]}
											</TableCell>
											<TableCell>
												{row.responsibleProvinceName[i18n.language as keyof ResponseLanguage]}
											</TableCell>
											<TableCell>
												{row.responsibleDistrictName[i18n.language as keyof ResponseLanguage]}
											</TableCell>
											<TableCell>
												{
													<div
														className={`flex items-center justify-center rounded-2xl ${row.flagStatus === 'A' ? 'bg-success-light' : 'bg-error-light'}`}
													>
														<Typography
															className={`p-0.5 text-${row.flagStatus === 'A' ? 'success' : 'error'}`}
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
																setIsConfirmDeleteOpen(true)
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
											height: (dense ? 33 : 53) * emptyRows,
										}}
									>
										<TableCell colSpan={6} />
									</TableRow>
								)} */}
							</TableBody>
							<TableFooter>
								<TableRow>
									<TableCell colSpan={9}>
										<Box className={'flex w-full items-center justify-between'}>
											<Typography>
												หน้า {page} จาก {Math.ceil(total / 10)}
											</Typography>
											<Pagination
												count={Math.ceil(total / 10)}
												variant='outlined'
												shape='rounded'
												siblingCount={0}
												boundaryCount={3}
												onChange={handlePagination}
												page={page}
											/>
											{/* <Pagination
												count={10}
												renderItem={(item) => (
													<PaginationItem
														slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
														{...item}
													/>
												)}
											/> */}
										</Box>
									</TableCell>
								</TableRow>
							</TableFooter>
						</Table>
					</TableContainer>
				</Box>
			</Paper>
			<ConfirmModal
				isOpen={isConfirmDeleteOpen}
				setIsOpen={setIsConfirmDeleteOpen}
				mode={'delete'}
				id={currentDeleteId}
				handleOnClickConfirmDelete={handleOnClickConfirmDelete}
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
		</div>
	)
}

export default UserManagementTable
