import { ApiResponseType } from '../../types/api';

import { axiosInstance } from './index';


export const assignmentService = {
    async assignToUser(data: any) {
        const { data: responseData } = await axiosInstance.post('assignments/createAssignMent', data);
        return responseData;
    },
    async reAssign(data: any) {
        const { data: responseData } = await axiosInstance.post('assignments/reAssign', data);
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
    async getAssignMentBydoctorIdAssignType(doctor_id: number, assign_type: string,assign_id: string) {
        const { data: responseData } = await axiosInstance.get(`assignments/getAssignMentBydoctorIdAssignType/${doctor_id}/${assign_type}/${assign_id}`);
        return responseData as ApiResponseType;
    },
};