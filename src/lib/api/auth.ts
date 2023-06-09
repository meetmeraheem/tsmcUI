import axios from 'axios';
import { ApiLoginResponseType } from '../../types/api';
import { axiosInstance } from './index';
import { smsBaseURL } from '../../config/constants';

export const authService = {
    async signIn(data: any) {
        const { data: responseData } = await axiosInstance.post('auth/signIn' , data);
        return responseData as ApiLoginResponseType;
    },
 /*    async sendOTP(mobileNumber: string, message: string) {
        //const data = await thiredPartyAxiosInstance.get(`${smsBaseURL}phone=${mobileNumber}&text=${message}&priority=ndnd&stype=normal`);
        const { data } = await axios.post(`${smsBaseURL}phone=${mobileNumber}&text=${message}&priority=ndnd&stype=normal`, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*",
                'Access-Control-Allow-Credentials': "true",
                'Access-Control-Allow-Methods': "GET,HEAD,OPTIONS,POST,PUT",
                'Access-Control-Allow-Headers': "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, content-type, Access-Control-Request-Method, Access-Control-Request-Headers"
            }
        });
        return data;
    },
   async sendSMS(mobileNumber: string, message: string) {
        const data = axios.post(`${smsBaseURL}phone=${mobileNumber}&text=${message}&priority=ndnd&stype=normal`, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*",
                'Access-Control-Allow-Credentials': "true",
                'Access-Control-Allow-Methods': "GET,HEAD,OPTIONS,POST,PUT",
                'Access-Control-Allow-Headers': "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, content-type, Access-Control-Request-Method, Access-Control-Request-Headers"
            }
        });
        return data;
    },*/
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