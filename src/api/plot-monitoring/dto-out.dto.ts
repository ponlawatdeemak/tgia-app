import { Polygon } from 'geojson'
import { ResponseArea, ResponseLanguage } from '../interface'

interface LossPredicted extends ResponseArea {
	percent: number
}

export interface GetSearchPlotDtoOut {
	activityId: number
	count: number
	order: number
	address: ResponseLanguage
	year: ResponseLanguage
	predictedRiceArea: ResponseArea
	lossPredicted: LossPredicted
	publicStatus: ResponseLanguage
	riceType: ResponseLanguage
	detailType: ResponseLanguage
	insuredType: ResponseLanguage
	riskType: ResponseLanguage
	geometry: Polygon
}

export interface GetSearchPlotTotalDtoOut {
	total: number
}

export interface GetAreaSearchPlotDtoOut {
	activityId: number
}

interface ResponseActArea {
    areaRai:number
    areaNgan:number
    areaWa:number
}
interface ResponsePredeicted {
    areaRai:number
    percent:number
}

export interface GetPlotActivityPlantDetailDtoOut{
    activityId:number
    address:ResponseLanguage
    year:ResponseLanguage
    insuredType:ResponseLanguage
    publicStatus:ResponseLanguage
    riskType:ResponseLanguage
    riceType:ResponseLanguage
    detailType:ResponseLanguage
    plantDate:ResponseLanguage
    produceDate:ResponseLanguage
    actArea:ResponseActArea
    predictedRiceArea:ResponsePredeicted
    predictedNonRiceArea:ResponsePredeicted
}

interface ResponselossPredicted {
    lossType:string
    areaRai:number
    percent:number
}

interface ResponseDisasterArea {
    areaRai:number
}

export interface GetPlotActivityLossDetailDtoOut{
    activityId:number
    address:ResponseLanguage
    year:ResponseLanguage
    insuredType:ResponseLanguage
    publicStatus:ResponseLanguage
    riskType:ResponseLanguage
    actArea:ResponseActArea
    disasterArea:ResponseDisasterArea
    predictedRiceArea : ResponsePredeicted
    lossPredicted : ResponselossPredicted   
    updateDisasterDate : ResponseLanguage
    startObsDate :ResponseLanguage
    endObsDate: ResponseLanguage
}


