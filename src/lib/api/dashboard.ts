import { ApiResponseType } from '../../types/api';
import { axiosInstance } from './index';

export const dashboardService = {
    async getMetrics(data: any) {
        const { data: responseData } = await axiosInstance.post('URL', data);
        return responseData as ApiResponseType;
    }, 
};