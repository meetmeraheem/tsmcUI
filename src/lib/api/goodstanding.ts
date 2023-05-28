import axios from 'axios';
import { ApiResponseType } from '../../types/api';
import { FinalFormType, GetFinalResponse } from '../../types/final';
import { tokenManager } from '../token-manager';
import { axiosInstance } from './index';
import { serverUrl } from '../../config/constants';

export const goodstandingService = {
   
    async getGoodstandingByFilter( reg_date: any,status: any) {
        const { data: responseData } = await axiosInstance.get(`goodstanding/getGoodStandingsByFilter/${reg_date}/${status}`);
        return responseData as ApiResponseType;
    },

    async getGoodstandingInfoRegDetails( data: any) {
        const { data: responseData } = await axiosInstance.post(`goodstanding/getGoodStandingRegFeeDetails`,data);
        return responseData as ApiResponseType;
    },
    async createGoodstandingDetails( data: any) {
        const { data: responseData } = await axiosInstance.post(`goodstanding/createGoodstanding`,data);
        return responseData as ApiResponseType;
    },

    async getGoodstandingByDoctorId( doctor_id: any) {
        const { data: responseData } = await axiosInstance.get(`goodstanding/getGoodStandingByDoctorId/${doctor_id}`);
        return responseData as ApiResponseType;
    },
    async getGoodstandingById( gsid: any) {
        const { data: responseData } = await axiosInstance.get(`goodstanding/getGoodstandingById/${gsid}`);
        return responseData as ApiResponseType;
    },
    
    async getGoodStandingByUserId( createdDate: any,userId:any,regType: any) {
        const { data: responseData } = await axiosInstance.get(`goodstanding/getGoodStandingByUserId/${createdDate}/${userId}/${regType}`);
        return responseData as ApiResponseType;
    },

    async updateGoodStanding(gsPrimaryId: number, data: any) {
        const { data: responseData } = await axiosInstance.put(`goodstanding/updateGoodStanding/${gsPrimaryId}`, data);
        return responseData;
    },
};