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
import { useSelectOption } from '../Main/context'
import clsx from 'clsx'

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
	const { t, i18n } = useTranslation(['default', 'annual-analysis'])
	const { selectOption, setSelectOption } = useSelectOption()

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
			// console.log('lossTableData :: ', lossTableData)
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
			// console.log('tmpArr :: ', tmpArr)
			// init table heads
			const tmpHead: any[] = []
			tmpHead.push({
				id: 'name',
				numeric: false,
				disablePadding: true,
				label: t('area', { ns: 'annual-analysis' }),
				sortable: false,
			})
			tmpHead.push({
				id: 'totalDisasterArea',
				numeric: true,
				disablePadding: false,
				label: t('totalAnalysis', { ns: 'annual-analysis' }),
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
			// console.log('tmpHead :: ', tmpHead)
			// console.log('tmpArr :: ', tmpArr)
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
		// console.log('rows :: ', data)
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

	const filterString = (selectOption: any) => {
		let tmpStr = ''
		if (selectOption?.name) {
			tmpStr += selectOption.name[language]
		} else {
			tmpStr += language === 'en' ? 'Thailand' : 'ประเทศไทย'
		}
		tmpStr += ', '
		tmpStr += language === 'en' ? 'Year: ' : 'ปี: '
		if (selectOption?.selectedYear) {
			tmpStr += selectOption.selectedYear
		} else {
			tmpStr += language === 'en' ? 'All' : 'ทั้งหมด'
		}
		// console.log('selectOption :: ', selectOption)
		return tmpStr
	}

	return (
		<Box className='w-full'>
			<Paper className='w-full'>
				<Toolbar
					className={clsx('', {
						'py-[16px]': !isDesktop,
					})}
				>
					<Typography className='w-full text-md font-semibold' id='tableTitle' component='div'>
						{/* Dynamic Depends on AppBar */}
						<Box
							className={clsx('flex gap-[12px]', {
								'flex-col items-start': !isDesktop,
								'items-center justify-between': isDesktop,
							})}
						>
							<Box className='flex flex-row'>
								<Typography className='text-md font-semibold'>
									{t('damageAreaRank', { ns: 'annual-analysis' })} ({t(areaUnit)}){' '}
									<span className='text-sm font-normal text-[#7A7A7A]'>
										{!isDesktop && <br />}({t('filter', { ns: 'annual-analysis' })}:{' '}
										{filterString(selectOption)})
									</span>
								</Typography>
							</Box>
							<Box
								className={clsx('flex flex-row gap-1', {
									'flex-col': !isDesktop,
								})}
							>
								<Box
									className={`flex h-[28px] flex-row items-center text-ellipsis rounded-xl bg-gray-light2 pl-[8px] pr-[8px] text-base font-medium`}
								>
									<Box className={`mr-[6px] h-[14px] w-[14px] rounded-sm bg-[#9F9F9F]`}></Box>
									<Typography noWrap className='text-base font-medium'>
										{t('damageAccordingGS', { ns: 'annual-analysis' })}
									</Typography>
								</Box>
								<Box
									className={`flex h-[28px] flex-row items-center text-ellipsis rounded-xl bg-gray-light2 pl-[8px] pr-[8px] text-base font-medium`}
								>
									<Box className={`mr-[6px] h-[14px] w-[14px] rounded-sm bg-lossType`}></Box>
									<Typography noWrap className='text-base font-medium'>
										{t('analysisSystemDamage', { ns: 'annual-analysis' })}
									</Typography>
								</Box>
							</Box>
						</Box>
					</Typography>
				</Toolbar>
				<Box className='flex h-[548px] flex-col gap-[16px] pl-[24px] pr-[24px]'>
					<TableContainer className='flex flex-col overflow-hidden overflow-x-auto' component={'div'}>
						<Table
							aria-labelledby='tableTitle'
							size={dense ? 'small' : 'medium'}
							className='border-separate'
						>
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
													className={clsx('inherit', { 'bg-gray-light2': isSorted })}
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
													className={clsx('sticky left-0 z-50 bg-white', {
														'border-0 border-b-[1px] border-r-[1px] border-solid border-[#E0E0E0]':
															headCell.id === 'name',
													})}
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
													// sx={{
													// 	borderRight:
													// 		cellIndex === 0 ? '1px solid rgb(224, 224, 224)' : '',
													// 	backgroundColor: isSorted ? '#F8FAFD' : 'inherit',
													// }}
													className={clsx('', {
														'sticky left-0 border-0 border-b-[1px] border-r-[1px] border-solid border-[#E0E0E0] bg-white pr-[12px]':
															cellIndex === 0,
														'bg-gray-light2': isSorted,
													})}
												>
													{cellIndex === 0 ? (
														<>
															{cell.order}&nbsp;{cell.name[language]}
														</>
													) : (
														<>
															<span className={'text-black-light'}>
																{cell.disasterAreas[areaUnit].toLocaleString()}
															</span>
															<br />
															<span className={`text-lossType`}>
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
