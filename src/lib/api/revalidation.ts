import { ApiResponseType } from '../../types/api';
import { axiosInstance } from './index';


export const revalidationService = {
   
    async getRevalidationsByFilter( fromdate: any,todate:any,status: any) {
        const { data: responseData } = await axiosInstance.get(`revalidation/getRevalidationsByFilter/${fromdate}/${todate}/${status}`);
        return responseData as ApiResponseType;
    },
    async getRevalidationRegFeeDetails( data: any) {
        const { data: responseData } = await axiosInstance.post(`revalidation/getRevalidationRegFeeDetails`,data);
        return responseData as ApiResponseType;
    },

    async getRevalidationByUserId( fromdate: any,todate: any,userId: any,regType:any) {
        const { data: responseData } = await axiosInstance.get(`revalidation/getRevaldationByUserId/${fromdate}/${todate}/${userId}/${regType}`);
        return responseData as ApiResponseType;
    },

    async createRevalidation( data: any) {
        const { data: responseData } = await axiosInstance.post(`revalidation/createRevalidation`,data);
        return responseData as ApiResponseType;
    },

    async getRevalidationByDoctorId(doctorId: any) {
        const { data: responseData } = await axiosInstance.get(`revalidation/getRevaldationByDoctorId/${doctorId}`);
        return responseData as ApiResponseType;
    },


    async getRevalidationById(RevaldationId: number) {
        const { data: responseData } = await axiosInstance.get(`revalidation/getRevalidationById/${RevaldationId}`);
        return responseData as ApiResponseType;
    },

    async updateRevalidation(RevaldationId: number, data: any) {
        const { data: responseData } = await axiosInstance.put(`revalidation/updateRevalidation/${RevaldationId}`, data);
        return responseData;
    },
};