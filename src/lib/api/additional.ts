import axios from 'axios';
import { ApiResponseType } from '../../types/api';
import { FinalFormType, GetFinalResponse } from '../../types/final';
import { tokenManager } from '../token-manager';
import { axiosInstance } from './index';
import { serverUrl } from '../../config/constants';

export const additionalService = {
   
    async additionalRegistration(data: any) {
        const token = tokenManager.getToken();
        const { data: responseData } = await axios.post(serverUrl+`additionalQualification/createQualification`, data, {
            headers: {
                'authorization': 'Bearer '+token,
                'Content-Type': 'multipart/form-data'
            }
        });
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
    async getaddlsByFilter(newdate:any, statusValue: any){
        const { data: responseData } = await axiosInstance.get(`additionalQualification/getQualificationByFilter/${newdate}/${statusValue}`);
        return responseData;
    },

    async  getAdditionalRegFeeDetails(data: any) {
        const token = tokenManager.getToken();
        const { data: responseData } = await axios.post(serverUrl+`additionalQualification/getQualificationRegFeeDetails`, data, {
            headers: {
                'authorization': 'Bearer '+token,
                'Content-Type': 'multipart/form-data'
            }
        });
        return responseData;
    },
};