'use client'
import * as React from 'react'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import { visuallyHidden } from '@mui/utils'

interface Data {
	id: number
	calories: number
	carbs: number
	fat: number
	name: string
	protein: number
}

function createData(id: number, name: string, calories: number, fat: number, carbs: number, protein: number): Data {
	return {
		id,
		name,
		calories,
		fat,
		carbs,
		protein,
	}
}

// Response
const mockResp = {
	data: [
		{
			id: '30',
			order: 1,
			name: {
				en: 'Nakhon Ratchasima',
				th: 'นครราชสีมา',
			},
			totalActAreas: {
				column: {
					en: 'ColumnName',
					th: 'ชื่อคอลัมน์',
				},
				areaRai: 3500000,
				areaPlot: 1750000,
			},
			totalActAreasNoGeom: {
				areaRai: 1750000,
				areaPlot: 2500000,
			},
			totalClaimedAreas: {
				areaRai: 2500000,
				areaPlot: 2250000,
			},
			totalClaimedAreasNoGeom: {
				areaRai: 2250000,
				areaPlot: 0,
			},
		},
		{
			id: '12',
			order: 2,
			name: {
				en: 'Phra Nakhon Si Ayutthaya',
				th: 'พระนครศรีอยุธยา',
			},
			totalActAreas: {
				areaRai: 1680000,
				areaPlot: 840000,
			},
			totalActAreasNoGeom: {
				areaRai: 840000,
				areaPlot: 1200000,
			},
			totalClaimedAreas: {
				areaRai: 1200000,
				areaPlot: 1080000,
			},
			totalClaimedAreasNoGeom: {
				areaRai: 1080000,
				areaPlot: 0,
			},
		},
		{
			id: '3',
			name: {
				en: 'Ubon Ratchathani',
				th: 'อุบลราชธานี',
			},
			totalActAreas: {
				areaRai: 1680000,
				areaPlot: 840000,
			},
			totalActAreasNoGeom: {
				areaRai: 840000,
				areaPlot: 1200000,
			},
			totalClaimedAreas: {
				areaRai: 1200000,
				areaPlot: 1080000,
			},
			totalClaimedAreasNoGeom: {
				areaRai: 1080000,
				areaPlot: 0,
			},
		},
		{
			id: '4',
			name: {
				en: 'Buriram',
				th: 'บุรีรัมย์',
			},
			totalActAreas: {
				areaRai: 1470000,
				areaPlot: 7000000,
			},
			totalActAreasNoGeom: {
				areaRai: 700000,
				areaPlot: 1050000,
			},
			totalClaimedAreas: {
				areaRai: 1050000,
				areaPlot: 945000,
			},
			totalClaimedAreasNoGeom: {
				areaRai: 945000,
				areaPlot: 0,
			},
		},
		{
			id: '5',
			name: {
				en: 'Maha Sarakham',
				th: 'มหาสารคาม',
			},
			totalActAreas: {
				areaRai: 1400000,
				areaPlot: 700000,
			},
			totalActAreasNoGeom: {
				areaRai: 700000,
				areaPlot: 1000000,
			},
			totalClaimedAreas: {
				areaRai: 1000000,
				areaPlot: 900000,
			},
			totalClaimedAreasNoGeom: {
				areaRai: 900000,
				areaPlot: 0,
			},
		},
		{
			id: '6',
			name: {
				en: 'Udon Thani',
				th: 'อุดรธานี',
			},
			totalActAreas: {
				areaRai: 1400000,
				areaPlot: 700000,
			},
			totalActAreasNoGeom: {
				areaRai: 700000,
				areaPlot: 1000000,
			},
			totalClaimedAreas: {
				areaRai: 1000000,
				areaPlot: 900000,
			},
			totalClaimedAreasNoGeom: {
				areaRai: 900000,
				areaPlot: 0,
			},
		},
		{
			id: '7',
			name: {
				en: 'Uthai Thani',
				th: 'อุทัยธานี',
			},
			totalActAreas: {
				areaRai: 700000,
				areaPlot: 350000,
			},
			totalActAreasNoGeom: {
				areaRai: 350000,
				areaPlot: 500000,
			},
			totalClaimedAreas: {
				areaRai: 500000,
				areaPlot: 450000,
			},
			totalClaimedAreasNoGeom: {
				areaRai: 450000,
				areaPlot: 0,
			},
		},
		{
			id: '8',
			name: {
				en: 'Kamphaeng Phet',
				th: 'กำแพงเพชร',
			},
			totalActAreas: {
				areaRai: 700000,
				areaPlot: 350000,
			},
			totalActAreasNoGeom: {
				areaRai: 350000,
				areaPlot: 500000,
			},
			totalClaimedAreas: {
				areaRai: 500000,
				areaPlot: 450000,
			},
			totalClaimedAreasNoGeom: {
				areaRai: 450000,
				areaPlot: 0,
			},
		},
		{
			id: '9',
			name: {
				en: 'Phichit',
				th: 'พิจิตร',
			},
			totalActAreas: {
				areaRai: 700000,
				areaPlot: 350000,
			},
			totalActAreasNoGeom: {
				areaRai: 350000,
				areaPlot: 500000,
			},
			totalClaimedAreas: {
				areaRai: 500000,
				areaPlot: 450000,
			},
			totalClaimedAreasNoGeom: {
				areaRai: 450000,
				areaPlot: 0,
			},
		},
		{
			id: '10',
			name: {
				en: 'Phetchabun',
				th: 'เพชรบูรณ์',
			},
			totalActAreas: {
				areaRai: 420000,
				areaPlot: 210000,
			},
			totalActAreasNoGeom: {
				areaRai: 210000,
				areaPlot: 300000,
			},
			totalClaimedAreas: {
				areaRai: 300000,
				areaPlot: 270000,
			},
			totalClaimedAreasNoGeom: {
				areaRai: 270000,
				areaPlot: 0,
			},
		},
	],
}

