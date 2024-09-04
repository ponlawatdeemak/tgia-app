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
	totalDisasterArea: ResponseArea // is data for each row of the first columns totalDisasterArea is in Grey, first line
	totalPredictedArea: ResponseArea // is data for each row of the first columns totalPredictedArea is in Red, second line
	disasterAreas: dataAreas[] // is data for each year columns except the first, need dynamic, disasterAreas is in Grey on the first line
	predictedAreas: dataAreas[] // is data for each year columns except the first, need to be dynamic, predictedAreas is in Red, second line
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
	disasterAreas: {
		column: ResponseLanguage
		areaRai: number
		areaPlot: number
	}
	predictedAreas: {
		column: ResponseLanguage
		areaRai: number
		areaPlot: number
	}
}
interface LossStatisticTableProps {
	lossTableData?: any[]
}

const LossStatisticTable: React.FC<LossStatisticTableProps> = ({ lossTableData }) => {
	const { isDesktop } = useResponsive()
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['default'])
	const id = React.useId()
	const language = i18n.language as keyof ResponseLanguage
	const [order, setOrder] = React.useState<SortType>(SortType.DESC)
	const [orderBy, setOrderBy] = React.useState<keyof Data>('totalDisasterArea')
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
		if (lossTableData) {
			// init state of table || when language change or areaUnit change
			const tmpArr: any[] = []
			/* 
                for each row lossTableData should be processed such as follows
                example with 1 row
                [
                    {
                        id: data.id,
                        name: data.name // or possibly data years the first one will be name
                        order: 0
                    },
                    {
                        id: "totalDisasterArea",
                        name: "totalDisasterArea"
                        totalDisasterArea : {
                            areaRai : number,
                            areaPlot : number
                        }
                        totalPredictedArea : {
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
			console.log('lossTableData :: ', lossTableData)
			lossTableData.forEach((data) => {
				const tmpRow: any[] = []
				tmpRow.push({
					id: data.id,
					name: data.name,
					order: 0,
				})
				tmpRow.push({
					id: 'totalDisasterArea',
					name: 'totalDisasterArea',
					disasterAreas: data.totalDisasterArea,
					predictedAreas: data.totalPredictedArea,
				})
				for (let i = 0; i < data.disasterAreas.length; i++) {
					tmpRow.push({
						id: data.disasterAreas[i].column[language],
						name: data.disasterAreas[i].column[language],
						disasterAreas: data.disasterAreas[i],
						predictedAreas: data.predictedAreas[i],
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
				id: 'totalDisasterArea',
				numeric: true,
				disablePadding: false,
				label: 'ผลรวม การวิเคราะห์',
				sortable: true,
			})
			for (let i = 0; i < lossTableData[0].disasterAreas.length; i++) {
				tmpHead.push({
					id: lossTableData[0].disasterAreas[i].column[language],
					numeric: true,
					disablePadding: false,
					label: lossTableData[0].disasterAreas[i].column[language],
					sortable: true,
				})
			}
			console.log('tmpHead :: ', tmpHead)
			console.log('tmpArr :: ', tmpArr)
			tmpArr.sort((a, b) => {
				const aTotalAct = a.find((item: any) => item.id === 'totalDisasterArea')
				const bTotalAct = b.find((item: any) => item.id === 'totalDisasterArea')

				const aArea = aTotalAct?.actAreas[areaUnit]
				const bArea = bTotalAct?.actAreas[areaUnit]
				return bArea - aArea
			})

			let currRank = 1
			tmpArr[0].find((item: any) => item.id !== 'totalDisasterArea').order = currRank

			for (let i = 1; i < tmpArr.length; i++) {
				const currAct = tmpArr[i].find((item: any) => item.id === 'totalDisasterArea')
				const prevAct = tmpArr[i - 1].find((item: any) => item.id === 'totalDisasterArea')

				const currOrderItem = tmpArr[i].find((item: any) => item.id !== 'totalDisasterArea')

				if (currAct.actAreas.areaRai === prevAct.actAreas.areaRai) {
					currOrderItem.order = currRank
				} else {
					currRank = i + 1
					currOrderItem.order = currRank
				}
			}
			setTableHead(tmpHead)
			setTableData(tmpArr)
		}
	}, [lossTableData, language, areaUnit])

	const filterOrder = React.useMemo(() => {
		const filter = {
			sort: orderBy || 'totalDisasterArea',
			sortType: order || SortType.DESC,
		}
		return filter
	}, [areaType, orderBy, order])

	const rows = React.useMemo(() => {
		const data = tableData
		console.log('rows :: ', data)
		if (data.length > 0) {
			data?.sort((a, b) => {
				const aTotalAct = a.find((item: any) => item.id === filterOrder?.sort)
				const bTotalAct = b.find((item: any) => item.id === filterOrder?.sort)

				const aArea = aTotalAct?.actAreas[areaUnit]
				const bArea = bTotalAct?.actAreas[areaUnit]
				return filterOrder.sortType === SortType.ASC ? aArea - bArea : bArea - aArea
			})

			let rowNum = 1
			data[0].find((item: any) => item.id !== filterOrder?.sort).order = rowNum

			for (let i = 1; i < data.length; i++) {
				const currAct = data[i].find((item: any) => {
					return item.id === filterOrder?.sort
				})
				const prevAct = data[i - 1].find((item: any) => item.id === filterOrder?.sort)

				const currOrderItem = data[i].find((item: any) => item.id !== filterOrder?.sort)
				if (
					filterOrder.sortType === SortType.ASC
						? currAct.actAreas[areaUnit] > prevAct.actAreas[areaUnit]
						: currAct.actAreas[areaUnit] < prevAct.actAreas[areaUnit]
				) {
					rowNum++
				}
				currOrderItem.order = rowNum
			}
		}
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
										{row.map((cell: any, cellIndex: number) => {
											const isSorted = orderBy === cell.name
											return (
												<TableCell
													key={cellIndex}
													component={cellIndex === 0 ? 'th' : 'td'}
													scope={cellIndex === 0 ? 'row' : undefined}
													padding='none'
													rowSpan={2}
													align={cellIndex === 0 ? 'left' : 'right'}
													sx={{
														borderRight:
															cellIndex === 0 ? '1px solid rgb(224, 224, 224)' : '',
														backgroundColor: isSorted ? '#F8FAFD' : 'inherit',
													}}
												>
													{cellIndex === 0 ? (
														<>
															{cell.order} {cell.name[language]}
														</>
													) : (
														<>
															<span>{cell.disasterAreas[areaUnit].toLocaleString()}</span>
															<br />
															<span className={`text-[#9F1853]`}>
																{cell.predictedAreas[areaUnit].toLocaleString()}
															</span>
														</>
													)}
												</TableCell>
											)
										})}
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
export default LossStatisticTable
