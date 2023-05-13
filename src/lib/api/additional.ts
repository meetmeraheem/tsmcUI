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
    async getFinal(doctorId : string) {
        const { data: responseData } = await axiosInstance.get(`additionalQualification/getQualificationById/${doctorId}`);
        return responseData as ApiResponseType;
    },
    
    async updateFinal(finalId: number, data: any) {
        const { data: responseData } = await axiosInstance.put(`additionalQualification/updateQualification/${finalId}`, data);
        return responseData;
    },
    async getaddlsByFilter( reg_date: any,status: any) {
        const { data: responseData } = await axiosInstance.get(`additionalQualification/getQualificationByFilter/${reg_date}/${status}`);
        return responseData as ApiResponseType;
    },
 
};