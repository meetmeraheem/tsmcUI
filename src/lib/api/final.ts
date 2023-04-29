import axios from 'axios';
import { ApiResponseType } from '../../types/api';
import { FinalFormType, GetFinalResponse } from '../../types/final';
import { tokenManager } from '../token-manager';
import { axiosInstance } from './index';
import { serverUrl } from '../../config/constants';

export const finalService = {
    // async finalRegistration(data: any) {
    //     const { data: responseData } = await axiosInstance.post(`finalreg/createFinalReg`, data);
    //     return responseData;
    // },
    async finalRegistration(data: any) {
        const token = tokenManager.getToken();
        const { data: responseData } = await axios.post(serverUrl+`finalreg/createFinalReg`, data, {
            headers: {
                'authorization': 'Bearer '+token,
                'Content-Type': 'multipart/form-data'
            }
        });
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
        const token = tokenManager.getToken();
        const { data: responseData } = await axios.put(serverUrl+`finalreg/updateFinalData/${finalId}`, data, {
            headers: {
                'authorization': 'Bearer '+token,
                'Content-Type': 'multipart/form-data'
            }
        });
        return responseData;
    },
    async getFinalsByFilter( reg_date: any,status: any) {
        const { data: responseData } = await axiosInstance.get(`finalreg/getFinalsByFilter/${reg_date}/${status}`);
        return responseData as ApiResponseType;
    },
};