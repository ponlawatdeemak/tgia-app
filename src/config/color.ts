
export const Boundary = {
	green: '#38A700',
	gray: '#E2E2E2'
	 
}

export const BoundaryTileColor: { [key: string]: [number, number, number, number] } = {
	default: [0, 0, 0, 0],
	green: [56, 167, 0, 153],
	gray: [226, 226, 226, 217],
}

export const LossTypeColor = {
	total: '#B23B56',
	noData: '#38A700',
	drought: '#E34A33',
	flood: '#3182BD',
	rnr: '#38A700',
}

export const LossTypeTileColor: { [key: string]: [number, number, number, number] } = {
	default: [226, 226, 226, 100],
	drought: [227, 74, 51, 153],
	flood: [49, 130, 189, 153],
	rnr: [56, 167, 0, 153],
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
	level1: [249, 235, 238, 255],
	level2: [242, 216, 222, 255],
	level3: [234, 192, 201, 255],
	level4: [229, 178, 189, 255],
	level5: [218, 146, 161, 255],
	level6: [212, 127, 146, 255],
	level7: [201, 91, 117, 255],
	level8: [178, 59, 86, 255],
	level9: [141, 47, 67, 255],
	level10: [114, 38, 55, 255],
}

export const DroughtTileColor: { [key: string]: [number, number, number, number] } = {
	default: [226, 226, 226, 100],
	level1: [255, 245, 231, 255],
	level2: [255, 239, 217, 255],
	level3: [254, 224, 184, 255],
	level4: [253, 204, 138, 255],
	level5: [252, 172, 132, 255],
	level6: [252, 142, 89, 255],
	level7: [231, 97, 79, 255],
	level8: [227, 74, 51, 255],
	level9: [210, 0, 0, 255],
	level10: [179, 1, 0, 255],
}

export const FloodTileColor: { [key: string]: [number, number, number, number] } = {
	default: [226, 226, 226, 100],
	level1: [251, 252, 255, 255],
	level2: [239, 243, 255, 255],
	level3: [204, 224, 236, 255],
	level4: [189, 215, 231, 255],
	level5: [127, 184, 219, 255],
	level6: [107, 174, 214, 255],
	level7: [69, 148, 207, 255],
	level8: [49, 130, 189, 255],
	level9: [10, 98, 186, 255],
	level10: [8, 81, 156, 255],
}

export const LineWidthColor: { [key: string]: [number, number, number, number] } = {
	default: [110, 110, 110, 255],
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
