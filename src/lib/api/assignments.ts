import axios from 'axios';
import { ApiResponseType } from '../../types/api';
import { GetProvisionalResponse, ProvisionalEditFormType, ProvisionalFormType } from '../../types/provisional';
import { tokenManager } from '../token-manager';
import { axiosInstance } from './index';
import { serverUrl } from '../../config/constants';

export const assignmentService = {
    // async provisionalRegistration(data: any) {
    //     const { data: responseData } = await axiosInstance.post('provisional/createProvisional', data);
    //     return responseData;
    // },
    async assignToUser(data: any) {
        const { data: responseData } = await axiosInstance.post('assignments/createAssignMent', data);
        return responseData;
    },
    async getUsersByRole() {
        const { data: responseData } = await axiosInstance.get(`userRole/getUsersByRole`);
        return responseData as ApiResponseType;
    },
};