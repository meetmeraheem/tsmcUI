import { ApiResponseType } from '../../types/api';
import { City, Country, GetCitiesResponseType, GetCollegesResponseType, GetCountriesResponseType, GetQualificationsResponseType, GetStatesResponseType, GetUniversitiesResponseType, SerialResponseType, Serials, State } from '../../types/common';
import { axiosInstance } from './index';

export const commonService = {
    async getQualifications() {
        const { data: responseData } = await axiosInstance.get(`qualification/getAllQualifications`);
        return responseData as ApiResponseType;
    },
    async getQualificationById(qualificationId: number) {
        const { data: responseData } = await axiosInstance.get(`qualification/getQualificationById/${qualificationId}`);
        return responseData as ApiResponseType;
    },
    async getCountries() {
        const { data: responseData } = await axiosInstance.get('country/getAllCountrys');
        return responseData as ApiResponseType;
    },
    async getCountry(countryId: number) {
        const { data: responseData } = await axiosInstance.get(`country/getCountryById/${countryId}`);
        return responseData as ApiResponseType;
    },
    async getStatesByCountryId(countryId: number) {
        const { data: responseData } = await axiosInstance.get(`states/getStatesByCountryId/${countryId}`);
        return responseData as GetStatesResponseType;
    },
    async getState(stateId: number) {
        const { data: responseData } = await axiosInstance.get(`states/getStateById/${stateId}`);
        return responseData as ApiResponseType;
    },
    async getCitiesByStateId(stateId: number) {
        const { data: responseData } = await axiosInstance.get(`cities/getCitiesByStateId/${stateId}`);
        return responseData as GetCitiesResponseType;
    },
    async getUniversitiesByStateId(stateId: number) {
        const { data: responseData } = await axiosInstance.get(`university/getUniversitiesByStateId/${stateId}`);
        return responseData as ApiResponseType;
    },
    async getCollegesByUniversityId(universityId: number) {
        const { data: responseData } = await axiosInstance.get(`colleges/getCollegesByUniversityId/${universityId}`);
        return responseData as ApiResponseType;
    },
    async getMtSerials(serialType: string) {
        const { data: responseData } = await axiosInstance.get(`serials/getSerialBySerialType/${serialType}`);
        return responseData as SerialResponseType;
    },
    //serialId: number,serialType : string,SerialStarts: string
    async updateMtSerials(serials: Serials) {
        const { data: responseData } = await axiosInstance.put(`serials/updateSerial/${serials.id}`, serials);
        return responseData as Serials;
    },


    //Payment
    async createPayment(data: any) {
        const { data: responseData } = await axiosInstance.post(`payments/createPayment`, data);
        return responseData;
    },

    async createPaymentURL(data: any) {
        const { data: responseData } = await axiosInstance.post(`common/createPaymentURL`, data);
        return responseData;
    },
    async payviaJavaPayG(paymentDetailsJava: any) {
        const { data: responseData } = await axiosInstance.post(`payment/getPaymentRedirectURL`, paymentDetailsJava);
        return responseData;
    },
    async getJavaOrderDetails(orderKeyId: any) {
        const { data: responseData } = await axiosInstance.get(`payment/getOrderDetails/${orderKeyId}`);
        return responseData;
    },

    async getDoctorInfoByMobile(mobileNo: any) {
        const { data: responseData } = await axiosInstance.get(`common/getDoctorInfoByMobile/${mobileNo}`);
        return responseData;
    },

    async getDoctorDetailsById(doctorId: any) {
        const { data: responseData } = await axiosInstance.get(`common/getDoctorDetailsById/${doctorId}`);
        return responseData;
    },
    async getDoctorInfoByFmrNo(fmrNo: any) {
        const { data: responseData } = await axiosInstance.get(`common/getDoctorInfoByFmrNo/${fmrNo}`);
        return responseData;
    },

    async enableDoctorProfileEdit(docId: any) {
        const { data: responseData } = await axiosInstance.put(`common/enableDoctorProfileEdit/${docId}`);
        return responseData;
    },

    async enableDoctorPMREdit(docId: any) {
        const { data: responseData } = await axiosInstance.put(`common/enableDoctorPMREdit/${docId}`);
        return responseData;
    },
    async enableDoctorFMREdit(docId: any) {
        const { data: responseData } = await axiosInstance.put(`common/enableDoctorFMREdit/${docId}`);
        return responseData;
    },

    async enableDoctorQualificationEdit(docId: any) {
        const { data: responseData } = await axiosInstance.put(`common/enableDoctorQualificationEdit/${docId}`);
        return responseData;
    },

    async getTatkalCurrentStatus() {
        const { data: responseData } = await axiosInstance.get(`common/getTatkalCurrentCnt`);
        return responseData;
    },
    async saveTatkalData( data: any) {
        const { data: responseData } = await axiosInstance.post(`common/saveTatkalData`,data);
        return responseData as ApiResponseType;
    },

    async getTatkalDailyData(fromdate:any,todate:any){
        const { data: responseData } = await axiosInstance.get(`common/getTatkalDailyData/${fromdate}/${todate}`);
        return responseData as ApiResponseType;
    }

};