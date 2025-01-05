import { axiosInstance } from './index';

export const adminEditService = {
   
    async getDoctorDetailsById(doctorId: any) {
        const { data: responseData } = await axiosInstance.get(`common/getDoctorDetailsById/${doctorId}`);
        return responseData;
    },
   
    async updateDoctorProfileByAdmin(doctorPrimaryId: number, data: any) {
        const { data: responseData } = await axiosInstance.put(`common/updateDoctorProfileByAdmin/${doctorPrimaryId}`, data);
        return responseData;
    },

    async updateDoctorFMRByAdmin(fmrPrimaryId: number, data: any) {
        const { data: responseData } = await axiosInstance.put(`common/updateDoctorFMRByAdmin/${fmrPrimaryId}`, data);
        return responseData;
    },

    async updateDoctorQualificationByAdmin(additionalPrimaryId: number, data: any) {
        const { data: responseData } = await axiosInstance.put(`common/updateDoctorQualificationByAdmin/${additionalPrimaryId}`, data);
        return responseData;
    },


};