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
import { useTranslation } from 'react-i18next'
import { useSwitchLanguage } from '@/i18n/client'
import { Language, SortType } from '@/enum'
import { ResponseLanguage } from '@/api/interface'
import useAreaUnit from '@/store/area-unit'
import useAreaType from '@/store/area-type'
import useResponsive from '@/hook/responsive'

// Response
const response = {
	data: [
		{
			id: '30',
			name: {
				th: 'นครราชสีมา',
				en: 'Nakhon Ratchasima',
			},
			areas: [
				{
					column: {
						th: 'พื้นที่ขึ้นทะเบียนทั้งหมด',
						en: 'Total registration area',
					},
					areaRai: 3500000,
					areaPlot: 40000,
				},
				{
					column: {
						th: 'พื้นที่ขึ้นทะเบียนทั้งหมดที่มีขอบแปลง',
						en: 'Total registration area with boundary',
					},
					areaRai: 1750000,
					areaPlot: 20000,
				},
				{
					column: {
						th: 'พื้นที่เอาประกัน',
						en: 'Total claim area',
					},
					areaRai: 2500000,
					areaPlot: 30000,
				},
				{
					column: {
						th: 'พื้นที่เอาประกันที่มีขอบแปลง',
						en: 'Total claim area with boundary',
					},
					areaRai: 2250000,
					areaPlot: 25000,
				},
			],
		},
		{
			id: '31',
			name: {
				th: 'พระนครศรีอยุธยา',
				en: 'Phra Nakhon Si Ayutthaya',
			},
			areas: [
				{
					column: {
						th: 'พื้นที่ขึ้นทะเบียนทั้งหมด',
						en: 'Total registration area',
					},
					areaRai: 1680000,
					areaPlot: 40000,
				},
				{
					column: {
						th: 'พื้นที่ขึ้นทะเบียนทั้งหมดที่มีขอบแปลง',
						en: 'Total registration area with boundary',
					},
					areaRai: 840000,
					areaPlot: 20000,
				},
				{
					column: {
						th: 'พื้นที่เอาประกัน',
						en: 'Total claim area',
					},
					areaRai: 1200000,
					areaPlot: 30000,
				},
				{
					column: {
						th: 'พื้นที่เอาประกันที่มีขอบแปลง',
						en: 'Total claim area with boundary',
					},
					areaRai: 1080000,
					areaPlot: 25000,
				},
			],
		},
		{
			id: '32',
			name: {
				th: 'พระนครศรีอยุธยา',
				en: 'Phra Nakhon Si Ayutthaya',
			},
			areas: [
				{
					column: {
						th: 'พื้นที่ขึ้นทะเบียนทั้งหมด',
						en: 'Total registration area',
					},
					areaRai: 1680000,
					areaPlot: 40000,
				},
				{
					column: {
						th: 'พื้นที่ขึ้นทะเบียนทั้งหมดที่มีขอบแปลง',
						en: 'Total registration area with boundary',
					},
					areaRai: 840000,
					areaPlot: 20000,
				},
				{
					column: {
						th: 'พื้นที่เอาประกัน',
						en: 'Total claim area',
					},
					areaRai: 1200000,
					areaPlot: 30000,
				},
				{
					column: {
						th: 'พื้นที่เอาประกันที่มีขอบแปลง',
						en: 'Total claim area with boundary',
					},
					areaRai: 1080000,
					areaPlot: 25000,
				},
			],
		},
		{
			id: '33',
			name: {
				th: 'พระนครศรีอยุธยา',
				en: 'Phra Nakhon Si Ayutthaya',
			},
			areas: [
				{
					column: {
						th: 'พื้นที่ขึ้นทะเบียนทั้งหมด',
						en: 'Total registration area',
					},
					areaRai: 1680000,
					areaPlot: 40000,
				},
				{
					column: {
						th: 'พื้นที่ขึ้นทะเบียนทั้งหมดที่มีขอบแปลง',
						en: 'Total registration area with boundary',
					},
					areaRai: 840000,
					areaPlot: 20000,
				},
				{
					column: {
						th: 'พื้นที่เอาประกัน',
						en: 'Total claim area',
					},
					areaRai: 1200000,
					areaPlot: 30000,
				},
				{
					column: {
						th: 'พื้นที่เอาประกันที่มีขอบแปลง',
						en: 'Total claim area with boundary',
					},
					areaRai: 1080000,
					areaPlot: 25000,
				},
			],
		},
		{
			id: '34',
			name: {
				th: 'พระนครศรีอยุธยา',
				en: 'Phra Nakhon Si Ayutthaya',
			},
			areas: [
				{
					column: {
						th: 'พื้นที่ขึ้นทะเบียนทั้งหมด',
						en: 'Total registration area',
					},
					areaRai: 1680000,
					areaPlot: 40000,
				},
				{
					column: {
						th: 'พื้นที่ขึ้นทะเบียนทั้งหมดที่มีขอบแปลง',
						en: 'Total registration area with boundary',
					},
					areaRai: 840000,
					areaPlot: 20000,
				},
				{
					column: {
						th: 'พื้นที่เอาประกัน',
						en: 'Total claim area',
					},
					areaRai: 1200000,
					areaPlot: 30000,
				},
				{
					column: {
						th: 'พื้นที่เอาประกันที่มีขอบแปลง',
						en: 'Total claim area with boundary',
					},
					areaRai: 1080000,
					areaPlot: 25000,
				},
			],
		},
		{
			id: '35',
			name: {
				th: 'พระนครศรีอยุธยา',
				en: 'Phra Nakhon Si Ayutthaya',
			},
			areas: [
				{
					column: {
						th: 'พื้นที่ขึ้นทะเบียนทั้งหมด',
						en: 'Total registration area',
					},
					areaRai: 1680000,
					areaPlot: 40000,
				},
				{
					column: {
						th: 'พื้นที่ขึ้นทะเบียนทั้งหมดที่มีขอบแปลง',
						en: 'Total registration area with boundary',
					},
					areaRai: 840000,
					areaPlot: 20000,
				},
				{
					column: {
						th: 'พื้นที่เอาประกัน',
						en: 'Total claim area',
					},
					areaRai: 1200000,
					areaPlot: 30000,
				},
				{
					column: {
						th: 'พื้นที่เอาประกันที่มีขอบแปลง',
						en: 'Total claim area with boundary',
					},
					areaRai: 1080000,
					areaPlot: 25000,
				},
			],
		},
		{
			id: '36',
			name: {
				th: 'พระนครศรีอยุธยา',
				en: 'Phra Nakhon Si Ayutthaya',
			},
			areas: [
				{
					column: {
						th: 'พื้นที่ขึ้นทะเบียนทั้งหมด',
						en: 'Total registration area',
					},
					areaRai: 1680000,
					areaPlot: 40000,
				},
				{
					column: {
						th: 'พื้นที่ขึ้นทะเบียนทั้งหมดที่มีขอบแปลง',
						en: 'Total registration area with boundary',
					},
					areaRai: 840000,
					areaPlot: 20000,
				},
				{
					column: {
						th: 'พื้นที่เอาประกัน',
						en: 'Total claim area',
					},
					areaRai: 1200000,
					areaPlot: 30000,
				},
				{
					column: {
						th: 'พื้นที่เอาประกันที่มีขอบแปลง',
						en: 'Total claim area with boundary',
					},
					areaRai: 1080000,
					areaPlot: 25000,
				},
			],
		},
		{
			id: '37',
			name: {
				th: 'พระนครศรีอยุธยา',
				en: 'Phra Nakhon Si Ayutthaya',
			},
			areas: [
				{
					column: {
						th: 'พื้นที่ขึ้นทะเบียนทั้งหมด',
						en: 'Total registration area',
					},
					areaRai: 1680000,
					areaPlot: 40000,
				},
				{
					column: {
						th: 'พื้นที่ขึ้นทะเบียนทั้งหมดที่มีขอบแปลง',
						en: 'Total registration area with boundary',
					},
					areaRai: 840000,
					areaPlot: 20000,
				},
				{
					column: {
						th: 'พื้นที่เอาประกัน',
						en: 'Total claim area',
					},
					areaRai: 1200000,
					areaPlot: 30000,
				},
				{
					column: {
						th: 'พื้นที่เอาประกันที่มีขอบแปลง',
						en: 'Total claim area with boundary',
					},
					areaRai: 1080000,
					areaPlot: 25000,
				},
			],
		},
	],
}

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