const rows = [
	createData(1, 'Ohio', 305, 3.7, 67, 4.3),
	createData(2, 'Donut', 452, 25.0, 51, 4.9),
	createData(3, 'Eclair', 262, 16.0, 24, 6.0),
	createData(4, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
	createData(5, 'Gingerbread', 356, 16.0, 49, 3.9),
	createData(6, 'Honeycomb', 408, 3.2, 87, 6.5),
	createData(7, 'Ice cream sandwich', 237, 9.0, 37, 4.3),
	createData(8, 'Jelly Bean', 375, 0.0, 94, 0.0),
	createData(9, 'KitKat', 518, 26.0, 65, 7.0),
	createData(10, 'Lollipop', 392, 0.2, 98, 0.0),
	createData(11, 'Marshmallow', 318, 0, 81, 2.0),
	createData(12, 'Nougat', 360, 19.0, 9, 37.0),
	createData(13, 'Oreo', 437, 18.0, 63, 4.0),
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

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
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
		id: 'name',
		numeric: false,
		disablePadding: true,
		label: 'พื้นที่',
	},
	{
		id: 'calories',
		numeric: true,
		disablePadding: false,
		label: 'พื้นที่ขึ้นทะเบียนทั้งหมด',
	},
	{
		id: 'fat',
		numeric: true,
		disablePadding: false,
		label: 'พื้นที่ขึ้นทะเบียนที่มีขอบแปลง',
	},
	{
		id: 'carbs',
		numeric: true,
		disablePadding: false,
		label: 'พื้นที่เอาประกัน',
	},
	{
		id: 'protein',
		numeric: true,
		disablePadding: false,
		label: 'พื้นที่เอาประกันที่มีขอบแปลง',
	},
]

export default function PlantStatisticTable() {
	const [order, setOrder] = React.useState<Order>('asc')
	const [orderBy, setOrderBy] = React.useState<keyof Data>('calories')
	const [selected, setSelected] = React.useState<readonly number[]>([])
	const [page, setPage] = React.useState(0)
	const [dense, setDense] = React.useState(false)
	const [rowsPerPage, setRowsPerPage] = React.useState(5)

	const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
		handleRequestSort(event, property)
	}
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

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage)
	}

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10))
		setPage(0)
	}

	const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDense(event.target.checked)
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
		<Box sx={{ width: '100%' }}>
			<Paper sx={{ width: '100%', mb: 2 }}>
				<Toolbar
					sx={{
						pl: { sm: 2 },
						pr: { xs: 1, sm: 1 },
					}}
				>
					<Typography sx={{ flex: '1 1 100%' }} variant='h6' id='tableTitle' component='div'>
						{/* Dynamic Depends on AppBar */}
						อันดับผลรวมข้อมูลทั้งหมด (ไร่){' '}
						<span className='text-sm text-[#7A7A7A]'>(ตัวกรอง: ประเทศไทย, 2562-2566)</span>
					</Typography>
				</Toolbar>
				<TableContainer>
					<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size={dense ? 'small' : 'medium'}>
						<TableHead>
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
											{row.name}
										</TableCell>
										<TableCell align='right'>{row.calories}</TableCell>
										<TableCell align='right'>{row.fat}</TableCell>
										<TableCell align='right'>{row.carbs}</TableCell>
										<TableCell align='right'>{row.protein}</TableCell>
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
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component='div'
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
			{/* <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label='Dense padding' /> */}
		</Box>
	)
}
