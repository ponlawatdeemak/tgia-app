'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import { visuallyHidden } from '@mui/utils'
import { SortType } from '@/enum'
import um from '@/api/um'
import { DeleteProfileDtoIn, GetSearchUMDtoIn, PatchStatusDtoIn } from '@/api/um/dto-in.dto'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useSwitchLanguage } from '@/i18n/client'
import { Language } from '@/enum'
import { Button } from '@mui/material'
import { GetSearchUMDtoOut } from '@/api/um/dto-out.dto'
import { ResponseLanguage } from '@/api/interface'
import { IconButton } from '@mui/material'
import { mdiTrashCanOutline } from '@mdi/js'
import Icon from '@mdi/react'
import { mdiPencilOutline } from '@mdi/js'
import Stack from '@mui/material/Stack'
import TableFooter from '@mui/material/TableFooter'
import Pagination from '@mui/material/Pagination'
import { AlertInfoType } from '@/components/shared/ProfileForm/interface'
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { useSession } from 'next-auth/react'
import { isSea } from 'node:sea'
import AlertConfirm from '@/components/common/dialog/AlertConfirm'
import PaginationItem from '@mui/material/PaginationItem'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

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
	const [orderBy, setOrderBy] = React.useState<keyof Data>('firstName')
	const [selected, setSelected] = React.useState<readonly string[]>([])
	const [dense, setDense] = React.useState(false)
	const queryClient = useQueryClient()

	const { t, i18n } = useTranslation(['default', 'um'])
	const { i18n: i18nWithCookie } = useSwitchLanguage(i18n.language as Language, 'appbar')

	// Define TableHead
	const headCells: readonly HeadCell[] = [
		{
			id: 'firstName',
			numeric: false,
			disablePadding: true,
			label: t('nameSurname'),
			maxWidth: '',
			minWidth: '',
		},
		{
			id: 'email',
			numeric: false,
			disablePadding: false,
			label: t('email'),
			maxWidth: '200px',
			minWidth: '100px',
		},
		{
			id: 'organization',
			numeric: false,
			disablePadding: false,
			label: t('org'),
			maxWidth: '120px',
			minWidth: '80px',
		},
		{
			id: 'role',
			numeric: false,
			disablePadding: false,
			label: t('role'),
			maxWidth: '120px',
			minWidth: '80px',
		},
		{
			id: 'responsibleProvinceName',
			numeric: false,
			disablePadding: false,
			label: t('belongProvince', { ns: 'um' }),
			maxWidth: '176px',
			minWidth: '100px',
		},
		{
			id: 'responsibleDistrictName',
			numeric: false,
			disablePadding: false,
			label: t('belongDistrict', { ns: 'um' }),
			maxWidth: '176px',
			minWidth: '100px',
		},
		{
			id: 'status',
			numeric: false,
			disablePadding: false,
			label: t('status'),
			maxWidth: '176px',
			minWidth: '80px',
		},
	]

	// TableData State
	const [tableData, setTableData] = React.useState<GetSearchUMDtoOut[]>([])
	const [total, setTotal] = React.useState<number>(0)
	const [currentDeleteId, setCurrentDeleteId] = React.useState<string>('')
	const [alertInfo, setAlertInfo] = React.useState<AlertInfoType>({
		open: false,
		severity: 'success',
		message: '',
	})
	const [isConfirmDeleteOneOpen, setIsConfirmDeleteOneOpen] = React.useState<boolean>(false)
	const [isConfirmDeleteManyOpen, setIsConfirmDeleteManyOpen] = React.useState<boolean>(false)
	const [isConfirmOpenManyOpen, setIsConfirmOpenManyOpen] = React.useState<boolean>(false)
	const [isConfirmCloseManyOpen, setIsConfirmCloseManyOpen] = React.useState<boolean>(false)

	// ModalAction

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
			setTotal(resData.total || 1)
		}
	}, [resData])

	React.useEffect(() => {
		setSelected([])
	}, [isSearch])

	const handleRequestSort = React.useCallback(
		(event: React.MouseEvent<unknown>, property: keyof Data) => {
			const isAsc = orderBy === property && order === SortType.ASC
			setSearchParams((prevSearch) => ({
				...prevSearch,
				sortField: property,
				sortOrder: isAsc ? SortType.DESC : SortType.ASC,
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
		(property: keyof Data) => (event: React.MouseEvent<unknown>) => {
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
				setAlertInfo({ open: true, severity: 'success', message: t('success.profileDelete') })
				console.log(res)
			} catch (error) {
				console.error(error)
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
					setAlertInfo({ open: true, severity: 'success', message: t('success.profileDelete') })
				})
				.catch((error) => {
					console.log(error)
				})
		} catch (error) {
			setAlertInfo({ open: true, severity: 'error', message: t('error.profileDelete') })
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
					setAlertInfo({ open: true, severity: 'success', message: t('alert.profileUpdate') })
				})
				.catch((error) => {
					console.log(error)
				})
		} catch (error) {
			console.error(error)
			setAlertInfo({ open: true, severity: 'error', message: t('error.profileUpdate') })
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
					setAlertInfo({ open: true, severity: 'success', message: t('alert.profileUpdate') })
				})
				.catch((error) => {
					console.log(error)
				})
		} catch (error) {
			console.error(error)
			setAlertInfo({ open: true, severity: 'error', message: t('error.profileUpdate') })
		}
	}, [mutatePatchStatus, queryClient, searchParams, selected, session?.user.id, setIsSearch, t])

	const handlePagination = React.useCallback(
		(event: React.ChangeEvent<unknown>, value: number) => {
			setSearchParams((prevSearch) => ({
				...prevSearch,
				offset: page < value ? prevSearch.offset + 10 : prevSearch.offset - 10,
			}))
			setIsSearch(true)
			setPage(value)
		},
		[setSearchParams, setIsSearch, setPage, page],
	)

	const isSelected = (id: string) => selected.indexOf(id) !== -1

	// Avoid a layout jump when reaching the last page with empty rows.
	// const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableData.length) : 0

	return (
		<div className='py-[16px]'>
			<Paper className='flex flex-col gap-[8px] px-[24px] py-[16px]'>
				<div className='flex items-baseline gap-[12px]'>
					<Typography variant='body1' className='font-semibold'>
						{t('userList', { ns: 'um' })}
					</Typography>
					<Typography variant='body2' className='text-[#7A7A7A]'>
						{t('showing', { ns: 'um' })} {(page - 1) * 10 + 1}-{Math.min(page * 10, total)}{' '}
						{t('of', { ns: 'um' })} {total} {t('item', { ns: 'um' })}
					</Typography>
				</div>
				{selected.length > 0 && (
					<Box
						sx={{ display: 'inline-flex', backgroundColor: '#F8FAFD' }}
						className='flex h-[48px] rounded-lg p-2'
					>
						<Typography className='m-4 flex items-center font-medium'>
							{t('selecting', {ns : 'um'})}{' '}
							<span className='inline-block font-bold text-primary'>&nbsp;{selected.length}&nbsp;</span>{' '}
							{t('names', {ns : 'um'})}
						</Typography>
						<Stack direction='row' spacing={1} className='flex items-center'>
							<Button
								className='flex h-[40px] shrink-0 gap-[8px] bg-white py-[8px] pl-[12px] pr-[16px] text-sm font-medium text-black [&_.MuiButton-startIcon]:m-0'
								variant='contained'
								color='primary'
								onClick={() => {
									setIsConfirmOpenManyOpen(true)
								}}
							>
								{t('enableUser', { ns: 'um' })}
							</Button>
							<Button
								className='flex h-[40px] shrink-0 gap-[8px] bg-white py-[8px] pl-[12px] pr-[16px] text-sm font-medium text-black [&_.MuiButton-startIcon]:m-0'
								variant='contained'
								color='primary'
								onClick={() => {
									setIsConfirmCloseManyOpen(true)
								}}
							>
								{t('disableUser', { ns: 'um' })}
							</Button>
							<Button
								className='flex h-[40px] shrink-0 gap-[8px] bg-white py-[8px] pl-[12px] pr-[16px] text-sm font-medium text-black [&_.MuiButton-startIcon]:m-0'
								variant='contained'
								color='primary'
								startIcon={<Icon path={mdiTrashCanOutline} size={1} color='var(--black-color)' />}
								onClick={() => {
									setIsConfirmDeleteManyOpen(true)
								}}
							>
								{t('deleteUser', { ns: 'um' })}
							</Button>
						</Stack>
					</Box>
				)}

				<Box className='flex flex-col gap-[16px]'>
					<TableContainer sx={{ maxHeight: 512 }}>
						<Table
							// sx={{ minWidth: 1024, minHeight: 680 }}
							aria-labelledby='tableTitle'
							size={dense ? 'small' : 'medium'}
							stickyHeader
							aria-label='sticky table'
						>
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
											// className={`w-[${headCell.width}]`}
											style={{
												minWidth: headCell.minWidth,
												// maxWidth : headCell.maxWidth
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
											sx={{ cursor: 'pointer', minHeight: '40px' }}
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
															className={`p-0.5 text-${row.flagStatus === 'A' ? 'success' : 'error'} text-base`}
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
												{t('page', { ns: 'um' })} {page} {t('of', { ns: 'um' })}{' '}
												{Math.ceil(total / 10)}
											</Typography>
											{/* <Pagination
												count={Math.ceil(total / 10)}
												variant='outlined'
												shape='rounded'
												siblingCount={0}
												boundaryCount={3}
												onChange={handlePagination}
												page={page}
											/> */}
											<Pagination
												count={Math.ceil(total / 10)}
												variant='outlined'
												shape='rounded'
												siblingCount={0}
												boundaryCount={3}
												onChange={handlePagination}
												page={page}
												renderItem={(item) => (
													<PaginationItem
														slots={{
															previous: () => (
																<>
																	<ArrowBackIcon className='h-[12] w-[12]' />{' '}
																	{t('previous')}
																</>
															),
															next: () => (
																<>
																	{t('next')}{' '}
																	<ArrowForwardIcon className='h-[12] w-[12]' />
																</>
															),
														}}
														{...item}
													/>
												)}
											/>
										</Box>
									</TableCell>
								</TableRow>
							</TableFooter>
						</Table>
					</TableContainer>
				</Box>
			</Paper>
			{/* <AlertConfirm/> x 4 forEach function */}
			{/* Alert Confirm DeleteOne */}
			<AlertConfirm
				open={isConfirmDeleteOneOpen}
				title={i18n.language === 'th' ? 'ลบบัญชีผู้ใช้งาน' : 'Delete User'}
				content='Delete One'
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
				title={i18n.language === 'th' ? 'ลบบัญชีผู้ใช้งาน' : 'Delete Users'}
				content='Delete Many'
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
				title={i18n.language === 'th' ? 'เปิดผู้ใช้งาน' : 'Open Users'}
				content='Open Many'
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
				title={i18n.language === 'th' ? 'ปิดผู้ใช้งาน' : 'Close Users'}
				content='Close Many'
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
		</div>
	)
}

export default UserManagementTable
