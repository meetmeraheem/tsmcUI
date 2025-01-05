import { ApiResponseType } from '../../types/api';
import { axiosInstance } from './index';
import { serverUrl } from '../../config/constants';

export const finalService = {
    // async finalRegistration(data: any) {
    //     const { data: responseData } = await axiosInstance.post(`finalreg/createFinalReg`, data);
    //     return responseData;
    // },
    async finalRegistration(data: any) {
        const { data: responseData } = await axiosInstance.post(serverUrl+`finalreg/createFinalReg`, data);
        return responseData;
    },
    async getFinal(doctorId : string) {
        const { data: responseData } = await axiosInstance.get(`finalreg/getFinalByDoctorId/${doctorId}`);
        return responseData as ApiResponseType;
    },
    async getFinalById(finalId : string) {
        const { data: responseData } = await axiosInstance.get(`finalreg/getFinalRegById/${finalId}`);
        return responseData as ApiResponseType;
    },
    async updateFinal(finalId: number, data: any) {
        const { data: responseData } = await axiosInstance.put(`finalreg/updateFinalReg/${finalId}`, data);
        return responseData;
    },
    async updateFinalData(finalId: number, data: any) {
        const { data: responseData } = await axiosInstance.put(serverUrl+`finalreg/updateFinalData/${finalId}`, data);
        return responseData;
    },
    async getFinalsByFilter( from_date: any,to_date:any,status: any,istatkal:any) {
        const { data: responseData } = await axiosInstance.get(`finalreg/getFinalsByFilter/${from_date}/${to_date}/${status}/${istatkal}`);
        return responseData as ApiResponseType;
    },
    async getFinalRegFeeDetails(data: any) {
        const { data: responseData } = await axiosInstance.post(serverUrl+`finalreg/getFinalRegFeeDetails`, data);
        return responseData;
    },
    async getFinalsByMobileNoByUserId( data: any) {
        const { data: responseData } = await axiosInstance.post(`finalreg/getFinalsByMobileNoByUserId`,data);
        return responseData as ApiResponseType;
    },
    async getFinalsByMobileNo( data: any) {
        const { data: responseData } = await axiosInstance.post(`finalreg/getFinalsByMobileNo`,data);
        return responseData as ApiResponseType;
    },
    async getFinalsByUserId( fromdate: any,todate: any,user_id: number,regType:any,statusValue:any,istatkal:any) {
        const { data: responseData } = await axiosInstance.get(`finalreg/getFinalsByUserId/${fromdate}/${todate}/${user_id}/${regType}/${statusValue}/${istatkal}`);
        return responseData as ApiResponseType;
    },
};