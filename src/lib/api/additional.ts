import axios from 'axios';
import { ApiResponseType } from '../../types/api';
import { axiosInstance } from './index';


export const additionalService = {
   
    async additionalRegistration(data: any) {
        const { data: responseData } = await axiosInstance.post(`additionalQualification/createQualification`, data);
        return responseData;
    },
    async getQualificationById(doctorId : string) {
        const { data: responseData } = await axiosInstance.get(`additionalQualification/getQualificationById/${doctorId}`);
        return responseData as ApiResponseType;
    },
    
    async updateQualification(additionalId: number, data: any) {
        const { data: responseData } = await axiosInstance.put(`additionalQualification/updateQualification/${additionalId}`, data);
        return responseData;
    },
    async getAdditionalData(doctorId: any) {
        const { data: responseData } = await axiosInstance.get(`additionalQualification/getQualificationByDoctorId/${doctorId}`);
        return responseData;
    },
    async getaddlsByFilter(fromdate:any,todate:any, statusValue: any){
        const { data: responseData } = await axiosInstance.get(`additionalQualification/getQualificationByFilter/${fromdate}/${todate}/${statusValue}`);
        return responseData;
    },

    async  getAdditionalRegFeeDetails(data: any) {
        const { data: responseData } = await axiosInstance.post(`additionalQualification/getQualificationRegFeeDetails`, data);
        return responseData;
    },

    async getQualificationsByUserId(fromdate: any,todate: any,user_id: number,regType:any){
        const { data: responseData } = await axiosInstance.get(`additionalQualification/getQualificationByUserId/${fromdate}/${todate}/${user_id}/${regType}`);
        return responseData;
    },
};