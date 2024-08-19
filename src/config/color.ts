
export const Boundary = {
	green: '#38A700',
	gray: '#E2E2E2'
	 
}

export const LossTypeColor = {
	total: '#B23B56',
	noData: '#38A700',
	drought: '#E34A33',
	flood: '#3182BD',
	rnr: '#38A700',
}

export const LossTypeIconColor = {
	drought: '#FC8E59',
	flood: '#6BAED6',
}

export const TextColor = {
	text1: '#575757',
	text2: '#9F1853',
}

export const SummaryBarChartColor = {
	plant: {
		type1: '#5F5F5F',
		type2: '#9F9F9F',
		type3: '#B23B56',
		type4: '#E5B2BD',
	},
	rice: {
		type1: '#5F5F5F',
		type2: '#B23B56',
	},
	loss: {
		type1: '#5F5F5F',
		type2: '#B23B56',
		type3: '#B23B56',
	},
}

export const SummaryLineChartColor = {
	...SummaryBarChartColor,
	...{
		loss: {
			noData: '#5F5F5F',
			drought: '#E34A33',
			flood: '#3182BD',
		},
	},
}

export const TotalTileColor: { [key: string]: [number, number, number, number] } = {
	default: [226, 226, 226, 100],
	level1: [242, 216, 222, 255],
	level2: [229, 178, 189, 255],
	level3: [212, 127, 146, 255],
	level4: [178, 59, 86, 255],
	level5: [114, 38, 55, 255],
}

export const DroughtTileColor: { [key: string]: [number, number, number, number] } = {
	default: [226, 226, 226, 100],
	level1: [255, 239, 217, 255],
	level2: [253, 204, 138, 255],
	level3: [252, 142, 89, 255],
	level4: [227, 74, 51, 255],
	level5: [179, 1, 0, 255],
}

export const FloodTileColor: { [key: string]: [number, number, number, number] } = {
	default: [226, 226, 226, 100],
	level1: [239, 243, 255, 255],
	level2: [189, 215, 231, 255],
	level3: [107, 174, 214, 255],
	level4: [49, 130, 189, 255],
	level5: [8, 81, 156, 255],
}

export const TileLayerColor = {
	disabled: '#E2E2E2',
	flood: '#3182BD',
	drought: '#E34A33',
	rice: '#38A700',
}

export const TotalRangeColor = {
	start: '#F2D8DE',
	end: '#722637',
}

export const DroughtRangeColor = {
	start: '#FFEFD9',
	end: '#B30100',
}

export const FloodRangeColor = {
	start: '#EFF3FF',
	end: '#08519C',
}
