import axios from 'axios';
import { ApiResponseType } from '../../types/api';
import { tokenManager } from '../token-manager';
import { axiosInstance } from './index';
import { serverUrl } from '../../config/constants';

export const provisionalService = {
    // async provisionalRegistration(data: any) {
    //     const { data: responseData } = await axiosInstance.post('provisional/createProvisional', data);
    //     return responseData;
    // },
    async provisionalRegistration(data: any) {
        const token = tokenManager.getToken();
        const { data: responseData } = await axios.post(serverUrl+`provisional/createProvisional`, data, {
            headers: {
                'authorization': 'Bearer '+token,
                'Content-Type': 'multipart/form-data'
            }
        });
        return responseData;
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
    // async updateSingleProvisional(provisionalId: number, data: any) {
    //     const { data: responseData } = await axiosInstance.put(`provisional/updateProvisionalData/${provisionalId}`, data);
    //     return responseData;
    // },
    async updateSingleProvisional(provisionalId: number, data: any) {
        const token = tokenManager.getToken();
        const { data: responseData } = await axios.put(serverUrl+`provisional/updateProvisionalData/${provisionalId}`, data, {
            headers: {
                'authorization': 'Bearer '+token,
                'Content-Type': 'multipart/form-data'
            }
        });
        return responseData;
    },
    async getProvisionalsByFilter( reg_date: any,status: any) {
        const { data: responseData } = await axiosInstance.get(`provisional/getProvisionalsByFilter/${reg_date}/${status}`);
        return responseData as ApiResponseType;
    },
    async getProvisionalsByUserId( reg_date: any,user_id: number,regType:any) {
        const { data: responseData } = await axiosInstance.get(`provisional/getProvisionalsByUserId/${reg_date}/${user_id}/${regType}`);
        return responseData as ApiResponseType;
    },

    async getProvisionalFeeDetails(data: any) {
        const token = tokenManager.getToken();
        const { data: responseData } = await axios.post(serverUrl+`provisional/getProvisionalRegFeeDetails`, data, {
            headers: {
                'authorization': 'Bearer '+token,
                'Content-Type': 'multipart/form-data'
            }
        });
        return responseData;
    },
};