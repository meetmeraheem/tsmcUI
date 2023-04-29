import axios from 'axios';
import { ApiResponseType } from '../../types/api';
import { DoctorFormType, DoctorSignUpFormType, GetDoctorResponseType } from '../../types/doctor';
import { tokenManager } from '../token-manager';
import { axiosInstance } from './index';
import { serverUrl } from '../../config/constants';

export const doctorService = {
    async getDoctorById(doctorId: number) {
        const { data: responseData } = await axiosInstance.get(`doctor/getDoctorById/${doctorId}`);
        return responseData as ApiResponseType;
    },
    async getDoctorMyprofileById(doctorId: number) {
        const { data: responseData } = await axiosInstance.get(`doctor/getDoctorMyprofileById/${doctorId}`);
        return responseData as ApiResponseType;
    },
    async doctorRegistration(data: DoctorFormType) {
        const { data: responseData } = await axiosInstance.post('TtDoctorInfo', data);
        return responseData;
    },
    async doctorSignUp(data: DoctorSignUpFormType | null) {
        const { data: responseData } = await axiosInstance.post('doctor/createDoctor', data);
        return responseData;
    },
    async signIn(data: any) {
        const { data: responseData } = await axiosInstance.get(`TtDoctorInfo?where=where(Mobileno,eq,${data.Mobileno})~and(Password,eq,${data.Password})`);
        return responseData as GetDoctorResponseType;
    },
    async mobileValidation(mobileno: any) {
        const { data: responseData } = await axiosInstance.get(`doctor/getDoctorByMobileNo/${mobileno}`);
        return responseData as ApiResponseType;
    },
    async updateDoctorIdPmrId(doctorPrimaryId: number, serialStarts: number,pmrNo:number) {
        const { data: responseData } = await axiosInstance.put(`doctor/updateDoctor/${doctorPrimaryId}`, { serial_id: serialStarts, pmr_no: pmrNo });
        return responseData;
    },
    async updateDoctorIdFMRId(doctorPrimaryId: number, data: any) {
        const { data: responseData } = await axiosInstance.put(`doctor/updateDoctor/${doctorPrimaryId}`, data);
        return responseData;
    },
    async updateDoctor(doctorPrimaryId: number, data: any) {
        const { data: responseData } = await axiosInstance.put(`doctor/updateDoctor/${doctorPrimaryId}`, data);
        return responseData;
    },
    async updateDoctorInfo(doctorPrimaryId: number, data: any) {
        const token = tokenManager.getToken();
        const { data: responseData } = await axios.put(serverUrl+`doctor/updateSingleDoctor/${doctorPrimaryId}`, data, {
            headers: {
                'authorization': 'Bearer '+token,
                'Content-Type': 'multipart/form-data'
            }
        });
        return responseData;
    },
    async updatePassword(mobileno: string, password: string) {
        const { data: responseData } = await axiosInstance.put(`doctor/updatePassword/${mobileno}`, { password: password });
        return responseData;
    },
};