interface Data {
	id: string
	name: ResponseLanguage
	totalRegistrationArea: {
		areaRai: number
		areaPlot: number
	}
	totalRegistrationAreaBoundaries: {
		areaRai: number
		areaPlot: number
	}
	totalClaimArea: {
		areaRai: number
		areaPlot: number
	}
	totalClaimAreaBoundaries: {
		areaRai: number
		areaPlot: number
	}
	order: number
}
interface HeadCell {
	disablePadding: boolean
	id: keyof Data
	label: string
	numeric: boolean
	sortable: boolean
}

const headCells: readonly HeadCell[] = [
	{
		id: 'name',
		numeric: false,
		disablePadding: true,
		label: 'พื้นที่',
		sortable: false,
	},
	{
		id: 'totalRegistrationArea',
		numeric: true,
		disablePadding: false,
		label: 'พื้นที่ขึ้นทะเบียนทั้งหมด',
		sortable: true,
	},
	{
		id: 'totalRegistrationAreaBoundaries',
		numeric: true,
		disablePadding: false,
		label: 'พื้นที่ขึ้นทะเบียนที่มีขอบแปลง',
		sortable: true,
	},
	{
		id: 'totalClaimArea',
		numeric: true,
		disablePadding: false,
		label: 'พื้นที่เอาประกัน',
		sortable: true,
	},
	{
		id: 'totalClaimAreaBoundaries',
		numeric: true,
		disablePadding: false,
		label: 'พื้นที่เอาประกันที่มีขอบแปลง',
		sortable: true,
	},
]

