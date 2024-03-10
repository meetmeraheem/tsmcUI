import { ApiResponseType } from '../../types/api';
import { axiosInstance } from './index';


export const changeofnameService = {
   
    async getNameChangesByFilter( fromdate: any,todate:any,status: any) {
        const { data: responseData } = await axiosInstance.get(`namechange/getNameChangesByFilter/${fromdate}/${todate}/${status}`);
        return responseData as ApiResponseType;
    },
    async getNameChangeRegFeeDetails( data: any) {
        const { data: responseData } = await axiosInstance.post(`namechange/getNameChangeRegFeeDetails`,data);
        return responseData as ApiResponseType;
    },

    async getNameChangeByUserId( fromdate: any,todate: any,userId: number,regType:any,statusValue:any,istatkal:any) {
        const { data: responseData } = await axiosInstance.get(`namechange/getNameChangeByUserId/${fromdate}/${todate}/${userId}/${regType}`);
        return responseData as ApiResponseType;
    },

    async createNameChange( data: any) {
        const { data: responseData } = await axiosInstance.post(`namechange/createNameChange`,data);
        return responseData as ApiResponseType;
    },

    async getNameChangeByDoctorId(doctorId: any) {
        const { data: responseData } = await axiosInstance.get(`namechange/getNameChangeByDoctorId/${doctorId}`);
        return responseData as ApiResponseType;
    },


    async getNameChangeById(namechangeId: number) {
        const { data: responseData } = await axiosInstance.get(`namechange/getNameChangeById/${namechangeId}`);
        return responseData as ApiResponseType;
    },

    async updateNameChange(namechangeId: number, data: any) {
        const { data: responseData } = await axiosInstance.put(`namechange/updateNameChange/${namechangeId}`, data);
        return responseData;
    },

    async editNameChange(namechangeId: number, data: any) {
        const { data: responseData } = await axiosInstance.put(`namechange/editNameChange/${namechangeId}`, data);
        return responseData;
    },

    async getChangeOfNameByMobileNo(data: any){
        const { data: responseData } = await axiosInstance.put(`namechange/getChangeOfNameByMobileNo`, data);
        return responseData;
    }
};