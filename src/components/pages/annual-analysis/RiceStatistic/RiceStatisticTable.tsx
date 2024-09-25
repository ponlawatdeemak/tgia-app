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
import { bar } from 'billboard.js'
import { useSelectOption } from '../Main/context'
import clsx from 'clsx'

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

// const mockResp = [
// 	{
// 		id: '36',
// 		name: {
// 			th: 'นครราชสีมา A',
// 			en: 'Nakhon Ratchasima',
// 		},
// 		totalActArea: {
// 			areaRai: 2132325,
// 			areaPlot: 20000,
// 		},
// 		totalPredictedRiceArea: {
// 			areaRai: 200000,
// 			areaPlot: 50000,
// 		},
// 		actAreas: [
// 			{
// 				column: {
// 					th: '2562',
// 					en: '2019',
// 				},
// 				areaRai: 2250001,
// 				areaPlot: 2132325,
// 			},
// 			{
// 				column: {
// 					th: '2563',
// 					en: '2020',
// 				},
// 				areaRai: 2500000,
// 				areaPlot: 2500000,
// 			},
// 			{
// 				column: {
// 					th: '2564',
// 					en: '2021',
// 				},
// 				areaRai: 2500000,
// 				areaPlot: 2500000,
// 			},
// 			{
// 				column: {
// 					th: '2565',
// 					en: '2022',
// 				},
// 				areaRai: 2500000,
// 				areaPlot: 2500000,
// 			},
// 			{
// 				column: {
// 					th: '2566',
// 					en: '2023',
// 				},
// 				areaRai: 2500000,
// 				areaPlot: 2500000,
// 			},
// 		],
// 		predictedRiceAreas: [
// 			{
// 				column: {
// 					th: '2562',
// 					en: '2019',
// 				},
// 				areaRai: 2132325,
// 				areaPlot: 2002500,
// 			},
// 			{
// 				column: {
// 					th: '2563',
// 					en: '2020',
// 				},
// 				areaRai: 2500000,
// 				areaPlot: 2925000,
// 			},
// 			{
// 				column: {
// 					th: '2564',
// 					en: '2021',
// 				},
// 				areaRai: 2500000,
// 				areaPlot: 2925000,
// 			},
// 			{
// 				column: {
// 					th: '2565',
// 					en: '2022',
// 				},
// 				areaRai: 2500000,
// 				areaPlot: 2925000,
// 			},
// 			{
// 				column: {
// 					th: '2566',
// 					en: '2023',
// 				},
// 				areaRai: 2500000,
// 				areaPlot: 2925000,
// 			},
// 		],
// 	},
// 	{
// 		id: '37',
// 		name: {
// 			th: 'นครราชสีมา B',
// 			en: 'Nakhon Ratchasima',
// 		},
// 		totalActArea: {
// 			areaRai: 2132326,
// 			areaPlot: 20000,
// 		},
// 		totalPredictedRiceArea: {
// 			areaRai: 200000,
// 			areaPlot: 50000,
// 		},
// 		actAreas: [
// 			{
// 				column: {
// 					th: '2562',
// 					en: '2019',
// 				},
// 				areaRai: 2250002,
// 				areaPlot: 2132325,
// 			},
// 			{
// 				column: {
// 					th: '2563',
// 					en: '2020',
// 				},
// 				areaRai: 2500000,
// 				areaPlot: 2500000,
// 			},
// 			{
// 				column: {
// 					th: '2564',
// 					en: '2021',
// 				},
// 				areaRai: 2500000,
// 				areaPlot: 2500000,
// 			},
// 			{
// 				column: {
// 					th: '2565',
// 					en: '2022',
// 				},
// 				areaRai: 2500000,
// 				areaPlot: 2500000,
// 			},
// 			{
// 				column: {
// 					th: '2566',
// 					en: '2023',
// 				},
// 				areaRai: 2500000,
// 				areaPlot: 2500000,
// 			},
// 		],
// 		predictedRiceAreas: [
// 			{
// 				column: {
// 					th: '2562',
// 					en: '2019',
// 				},
// 				areaRai: 2132325,
// 				areaPlot: 2002500,
// 			},
// 			{
// 				column: {
// 					th: '2563',
// 					en: '2020',
// 				},
// 				areaRai: 2500000,
// 				areaPlot: 2925000,
// 			},
// 			{
// 				column: {
// 					th: '2564',
// 					en: '2021',
// 				},
// 				areaRai: 2500000,
// 				areaPlot: 2925000,
// 			},
// 			{
// 				column: {
// 					th: '2565',
// 					en: '2022',
// 				},
// 				areaRai: 2500000,
// 				areaPlot: 2925000,
// 			},
// 			{
// 				column: {
// 					th: '2566',
// 					en: '2023',
// 				},
// 				areaRai: 2500000,
// 				areaPlot: 2925000,
// 			},
// 		],
// 	},
// 	{
// 		id: '38',
// 		name: {
// 			th: 'นครราชสีมา C',
// 			en: 'Nakhon Ratchasima',
// 		},
// 		totalActArea: {
// 			areaRai: 2132327,
// 			areaPlot: 20000,
// 		},
// 		totalPredictedRiceArea: {
// 			areaRai: 200000,
// 			areaPlot: 50000,
// 		},
// 		actAreas: [
// 			{
// 				column: {
// 					th: '2562',
// 					en: '2019',
// 				},
// 				areaRai: 2250003,
// 				areaPlot: 2132325,
// 			},
// 			{
// 				column: {
// 					th: '2563',
// 					en: '2020',
// 				},
// 				areaRai: 2500000,
// 				areaPlot: 2500000,
// 			},
// 			{
// 				column: {
// 					th: '2564',
// 					en: '2021',
// 				},
// 				areaRai: 2500000,
// 				areaPlot: 2500000,
// 			},
// 			{
// 				column: {
// 					th: '2565',
// 					en: '2022',
// 				},
// 				areaRai: 2500000,
// 				areaPlot: 2500000,
// 			},
// 			{
// 				column: {
// 					th: '2566',
// 					en: '2023',
// 				},
// 				areaRai: 2500000,
// 				areaPlot: 2500000,
// 			},
// 		],
// 		predictedRiceAreas: [
// 			{
// 				column: {
// 					th: '2562',
// 					en: '2019',
// 				},
// 				areaRai: 2132325,
// 				areaPlot: 2002500,
// 			},
// 			{
// 				column: {
// 					th: '2563',
// 					en: '2020',
// 				},
// 				areaRai: 2500000,
// 				areaPlot: 2925000,
// 			},
// 			{
// 				column: {
// 					th: '2564',
// 					en: '2021',
// 				},
// 				areaRai: 2500000,
// 				areaPlot: 2925000,
// 			},
// 			{
// 				column: {
// 					th: '2565',
// 					en: '2022',
// 				},
// 				areaRai: 2500000,
// 				areaPlot: 2925000,
// 			},
// 			{
// 				column: {
// 					th: '2566',
// 					en: '2023',
// 				},
// 				areaRai: 2500000,
// 				areaPlot: 2925000,
// 			},
// 		],
// 	},
// ]

