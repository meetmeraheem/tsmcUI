import axios from 'axios';
import { constant } from 'lodash';
import { paymentURL } from '../../config/constants';
import { ApiResponseType } from '../../types/api';
import { City, Country, GetCitiesResponseType, GetCollegesResponseType, GetCountriesResponseType, GetQualificationsResponseType, GetStatesResponseType, GetUniversitiesResponseType, SerialResponseType, Serials, State } from '../../types/common';
import { PaymentFormType } from '../../types/payment';
import { axiosInstance } from './index';
import { thiredPartyAxiosInstance } from './thired-party';
import queryString from 'query-string'
import { Base64 } from 'js-base64';

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

    async payviaPayG(paymentDetails: any, auth: string) {
        //const authString = 'YjAwZTU5MDdhODMwNGIwZDk5YTU0MzIwZTg3ZDNiMjQ6MTE3ZmRiOTdiOTc2NGI3OWIxNjJkNTZiM2ZkNmNmMGQ6TTo3MTNDMDAxOEZCMjAzMTE=';
        const authString = 'ODdhMmY2ODIyNDFlNDc2MzgxMjlkMzIzZDVlNzJhNWQ6NDNjMTg1YTE1YjkwNDMwNWFjOGM2OGJjNjQ2ZTBiMTA6TTozMTkyMQ==';
        const { data } = await axios.post(paymentURL, paymentDetails, {
            headers: {
                'authorization': 'Basic ' + auth,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*",
                'Access-Control-Allow-Credentials': "true",
                'Access-Control-Allow-Methods': "GET,HEAD,OPTIONS,POST,PUT",
                'Access-Control-Allow-Headers': "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, content-type, Access-Control-Request-Method, Access-Control-Request-Headers"
            }
        });
        return data;
    },
    async orderDetails(orderKeyId: any, merchantKeyId: string) {
        console.log('merchantKeyId  ----: ' + merchantKeyId);
        //const authString = 'YjAwZTU5MDdhODMwNGIwZDk5YTU0MzIwZTg3ZDNiMjQ6MTE3ZmRiOTdiOTc2NGI3OWIxNjJkNTZiM2ZkNmNmMGQ6TTo3MTNDMDAxOEZCMjAzMTE=';
        //const authString = 'ODdhMmY2ODIyNDFlNDc2MzgxMjlkMzIzZDVlNzJhNWQ6NDNjMTg1YTE1YjkwNDMwNWFjOGM2OGJjNjQ2ZTBiMTA6TToxMTEzMA==';
        const authString = Base64.encode('87a2f682241e47638129d323d5e72a5d:43c185a15b904305ac8c68bc646e0b10:M:31921');
        const { data } = await axios.post('https://paygapi.payg.in/payment/api/order/Detail', {
            OrderKeyId: orderKeyId,
            MerchantKeyId: merchantKeyId,
            PaymentType: ''
        }, {
            headers: {
                'authorization': 'Basic ' + authString,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*",
                'Access-Control-Allow-Credentials': "true",
                'Access-Control-Allow-Methods': "POST",
                'Access-Control-Allow-Headers': "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, content-type, Access-Control-Request-Method, Access-Control-Request-Headers"
            }
        });
        return data;
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
};