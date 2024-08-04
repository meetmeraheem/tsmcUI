import axios from 'axios';
import { ApiLoginResponseType } from '../../types/api';
import { axiosInstance } from './index';


export const authService = {
    async signIn(data: any) {
        const { data: responseData } = await axiosInstance.post('auth/signIn' , data);
        return responseData as ApiLoginResponseType;
    },
    async getDoctorInfoByFmrPmr(fmrNo: any,pmrNo: any,regType:any,mobileNo:any) {
        const { data: responseData } = await axiosInstance.get(`auth/getDoctorInfoByFmrPmr?fmrNo=${fmrNo}&pmrNo=${pmrNo}&regType=${regType}&mobileNo=${mobileNo}`);
        return responseData;
    },

     async sendOTP(mobileNumber: string, message: string) {
        const data = await axiosInstance.get(`sms/sendotp?mobile=${mobileNumber}&message=${message}`);
        return data;
    },
    async sendConfirmation(mobileNumber: string, message: string) {
        const data = await axiosInstance.get(`sms/sendconfirmation?mobile=${mobileNumber}&message=${message}`);
        return data;
    },

    async sendApproval(mobileNumber: string, message: string) {
        const data = await axiosInstance.get(`sms/sendapproval?mobile=${mobileNumber}&message=${message}`);
        return data;
    },
   
    async verifyOTP(mobileNumber:any, message:any,otpstr:any) {
        const { data: responseData } = await axiosInstance.get(`sms/verifyOtp?mobile=${mobileNumber}&message=${message}&strotp=${otpstr}`);
        return responseData as ApiLoginResponseType;
    },
};