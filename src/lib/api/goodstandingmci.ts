import { ApiResponseType } from '../../types/api';
import { axiosInstance } from './index';

export const goodstandingmciService = {
   
    async getGoodstandingMCIByFilter( reg_date: any,status: any) {
        const { data: responseData } = await axiosInstance.get(`goodstandingmci/getGoodStandingsMciByFilter/${reg_date}/${status}`);
        return responseData as ApiResponseType;
    },
 
};