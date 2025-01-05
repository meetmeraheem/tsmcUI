import { ApiResponseType } from '../../types/api';
import { axiosInstance } from './index';


export const duplicateService = {
    // async duplicateRegistration(data: any) {
    //     const { data: responseData } = await axiosInstance.post('duplicate/createduplicate', data);
    //     return responseData;
    // },
    async duplicateRegistration(data: any) {
        const { data: responseData } = await axiosInstance.post(`duplicate/createDuplicate`, data);
        return responseData;
    },
    async getDuplicateById(duplicateId: number) {
        const { data: responseData } = await axiosInstance.get(`duplicate/getDuplicateById/${duplicateId}`);
        return responseData as ApiResponseType;
    },
    async getDuplicateByDoctorId(doctorId: number) {
        const { data: responseData } = await axiosInstance.get(`duplicate/getDuplicateByDoctorId/${doctorId}`);
        return responseData as ApiResponseType;
    },
    async updateDuplicate(duplicateId: number, data: any) {
        const { data: responseData } = await axiosInstance.put(`duplicate/updateDuplicate/${duplicateId}`, data);
        return responseData;
    },
    // async updateSingleduplicate(duplicateId: number, data: any) {
    //     const { data: responseData } = await axiosInstance.put(`duplicate/updateduplicateData/${duplicateId}`, data);
    //     return responseData;
    // },
    async updateSingleDuplicate(duplicateId: number, data: any) {
        const { data: responseData } = await axiosInstance.put(`duplicate/updateDuplicateData/${duplicateId}`, data);
        return responseData;
    },
    async getduplicatesByFilter( reg_date: any,status: any) {
        const { data: responseData } = await axiosInstance.get(`duplicate/getduplicatesByFilter/${reg_date}/${status}`);
        return responseData as ApiResponseType;
    },
    async getduplicatesByUserId( reg_date: any,user_id: number) {
        const { data: responseData } = await axiosInstance.get(`duplicate/getduplicatesByUserId/${reg_date}/${user_id}`);
        return responseData as ApiResponseType;
    },
};