const RiceStatisticTable: React.FC<RiceStatisticTableProps> = ({ riceTableData }) => {
	const { isDesktop } = useResponsive()
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['default'])
	const { selectOption, setSelectOption } = useSelectOption()

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
                        id: "totalActArea",
                        name: "totalActArea"
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
			riceTableData.forEach((data) => {
				const tmpRow: any[] = []
				tmpRow.push({
					id: data.id,
					name: data.name,
					order: 0,
				})
				tmpRow.push({
					id: 'totalActArea',
					name: 'totalActArea',
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
				id: 'totalActArea',
				numeric: true,
				disablePadding: false,
				label: t('totalAnalysis', { ns: 'annual-analysis' }),
				sortable: true,
			})
			for (let i = 0; i < riceTableData[0].actAreas.length; i++) {
				tmpHead.push({
					id: riceTableData[0].actAreas[i].column[language],
					numeric: true,
					disablePadding: false,
					label: riceTableData[0].actAreas[i].column[language],
					sortable: true,
				})
			}
			tmpArr.sort((a, b) => {
				const aTotalAct = a.find((item: any) => item.id === 'totalActArea')
				const bTotalAct = b.find((item: any) => item.id === 'totalActArea')

				const aArea = aTotalAct?.actAreas?.[areaUnit]
				const bArea = bTotalAct?.actAreas?.[areaUnit]
				return bArea - aArea
			})

			let currRank = 1
			tmpArr[0].find((item: any) => item.id !== 'totalActArea').order = currRank

			for (let i = 1; i < tmpArr.length; i++) {
				const currAct = tmpArr[i].find((item: any) => item.id === 'totalActArea')
				const prevAct = tmpArr[i - 1].find((item: any) => item.id === 'totalActArea')

				const currOrderItem = tmpArr[i].find((item: any) => item.id !== 'totalActArea')

				if (currAct?.actAreas?.areaRai === prevAct?.actAreas?.areaRai) {
					currOrderItem.order = currRank
				} else {
					currRank = i + 1
					currOrderItem.order = currRank
				}
			}
			console.log('tmpArr :: ', tmpArr)
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

		if (data.length > 0) {
			data?.sort((a, b) => {
				const aTotalAct = a.find((item: any) => item.id === filterOrder?.sort)
				const bTotalAct = b.find((item: any) => item.id === filterOrder?.sort)

				const aArea = aTotalAct?.actAreas?.[areaUnit]
				const bArea = bTotalAct?.actAreas?.[areaUnit]
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
						? currAct?.actAreas?.[areaUnit] > prevAct?.actAreas?.[areaUnit]
						: currAct?.actAreas?.[areaUnit] < prevAct?.actAreas?.[areaUnit]
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
								<Typography className='w-full text-md font-semibold'>
									{t('riceCultivationAreaRank', { ns: 'annual-analysis' })} ({t(areaUnit)}){' '}
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
					<TableContainer className='flex flex-col overflow-x-auto overflow-y-auto' component={'div'}>
						<Table
							stickyHeader
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
														'pr-[12px]': !isDesktop,
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
													align={cellIndex === 0 ? 'left' : 'right'}
													className={clsx('', {
														'sticky left-0 border-0 border-b-[1px] border-r-[1px] border-solid border-[#E0E0E0] bg-white pr-[12px]':
															cellIndex === 0,
														'bg-gray-light2': isSorted,
														'[&_.MuiTableCell]:pr-[12px]': !isDesktop,
													})}
												>
													{cellIndex === 0 ? (
														<>
															{cell.order}&nbsp;{cell.name[language]}
														</>
													) : (
														<>
															<span className={'text-black-light'}>
																{cell.actAreas[areaUnit].toLocaleString()}
															</span>
															<br />
															<span className={`text-lossType`}>
																{cell.predictedRiceAreas[areaUnit].toLocaleString()}
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
export default RiceStatisticTable
