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
import { ResponseArea, ResponseLanguage } from '@/api/interface'
import useAreaUnit from '@/store/area-unit'
import useAreaType from '@/store/area-type'
import useResponsive from '@/hook/responsive'
import { dataAreas } from '@/api/annual-analysis/dto-out.dto'
import { TextColor } from '@/config/color'

interface Data {
	id: string
	name: ResponseLanguage
	totalActArea: ResponseArea // is data for each row of the first columns totalActArea is in Grey, first line
	totalPredictedRiceArea: ResponseArea // is data for each row of the first columns totalPredictedRiceArea is in Red, second line
	actAreas: dataAreas[] // is data for each year columns except the first, need dynamic, actAreas is in Grey on the first line
	predictedRiceAreas: dataAreas[] // is data for each year columns except the first, need to be dynamic, predictedRiceAreas is in Red, second line
	order: number
}

interface HeadCell {
	disablePadding: boolean
	id: keyof Data
	label: string
	numeric: boolean
	sortable: boolean
}

type CellType = {
	order: number
	name: ResponseLanguage
	actAreas: {
		column: ResponseLanguage
		areaRai: number
		areaPlot: number
	}
	predictedRiceAreas: {
		column: ResponseLanguage
		areaRai: number
		areaPlot: number
	}
}
interface RiceStatisticTableProps {
	riceTableData?: any[]
}

