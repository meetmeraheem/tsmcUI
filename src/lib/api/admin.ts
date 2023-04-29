import { ApiLoginResponseType, ApiResponseType } from '../../types/api';
import { axiosInstance } from './index';

export const adminService = {
    async signIn(data: any) {
        const { data: responseData } = await axiosInstance.post(`user/login` , data);
        return responseData as ApiLoginResponseType;
    },
    async getAdminById(adminId: number) {
        const { data: responseData } = await axiosInstance.get(`userRole/getUserById/${adminId}`);
        return responseData as ApiResponseType;
    },
};