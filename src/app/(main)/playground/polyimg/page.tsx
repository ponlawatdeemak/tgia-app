import { Polygon } from 'geojson'
import PolygonToImage from '@/components/common/polyimg/PolygonToImage'

const exampleData = [
	{
		geomerty: undefined,
		type: 1,
	},
	{
		geomerty: {
			type: 'Polygon',
			coordinates: [
				[
					[-7.8441000354778225, 38.19077176858856],
					[-7.841053046036905, 38.18942257236679],
					[-7.841149605561441, 38.18813238010382],
					[-7.844271696854776, 38.18940570725585],
					[-7.844529188920205, 38.18978517130715],
					[-7.84442190055961, 38.19067901214832],
					[-7.8441000354778225, 38.19077176858856],
				],
			],
		},
		type: 3,
	},
	{
		geomerty: {
			type: 'Polygon',
			coordinates: [
				[
					[-7.84091893558616, 38.18940149097751],
					[-7.839202321816629, 38.188684720111986],
					[-7.83917013530845, 38.18827995227176],
					[-7.8393310678493435, 38.18693914273543],
					[-7.839320339013284, 38.186854814266724],
					[-7.841283716012185, 38.18553084451004],
					[-7.841187156487649, 38.18629824392484],
					[-7.840897477914041, 38.18652593230596],
					[-7.8409082067501, 38.18679578428055],
					[-7.8411549699794705, 38.18679578428055],
					[-7.84091893558616, 38.18940149097751],
				],
			],
		},
		type: 2,
	},
	{
		geomerty: {
			type: 'Polygon',
			coordinates: [
				[
					[101.28249247429613, 6.5605421812064435],
					[101.28197972567614, 6.559327478161137],
					[101.28229526328869, 6.55899441390477],
					[101.28290661741164, 6.5603854454963795],
					[101.28249247429613, 6.5605421812064435],
				],
			],
		},
		type: 1,
	},
	{
		geomerty: {
			type: 'Polygon',
			coordinates: [
				[
					[101.2831506747878, 6.560173420035312],
					[101.28299070493546, 6.558872124918537],
					[101.2825510114929, 6.558983470072832],
					[101.2829303548549, 6.560148310197334],
					[101.2831506747878, 6.560173420035312],
				],
			],
		},
		type: 3,
	},
	{
		geomerty: {
			type: 'Polygon',
			coordinates: [
				[
					[101.28268022230424, 6.553315693013957],
					[101.28263641558254, 6.5530328097314765],
					[101.28303067608181, 6.552662885196568],
					[101.28335922649654, 6.552858727631033],
					[101.28268022230424, 6.553315693013957],
				],
			],
		},
		type: 1,
	},
	{
		geomerty: {
			type: 'Polygon',
			coordinates: [
				[
					[101.2737001788455, 6.53879230131308],
					[101.27403845852695, 6.538737206364502],
					[101.27402182181999, 6.538682111410793],
					[101.2736890877095, 6.538748225354539],
					[101.2737001788455, 6.53879230131308],
				],
			],
		},
		type: 2,
	},
	{
		geomerty: {
			type: 'Polygon',
			coordinates: [
				[
					[101.26201407367984, 6.5302071141044],
					[101.26186043222566, 6.529723739192676],
					[101.26242378422882, 6.529698298395104],
					[101.2626158360477, 6.530130791780522],
					[101.26201407367984, 6.5302071141044],
				],
			],
		},
		type: 2,
	},
	{
		geomerty: {
			type: 'Polygon',
			coordinates: [
				[
					[101.2578801734262, 6.538774015108416],
					[101.2588726155081, 6.538774015108416],
					[101.25855683848062, 6.537474304250097],
					[101.25778995141758, 6.537519121922713],
					[101.2578801734262, 6.538774015108416],
				],
			],
		},
		type: 1,
	},
]

const Page = async () => {
	const getColor = (type: number) => {
		let color = ''
		switch (type) {
			case 1:
				color = '#eb4034'
				break
			case 2:
				color = '#559146'
				break
			case 3:
				color = '#469191'
				break
			default:
				break
		}
		return color
	}
	return (
		<>
			{exampleData.map((item, index) => {
				return (
					<PolygonToImage
						key={index}
						polygon={item.geomerty as Polygon}
						fill={getColor(item.type)}
						backgroundColor={'#F5F5F5'}
						stroke={getColor(item.type)}
					/>
				)
			})}
		</>
	)
}

export default Page