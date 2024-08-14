export const Boundary = {
	green: '#38A700',
	gray: '#E2E2E2',
}

export const LossTypeColor = {
	total: '#B23B56',
	noData: '#38A700',
	drought: '#E34A33',
	flood: '#3182BD',
	rnr: '#38A700',
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

export const TotalTileColor = {
	level1: '#F2D8DE',
	level2: '#E5B2BD',
	level3: '#D47F92',
	level4: '#B23B56',
	level5: '#722637',
}

export const DroughtTileColor = {
	level1: '#FFEFD9',
	level2: '#FDCC8A',
	level3: '#FC8E59',
	level4: '#E34A33',
	level5: '#B30100',
}

export const FloodTileColor = {
	level1: '#EFF3FF',
	level2: '#BDD7E7',
	level3: '#6BAED6',
	level4: '#3182BD',
	level5: '#08519C',
}

export const TileLayerColor = {
	disabled: '#E2E2E2',
	flood: '#3182BD',
	drought: '#E34A33',
	rice: '#38A700',
}
