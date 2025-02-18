import { ApiResponseType } from '../../types/api';
import { axiosInstance } from './index';


export const renewalService = {
   
    async getRenewalsByFilter( fromdate: any,todate:any,status: any,istatkal:any) {
        const { data: responseData } = await axiosInstance.get(`renewal/getRenewalsByFilter/${fromdate}/${todate}/${status}/${istatkal}`);
        return responseData as ApiResponseType;
    },

    async getRenewalsByMobileNoByUserId( formData: any) {
        const { data: responseData } = await axiosInstance.post(`renewal/getRenewalsByMobileNoByUserId`,formData);
        return responseData as ApiResponseType;
    },
    async getRenewalsByMobileNo( formData: any) {
        const { data: responseData } = await axiosInstance.post(`renewal/getRenewalsByMobileNo`,formData);
        return responseData as ApiResponseType;
    },
    async getRenewalRegFeeDetails( data: any) {
        const { data: responseData } = await axiosInstance.post(`renewal/getRenewalRegFeeDetails`,data);
        return responseData as ApiResponseType;
    },

    async getRenewalsByUserId( fromdate: any,todate: any,userId: any,regType:any,statusValue:any,istatkal:any) {
        const { data: responseData } = await axiosInstance.get(`renewal/getRenewalByUserId/${fromdate}/${todate}/${userId}/${regType}/${statusValue}/${istatkal}`);
        return responseData as ApiResponseType;
    },

    async createRenewalDetails( data: any) {
        const { data: responseData } = await axiosInstance.post(`renewal/createRenewal`,data);
        return responseData as ApiResponseType;
    },

    async getRenewalsByDoctorId(doctorId: any) {
        const { data: responseData } = await axiosInstance.get(`renewal/getRenewalByDoctorId/${doctorId}`);
        return responseData as ApiResponseType;
    },


    async getRenewalById(renewalId: number) {
        const { data: responseData } = await axiosInstance.get(`renewal/getRenewalById/${renewalId}`);
        return responseData as ApiResponseType;
    },

    async updateRenewal(renewalId: number, data: any) {
        const { data: responseData } = await axiosInstance.put(`renewal/updateRenewal/${renewalId}`, data);
        return responseData;
    },

    async editRenewal(renewalId: number, data: any) {
        const { data: responseData } = await axiosInstance.put(`renewal/editRenewal/${renewalId}`, data);
        return responseData;
    },
};