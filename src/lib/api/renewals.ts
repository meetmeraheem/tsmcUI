import axios from 'axios';
import { ApiResponseType } from '../../types/api';
import { FinalFormType, GetFinalResponse } from '../../types/final';
import { tokenManager } from '../token-manager';
import { axiosInstance } from './index';
import { serverUrl } from '../../config/constants';

export const renewalService = {
   
    async getRenewalsByFilter( reg_date: any,status: any) {
        const { data: responseData } = await axiosInstance.get(`renewal/getRenewalsByFilter/${reg_date}/${status}`);
        return responseData as ApiResponseType;
    },
    async getRenewalRegFeeDetails( data: any) {
        const { data: responseData } = await axiosInstance.post(`renewal/getRenewalRegFeeDetails`,data);
        return responseData as ApiResponseType;
    },

    async getRenewalsByUserId( created: any,userId: any,regType:any) {
        const { data: responseData } = await axiosInstance.get(`renewal/getRenewalByUserId/${created}/${userId}/${regType}`);
        return responseData as ApiResponseType;
    },

    async createRenewalDetails( data: any) {
        const { data: responseData } = await axiosInstance.post(`renewal/createRenewal`,data);
        return responseData as ApiResponseType;
    },
};