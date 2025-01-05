import { ApiResponseType } from '../../types/api';
import { GetCitiesResponseType, GetStatesResponseType, SerialResponseType, Serials } from '../../types/common';
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
        const { data: responseData } = await axiosInstance.get(`common/getDoctorInfoByFmrNo?fmrNo=${fmrNo}`);
        return responseData;
    },
    async getDoctorInfoByNameGender(fmrNo: any,docName: any,gender:any,fatherName:any) {
        const { data: responseData } = await axiosInstance.get(`common/getDoctorInfoByNameGender?fmrNo=${fmrNo}&docName=${docName}&gender=${gender}&fatherName=${fatherName}`);
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
    },
    async getDashboardData(fromdate:any,todate:any,assignedUser:any,istatkal:any){
        const { data: responseData } = await axiosInstance.get(`common/getDashboardData/${fromdate}/${todate}/${assignedUser}/${istatkal}`);
        return responseData as ApiResponseType;
    },
    async AdditionalStatusCnt(assignedUser:any){
        const { data: responseData } = await axiosInstance.get(`common/AdditionalStatusCnt/${assignedUser}`);
        return responseData as ApiResponseType;
    },
    async ProvisionalStatusCnt(assignedUser:any){
        const { data: responseData } = await axiosInstance.get(`common/ProvisionalStatusCnt/${assignedUser}`);
        return responseData as ApiResponseType;
    },
    async FinalStatusCnt(assignedUser:any){
        const { data: responseData } = await axiosInstance.get(`common/FinalStatusCnt/${assignedUser}`);
        return responseData as ApiResponseType;
    },
    async RenewalStatusCnt(assignedUser:any){
        const { data: responseData } = await axiosInstance.get(`common/RenewalStatusCnt/${assignedUser}`);
        return responseData as ApiResponseType;
    },
    async NocStatusCnt(assignedUser:any){
        const { data: responseData } = await axiosInstance.get(`common/NocStatusCnt/${assignedUser}`);
        return responseData as ApiResponseType;
    },
    async GsStatusCnt(assignedUser:any){
        const { data: responseData } = await axiosInstance.get(`common/GsStatusCnt/${assignedUser}`);
        return responseData as ApiResponseType;
    },

};