const RiceStatisticTable: React.FC<RiceStatisticTableProps> = ({ riceTableData }) => {
	const { isDesktop } = useResponsive()
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['default'])
	const id = React.useId()
	const language = i18n.language as keyof ResponseLanguage
	const [order, setOrder] = React.useState<SortType>(SortType.DESC)
	const [orderBy, setOrderBy] = React.useState<keyof Data>('totalActArea')
	const [dense, setDense] = React.useState(false)
	const [tableHead, setTableHead] = React.useState<HeadCell[]>([])
	const [tableData, setTableData] = React.useState<any[]>([]) // change from any to dto out

	const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
		handleRequestSort(event, property)
	}
	const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
		const isAsc = orderBy === property && order === SortType.ASC
		setOrder(isAsc ? SortType.DESC : SortType.ASC)
		setOrderBy(property)
	}

	React.useEffect(() => {
		if (riceTableData) {
			// init state of table || when language change or areaUnit change
			const tmpArr: any[] = []
			/* 
                for each row riceTableData should be processed such as follows
                example with 1 row
                [
                    {
                        id: data.id,
                        name: data.name // or possibly data years the first one will be name
                        order: 0
                    },
                    {
                        id: "totalActPredicted",
                        name: "totalActPredicted"
                        totalActArea : {
                            areaRai : number,
                            areaPlot : number
                        }
                        totalPredictedRiceArea : {
                            areaRai : number,
                            areaPlot : number
                        }
                    },
                    {
                        id : columns : {
                                en : '2020',
                                th : '2563'
                            },
                        name: {
                            columns : {
                                en : '2020',
                                th : '2563'
                            }
                        }
                        act : {
                            areaRai : number
                            areaPlot : number
                        }
                        predicted : {
                            areaRai: number
                            areaPlot : number
                        }
                    } . . .
                ]
            */
			// init table rows data
			console.log('riceTableData :: ', riceTableData)
			riceTableData.forEach((data) => {
				const tmpRow: any[] = []
				tmpRow.push({
					id: data.id,
					name: data.name,
					order: 0,
				})
				tmpRow.push({
					id: 'totalActPredicted',
					name: 'totalActPredicted',
					actAreas: data.totalActArea,
					predictedRiceAreas: data.totalPredictedRiceArea,
				})
				for (let i = 0; i < data.actAreas.length; i++) {
					tmpRow.push({
						id: data.actAreas[i].column[language],
						name: data.actAreas[i].column[language],
						actAreas: data.actAreas[i],
						predictedRiceAreas: data.predictedRiceAreas[i],
					})
				}
				tmpArr.push(tmpRow)
			})
			console.log('tmpArr :: ', tmpArr)
			// init table heads
			const tmpHead: any[] = []
			tmpHead.push({
				id: 'name',
				numeric: false,
				disablePadding: true,
				label: 'พื้นที่',
				sortable: false,
			})
			tmpHead.push({
				id: 'totalActPredicted',
				numeric: true,
				disablePadding: false,
				label: 'ผลรวม การวิเคราะห์',
				sortable: true,
			})
			for (let i = 0; i < riceTableData[0].actAreas.length; i++) {
				tmpHead.push({
					id: riceTableData[0].actAreas[i].column[language],
					numeric: true,
					disablePadding: false,
					label: riceTableData[0].actAreas[i].column[language],
					sortable: false,
				})
			}
			console.log('tmpHead :: ', tmpHead)
			// tmpArr.sort((a, b) => b.totalActArea[areaUnit] - a.totalActArea[areaUnit])

			// let currRank = 1
			// tmpArr[0].order = currRank
			// for (let i = 1; i < tmpArr.length; i++) {
			// 	if (tmpArr[i].totalActArea[areaUnit] === tmpArr[i - 1].totalActArea[areaUnit]) {
			// 		tmpArr[i].order = currRank
			// 	} else {
			// 		currRank = i + 1
			// 		tmpArr[i].order = currRank
			// 	}
			// }
			setTableHead(tmpHead)
			setTableData(tmpArr)
		}
	}, [riceTableData, language, areaUnit])

	const filterOrder = React.useMemo(() => {
		const filter = {
			sort: orderBy || 'totalActArea',
			sortType: order || SortType.DESC,
		}
		return filter
	}, [areaType, orderBy, order])

	const rows = React.useMemo(() => {
		const data = tableData
		console.log('rows :: ', data)
		// console.log('sorting data :: ', data, filterOrder, areaUnit)
		// data?.sort((a, b) => {
		// 	return filterOrder.sortType === SortType.ASC
		// 		? a[filterOrder?.sort][areaUnit] - b[filterOrder?.sort][areaUnit]
		// 		: b[filterOrder?.sort][areaUnit] - a[filterOrder?.sort][areaUnit]
		// })

		// let rowNum = 1

		// for (let i = 0; i < (data?.length || 0); i++) {
		// 	if (i === 0) {
		// 		data[i].order = 1
		// 	} else {
		// 		if (
		// 			filterOrder.sortType === SortType.ASC
		// 				? data[i]?.[filterOrder?.sort][areaUnit] > data?.[i - 1]?.[filterOrder?.sort][areaUnit]
		// 				: data[i]?.[filterOrder?.sort][areaUnit] < data?.[i - 1]?.[filterOrder?.sort][areaUnit]
		// 		) {
		// 			rowNum = rowNum + 1
		// 		} else {
		// 			rowNum
		// 		}
		// 		data[i].order = rowNum
		// 	}
		// }
		return data || []
	}, [tableData, filterOrder, areaUnit])

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
									{tableHead &&
										tableHead.map((headCell) => {
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
													align={headCell.id === 'name' ? 'left' : 'right'}
													padding={headCell.disablePadding ? 'none' : 'normal'}
													sortDirection={orderBy === headCell.id ? order : false}
													sx={{
														borderRight:
															headCell.id === 'name'
																? '1px solid rgb(224, 224, 224)'
																: '',
													}}
												>
													{headCell.label}
												</TableCell>
											)
										})}
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.map((row, rowIndex) => (
									<TableRow key={rowIndex}>
										{row.map((cell: CellType, cellIndex: number) => (
											<TableCell
												key={cellIndex}
												component={cellIndex === 0 ? 'th' : 'td'}
												scope={cellIndex === 0 ? 'row' : undefined}
												padding='none'
												rowSpan={2}
												align={cellIndex === 0 ? 'left' : 'right'}
												sx={{
													borderRight: cellIndex === 0 ? '1px solid rgb(224, 224, 224)' : '',
												}}
											>
												{cellIndex === 0 ? (
													<>
														{cell.order} {cell.name[language]}
													</>
												) : (
													<>
														<span>{cell.actAreas[areaUnit].toLocaleString()}</span>
														<br />
														<span className={`text-[#9F1853]`}>
															{cell.predictedRiceAreas[areaUnit].toLocaleString()}
														</span>
													</>
												)}
											</TableCell>
										))}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Box>
			</Paper>
		</Box>
	)
}
export default RiceStatisticTable
