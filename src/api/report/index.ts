import { api } from '@/api/core'
import { APIService, ResponseDto } from '@/api/interface'
import { ReportDtoIn } from './dto-in.dto'
import { ReportDtoOut } from './dto-out.dto'

const report = {
    download: async (payload: ReportDtoIn): Promise<ResponseDto<ReportDtoOut>> => {
        const params = new URLSearchParams()
        if(payload.provinceCode) params.append('provinceCode',payload.provinceCode.toString())
        if(payload.districtCode) params.append('districtCode',payload.districtCode.toString())
        if(payload.subdistrictCode) params.append('subdistrictCode',payload.subdistrictCode.toString())
        if(payload.language) params.append('language',payload.language)
        if(payload.years) params.append('years',payload.years)
        if(payload.orgCode) params.append('orgCode',payload.orgCode)

		return await api.get(`/report/csv?${params}`, APIService.DisasterAPI)
}}

export default report