interface PlantStatisticTableProps {
	plantTableData?: any[]
}

const PlantStatisticTable: React.FC<PlantStatisticTableProps> = ({ plantTableData }) => {
	const { isDesktop } = useResponsive()
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['default'])
	const language = i18n.language as keyof ResponseLanguage

	const [order, setOrder] = React.useState<SortType>(SortType.DESC)
	const [orderBy, setOrderBy] = React.useState<keyof Data>('totalRegistrationArea')
	const [dense, setDense] = React.useState(false)
	const [tableData, setTableData] = React.useState<any[]>([]) // change from any to dto out

	const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
		// console.log('sorting :: ', property)
		handleRequestSort(event, property)
	}
	const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
		const isAsc = orderBy === property && order === SortType.ASC
		setOrder(isAsc ? SortType.DESC : SortType.ASC)
		setOrderBy(property)
	}

	React.useEffect(() => {
		if (plantTableData) {
			// init state of table sort at totalRegistrationArea
			const tmpArr: Data[] = []
			plantTableData.forEach((data) => {
				tmpArr.push({
					id: data.id,
					name: data.name,
					totalRegistrationArea: data.areas[0],
					totalRegistrationAreaBoundaries: data.areas[1],
					totalClaimArea: data.areas[2],
					totalClaimAreaBoundaries: data.areas[3],
					order: 0,
				})
			})
			tmpArr.sort((a, b) => b.totalRegistrationArea[areaUnit] - a.totalRegistrationArea[areaUnit])

			let currRank = 1
			tmpArr[0].order = currRank
			for (let i = 1; i < tmpArr.length; i++) {
				if (tmpArr[i].totalRegistrationArea[areaUnit] === tmpArr[i - 1].totalRegistrationArea[areaUnit]) {
					tmpArr[i].order = currRank
				} else {
					currRank = i + 1
					tmpArr[i].order = currRank
				}
			}

			setTableData(tmpArr)
		}
	}, [plantTableData])

	const filterOrder = React.useMemo(() => {
		const filter = {
			sort: orderBy || 'totalRegistrationArea',
			sortType: order || SortType.DESC,
		}
		return filter
	}, [areaType, orderBy, order])

	const rows = React.useMemo(() => {
		const data = tableData
		// console.log('sorting data :: ', data, filterOrder, areaUnit)
		data?.sort((a, b) => {
			return filterOrder.sortType === SortType.ASC
				? a[filterOrder?.sort][areaUnit] - b[filterOrder?.sort][areaUnit]
				: b[filterOrder?.sort][areaUnit] - a[filterOrder?.sort][areaUnit]
		})

		let rowNum = 1

		for (let i = 0; i < (data?.length || 0); i++) {
			if (i === 0) {
				data[i].order = 1
			} else {
				if (
					filterOrder.sortType === SortType.ASC
						? data[i]?.[filterOrder?.sort][areaUnit] > data?.[i - 1]?.[filterOrder?.sort][areaUnit]
						: data[i]?.[filterOrder?.sort][areaUnit] < data?.[i - 1]?.[filterOrder?.sort][areaUnit]
				) {
					rowNum = rowNum + 1
				} else {
					rowNum
				}
				data[i].order = rowNum
			}
		}
		return data || []
	}, [tableData, filterOrder, areaUnit])

	// const visibleRows = React.useMemo(() => stableSort(tableData, getComparator(order, orderBy)), [order, orderBy])

	return (
		<Box sx={{ width: '100%' }}>
			<Paper sx={{ width: '100%' }}>
				<Toolbar>
					<Typography className='text-md font-semibold' id='tableTitle' component='div'>
						{/* Dynamic Depends on AppBar */}
						อันดับผลรวมข้อมูลทั้งหมด (ไร่){' '}
						<span className='text-sm font-normal text-[#7A7A7A]'>(ตัวกรอง: ประเทศไทย, 2562-2566)</span>
					</Typography>
				</Toolbar>
				<Box className='flex h-[70vh] flex-col gap-[16px] pl-[24px] pr-[24px]'>
					<TableContainer
						className='flex flex-col overflow-hidden overflow-x-auto'
						sx={{ minHeight: '90%', flex: 1 }}
						component={'div'}
					>
						<Table aria-labelledby='tableTitle' size={dense ? 'small' : 'medium'}>
							<TableHead>
								<TableRow>
									{headCells.map((headCell) => {
										const isSorted = orderBy === headCell.id
										return headCell.sortable ? (
											<TableCell
												key={headCell.id}
												align={'right'}
												padding={headCell.disablePadding ? 'none' : 'normal'}
												sortDirection={orderBy === headCell.id ? order : false}
												sx={{
													backgroundColor: isSorted ? '#F8FAFD' : 'inherit',
												}}
											>
												<TableSortLabel
													active={orderBy === headCell.id}
													direction={orderBy === headCell.id ? order : SortType.ASC}
													onClick={createSortHandler(headCell.id)}
													className='flex-row'
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
										) : (
											<TableCell
												key={headCell.id}
												align={'left'}
												padding={headCell.disablePadding ? 'none' : 'normal'}
												sortDirection={orderBy === headCell.id ? order : false}
												sx={{ borderRight: '1px solid rgb(224, 224, 224)' }}
											>
												{headCell.label}
											</TableCell>
										)
									})}
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.map((row, index) => {
									return (
										<TableRow hover={false} tabIndex={-1} key={row.id}>
											<TableCell
												component='th'
												scope='row'
												padding='none'
												sx={{ borderRight: '1px solid rgb(224, 224, 224)' }}
											>
												<span>
													{row.order} {row.name[i18n.language]}
												</span>
											</TableCell>
											<TableCell
												align='right'
												sx={{
													backgroundColor:
														orderBy === 'totalRegistrationArea' ? '#F8FAFD' : 'inherit',
												}}
											>
												{row.totalRegistrationArea[areaUnit]}
											</TableCell>
											<TableCell
												align='right'
												sx={{
													backgroundColor:
														orderBy === 'totalRegistrationAreaBoundaries'
															? '#F8FAFD'
															: 'inherit',
												}}
											>
												{row.totalRegistrationAreaBoundaries[areaUnit]}
											</TableCell>
											<TableCell
												align='right'
												sx={{
													backgroundColor:
														orderBy === 'totalClaimArea' ? '#F8FAFD' : 'inherit',
												}}
											>
												{row.totalClaimArea[areaUnit]}
											</TableCell>
											<TableCell
												align='right'
												sx={{
													backgroundColor:
														orderBy === 'totalClaimAreaBoundaries' ? '#F8FAFD' : 'inherit',
												}}
											>
												{row.totalClaimAreaBoundaries[areaUnit]}
											</TableCell>
										</TableRow>
									)
								})}
							</TableBody>
						</Table>
					</TableContainer>
				</Box>
			</Paper>
		</Box>
	)
}
export default PlantStatisticTable
