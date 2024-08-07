import {
	Box,
	Checkbox,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
	Typography,
} from '@mui/material'
import React from 'react'
import { visuallyHidden } from '@mui/utils'
import { GetAreaStatisticDtoOut } from '@/api/field-loss/dto-out.dto'

interface Data {
	id: number
	fullName: string
	email: string
	organization: string
	role: string
	status: string
}

function createData(
	id: number,
	fullName: string,
	email: string,
	organization: string,
	role: string,
	status: string,
): Data {
	return {
		id,
		fullName,
		email,
		organization,
		role,
		status,
	}
}

const rows = [
	createData(1, 'สมชาย ลำเพลมพัด', 'Somchai@gmail.com', 'Thaicom', 'Super Admin', 'open'),
	createData(2, 'สิริกัญญา เมตตาทรัพย์', 'Sirikanya@gmail.com', 'TGIA', 'Admin', 'open'),
	createData(3, 'ขวัญมณี เอี่ยมกำเนิด', 'Kwanmani@gmail.com', 'DOAE', 'Admin', 'open'),
	createData(4, 'กษิดิษ เกษรศาสน์', 'Kasidit@gmail.com', 'TGIA', 'Admin', 'open'),
	createData(5, 'เอกลักษณ์ ตั้งคงอยู่', 'Eklaksorn@gmail.com', 'TGIA', 'User', 'open'),
	createData(6, 'สมาน ดำรงไทย', 'Saman@gmail.com', 'TGIA', 'User', 'close'),
	createData(7, 'ดิเรก รักเกษตร', 'Direk@gmail.com', 'TGIA', 'User', 'close'),
	createData(8, 'กฤษณา เยี่ยมอำไพ', 'Kritsana@gmail.com', 'TGIA', 'User', 'close'),
	createData(9, 'เขมิกา สินเจริญสุข', 'Khemika@gmail.com', 'TGIA', 'User', 'close'),
	createData(10, 'พรพิมา บุญสูงเนิน', 'Phonphima@gmail.com', 'TGIA', 'User', 'close'),
]

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1
	}
	if (b[orderBy] > a[orderBy]) {
		return 1
	}
	return 0
}

type Order = 'asc' | 'desc'

function getComparator<Key extends keyof any>(
	order: Order,
	orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
	const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0])
		if (order !== 0) {
			return order
		}
		return a[1] - b[1]
	})
	return stabilizedThis.map((el) => el[0])
}

interface HeadCell {
	disablePadding: boolean
	id: keyof Data
	label: string
	numeric: boolean
}

const headCells: readonly HeadCell[] = [
	{
		id: 'fullName',
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

interface FieldLossTableDetailProps {
	areaStatisticData?: GetAreaStatisticDtoOut | undefined
}

const FieldLossTableDetail: React.FC<FieldLossTableDetailProps> = ({ areaStatisticData }) => {
	const [order, setOrder] = React.useState<Order>('asc')
	const [orderBy, setOrderBy] = React.useState<keyof Data>('fullName')
	const [selected, setSelected] = React.useState<readonly number[]>([])
	const [page, setPage] = React.useState(0)
	const [dense, setDense] = React.useState(false)
	const [rowsPerPage, setRowsPerPage] = React.useState(5)

	const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
		const isAsc = orderBy === property && order === 'asc'
		setOrder(isAsc ? 'desc' : 'asc')
		setOrderBy(property)
	}

	const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			const newSelected = rows.map((n) => n.id)
			setSelected(newSelected)
			return
		}
		setSelected([])
	}

	const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
		handleRequestSort(event, property)
	}

	const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
		const selectedIndex = selected.indexOf(id)
		let newSelected: readonly number[] = []

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

	const isSelected = (id: number) => selected.indexOf(id) !== -1

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

	const visibleRows = React.useMemo(
		() =>
			stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
		[order, orderBy, page, rowsPerPage],
	)

	return (
		<div>
			<Typography>อันดับความเสียหายจากภัยพิบัติ</Typography>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size={dense ? 'small' : 'medium'}>
					<TableHead>
						<TableRow>
							<TableCell align='left'>รวมทั้งหมด</TableCell>
							{headCells.map((headCell) => (
								<TableCell
									key={headCell.id}
									align={headCell.numeric ? 'right' : 'left'}
									//padding={headCell.disablePadding ? 'none' : 'normal'}
								>
									{headCell.label}
								</TableCell>
							))}
						</TableRow>
						<TableRow>
							{headCells.map((headCell) => (
								<TableCell
									key={headCell.id}
									align={headCell.numeric ? 'right' : 'left'}
									padding={headCell.disablePadding ? 'none' : 'normal'}
									sortDirection={orderBy === headCell.id ? order : false}
								>
									<TableSortLabel
										active={orderBy === headCell.id}
										direction={orderBy === headCell.id ? order : 'asc'}
										onClick={createSortHandler(headCell.id)}
									>
										{headCell.label}
										{orderBy === headCell.id ? (
											<Box component='span' sx={visuallyHidden}>
												{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
											</Box>
										) : null}
									</TableSortLabel>
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{visibleRows.map((row, index) => {
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
									<TableCell component='th' id={labelId} scope='row' padding='none'>
										{row.fullName}
									</TableCell>
									<TableCell>{row.email}</TableCell>
									<TableCell>{row.organization}</TableCell>
									<TableCell>{row.role}</TableCell>
									<TableCell>{row.status}</TableCell>
								</TableRow>
							)
						})}
						{emptyRows > 0 && (
							<TableRow
								style={{
									height: (dense ? 33 : 53) * emptyRows,
								}}
							>
								<TableCell colSpan={6} />
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	)
}

export default FieldLossTableDetail
