import { Language } from "@/enum"

export interface ReportDtoIn {
    provinceCode?:number
    districtCode?:number
    subdistrictCode?:number
    language: string
    years: string
    orgCode: string
    format: string
}