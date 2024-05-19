import { ApiResponseType } from '../../types/api';
import { axiosInstance } from './index';
export const provisionalService = {
  
    async provisionalRegistration(data: any) {
        const { data: responseData } = await axiosInstance.post(`provisional/createProvisional`, data);
        return responseData;
    },
    async getProvisionalsByMobileNoByUserId( data: any) {
        const { data: responseData } = await axiosInstance.post(`provisional/getProvisionalsByMobileNoByUserId`,data);
        return responseData as ApiResponseType;
    },
    async getProvisionalsByMobileNo( data: any) {
        const { data: responseData } = await axiosInstance.post(`provisional/getProvisionalsByMobileNo`,data);
        return responseData as ApiResponseType;
    },

    async getProvisionalById(provisionalId: number) {
        const { data: responseData } = await axiosInstance.get(`provisional/getProvisionalById/${provisionalId}`);
        return responseData as ApiResponseType;
    },
    async getProvisionalByDoctorId(doctorId: any) {
        const { data: responseData } = await axiosInstance.get(`provisional/getProvisionalByDoctorId/${doctorId}`);
        return responseData as ApiResponseType;
    },
    async updateProvisional(provisionalId: number, data: any) {
        const { data: responseData } = await axiosInstance.put(`provisional/updateProvisional/${provisionalId}`, data);
        return responseData;
    },
   
    async updateSingleProvisional(provisionalId: number, data: any) {
        const { data: responseData } = await axiosInstance.put(`provisional/updateProvisionalData/${provisionalId}`, data)
        return responseData;
    },
    async getProvisionalsByFilter( from_date: any, to_Date:any,status: any,istatkal:any,collegeId:any) {
        const { data: responseData } = await axiosInstance.get(`provisional/getProvisionalsByFilter/${from_date}/${to_Date}/${status}/${istatkal}/${collegeId}`);
        return responseData as ApiResponseType;
    },
    async getProvisionalsByUserId( fromdate: any,todate: any,user_id: number,regType:any,statusValue:any,istatkal:any) {
        const { data: responseData } = await axiosInstance.get(`provisional/getProvisionalsByUserId/${fromdate}/${todate}/${user_id}/${regType}/${statusValue}/${istatkal}`);
        return responseData as ApiResponseType;
    },

    async getProvisionalFeeDetails(data: any) {
        const { data: responseData } = await axiosInstance.post(`provisional/getProvisionalRegFeeDetails`, data);
        return responseData;
    },
};