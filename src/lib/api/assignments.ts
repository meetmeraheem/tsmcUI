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
    async updateAssignment(assignmnetId: number, data: any) {
        const { data: responseData } = await axiosInstance.put(`assignments/updateAssignMent/${assignmnetId}`, data);
        return responseData;
    },
    async getAssignMentBydoctorIdAssignType(doctor_id: number, assign_type: string) {
        const { data: responseData } = await axiosInstance.get(`assignments/getAssignMentBydoctorIdAssignType/${doctor_id}/${assign_type}`);
        return responseData as ApiResponseType;
    },
};