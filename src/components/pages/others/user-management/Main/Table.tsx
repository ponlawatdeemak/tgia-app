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
import { GetSearchUMDtoIn, PatchStatusDtoIn } from '@/api/um/dto-in.dto'
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

interface Data {
	id: number
	firstName: string
	email: string
	organization: string
	role: string
	status: string
	control: string
}

// function createData(
// 	id: number,
// 	fullName: string,
// 	email: string,
// 	organization: string,
// 	role: string,
// 	status: string,
// ): Data {
// 	return {
// 		id,
// 		fullName,
// 		email,
// 		organization,
// 		role,
// 		status,
// 	}
// }

// const rows = [
// 	createData(1, 'สมชาย ลำเพลมพัด', 'Somchai@gmail.com', 'Thaicom', 'Super Admin', 'open'),
// 	createData(2, 'สิริกัญญา เมตตาทรัพย์', 'Sirikanya@gmail.com', 'TGIA', 'Admin', 'open'),
// 	createData(3, 'ขวัญมณี เอี่ยมกำเนิด', 'Kwanmani@gmail.com', 'DOAE', 'Admin', 'open'),
// 	createData(4, 'กษิดิษ เกษรศาสน์', 'Kasidit@gmail.com', 'TGIA', 'Admin', 'open'),
// 	createData(5, 'เอกลักษณ์ ตั้งคงอยู่', 'Eklaksorn@gmail.com', 'TGIA', 'User', 'open'),
// 	createData(6, 'สมาน ดำรงไทย', 'Saman@gmail.com', 'TGIA', 'User', 'close'),
// 	createData(7, 'ดิเรก รักเกษตร', 'Direk@gmail.com', 'TGIA', 'User', 'close'),
// 	createData(8, 'กฤษณา เยี่ยมอำไพ', 'Kritsana@gmail.com', 'TGIA', 'User', 'close'),
// 	createData(9, 'เขมิกา สินเจริญสุข', 'Khemika@gmail.com', 'TGIA', 'User', 'close'),
// 	createData(10, 'พรพิมา บุญสูงเนิน', 'Phonphima@gmail.com', 'TGIA', 'User', 'close'),
// ]

// function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
// 	if (b[orderBy] < a[orderBy]) {
// 		return -1
// 	}
// 	if (b[orderBy] > a[orderBy]) {
// 		return 1
// 	}
// 	return 0
// }

// function getComparator<Key extends keyof any>(
// 	order: SortType,
// 	orderBy: Key,
// ): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
// 	return order === SortType.DESC
// 		? (a, b) => descendingComparator(a, b, orderBy)
// 		: (a, b) => -descendingComparator(a, b, orderBy)
// }

// function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
// 	const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
// 	stabilizedThis.sort((a, b) => {
// 		const order = comparator(a[0], b[0])
// 		if (order !== 0) {
// 			return order
// 		}
// 		return a[1] - b[1]
// 	})
// 	return stabilizedThis.map((el) => el[0])
// }

interface HeadCell {
	disablePadding: boolean
	id: keyof Data
	label: string
	numeric: boolean
}

const headCells: readonly HeadCell[] = [
	{
		id: 'firstName',
		numeric: false,
		disablePadding: true,
		label: 'ชื่อ นามสกุล',
	},
	{
		id: 'email',
		numeric: false,
		disablePadding: false,
		label: 'อีเมล',
	},
	{
		id: 'organization',
		numeric: false,
		disablePadding: false,
		label: 'หน่วยงาน',
	},
	{
		id: 'role',
		numeric: false,
		disablePadding: false,
		label: 'บทบาท',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'สถานะ',
	},
]

