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
 
};