interface UserManagementTableProps {
	searchParams: GetSearchUMDtoIn
	setSearchParams: React.Dispatch<React.SetStateAction<GetSearchUMDtoIn>>
	isSearch: boolean
	setIsSearch: React.Dispatch<React.SetStateAction<boolean>>
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({
	searchParams,
	setSearchParams,
	isSearch,
	setIsSearch,
}) => {
	const [order, setOrder] = React.useState<SortType>(SortType.ASC)
	const [orderBy, setOrderBy] = React.useState<keyof Data>('firstName')
	const [selected, setSelected] = React.useState<readonly string[]>([])
	const [page, setPage] = React.useState(1)
	const [dense, setDense] = React.useState(false)
	const [rowsPerPage, setRowsPerPage] = React.useState(5)
	const queryClient = useQueryClient()

	const { t, i18n } = useTranslation()
	const { i18n: i18nWithCookie } = useSwitchLanguage(i18n.language as Language, 'appbar')

	const [toggleSearch, setToggleSearch] = React.useState(false)

	// TableData State
	const [tableData, setTableData] = React.useState<GetSearchUMDtoOut[]>([])
	const [total, setTotal] = React.useState<number>(0)

	const { data: resData, isLoading: isTableDataLoading } = useQuery({
		queryKey: ['getSearchUM', searchParams],
		queryFn: () => {
			// console.log(searchParams)
			const res = um.getSearchUM(searchParams)
			setIsSearch(false)
			return res
		},
		enabled: isSearch,
	})

	const {
		data,
		error,
		mutateAsync: mutatePatchStatus,
	} = useMutation({
		mutationFn: async (payload: PatchStatusDtoIn) => {
			// Promise.all each payload um.patchStatus
			//const res[] = await Promise.all[ eachpayload]
			// console.log("await")
			await um.patchStatus(payload)
			// console.log("finish")
		},
		// onSuccess: () => {
		// 	console.log('onSuccess')
		// 	queryClient.invalidateQueries({ queryKey: ['getSearchUM', searchParams] })
		// },
	})
	// console.log('data ', data)

	React.useEffect(() => {
		setIsSearch(true)
	}, [])

	React.useEffect(() => {
		// console.log(selected)
	}, [selected])

	React.useEffect(() => {
		// console.log(resData)
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
		// console.log(isAsc)
		// console.log(property)
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
			const newSelected = tableData.map((n) => n.id)
			setSelected(newSelected)
			return
		}
		setSelected([])
	}

	const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
		handleRequestSort(event, property)
	}

	const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
		const selectedIndex = selected.indexOf(id)
		let newSelected: readonly string[] = []

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

	// const handleChangePage = (event: unknown, newPage: number) => {
	// 	setPage(newPage)
	// }

	// const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
	// 	setRowsPerPage(parseInt(event.target.value, 10))
	// 	setPage(0)
	// }

	const handleOnClickOpenUser = async () => {
		// console.log(selected)
		// flag status A
		try {
			const requestMap: PatchStatusDtoIn[] = selected.map((select) => {
				return {
					id: select,
					flagStatus: 'A',
				}
			})
			console.log('requestMap ', requestMap)
			const promises = requestMap.map((request) => mutatePatchStatus(request))
			Promise.all(promises)
				.then((res) => {
					queryClient.invalidateQueries({ queryKey: ['getSearchUM', searchParams] })
					setIsSearch(true)
					setToggleSearch(!toggleSearch)
				})
				.catch((error) => {
					console.log(error)
				})
		} catch (error) {
			console.error(error)
		}
	}

	const handleOnClickCloseUser = () => {
		try {
			const requestMap: PatchStatusDtoIn[] = selected.map((select) => {
				return {
					id: select,
					flagStatus: 'C',
				}
			})
			const promises = requestMap.map((request) => mutatePatchStatus(request))
			Promise.all(promises)
				.then((res) => {
					queryClient.invalidateQueries({ queryKey: ['getSearchUM', searchParams] })
					setIsSearch(true)
					setToggleSearch(!toggleSearch)
					console.log(res)
				})
				.catch((error) => {
					console.log(error)
				})
			// await mutatePatchStatus(requestMap[0])
		} catch (error) {
			console.error(error)
		}
	}

	const handlePagination = (event: React.ChangeEvent<unknown>, value: number) => {
		// console.log(value)
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
						แสดง 1-10 จาก {total} รายการ
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
											indeterminate={selected.length > 0 && selected.length < tableData.length}
											checked={tableData.length > 0 && selected.length === tableData.length}
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
														<IconButton>
															<Icon
																path={mdiPencilOutline}
																size={1}
																color='var(--black-color)'
															/>
														</IconButton>
														<IconButton>
															<Icon
																path={mdiTrashCanOutline}
																size={1}
																color='var(--error-color-1)'
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
									<TableCell colSpan={7}>
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
					{/* <TablePagination
						rowsPerPageOptions={[5, 10, 25]}
						component='div'
						count={tableData.length}
						rowsPerPage={rowsPerPage}
						page={page}
						// onPageChange={handleChangePage}
						// onRowsPerPageChange={handleChangeRowsPerPage}
						onPageChange={() => {}}
						onRowsPerPageChange={() => {}}
					/> */}
				</Box>
			</Paper>
		</div>
	)
}

export default UserManagementTable
