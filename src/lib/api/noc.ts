import axios from 'axios';
import { ApiResponseType } from '../../types/api';
import { FinalFormType, GetFinalResponse } from '../../types/final';
import { tokenManager } from '../token-manager';
import { axiosInstance } from './index';
import { serverUrl } from '../../config/constants';

export const nocService = {
   
    async nocRegistration(data: any) {
        const token = tokenManager.getToken();
        const { data: responseData } = await axios.post(serverUrl+`noc/createNoc`, data, {
            headers: {
                'authorization': 'Bearer '+token,
                'Content-Type': 'multipart/form-data'
            }
        });
        return responseData;
    },
   
    async nocDataByDoctorId(doctorId: any) {
        const token = tokenManager.getToken();
        const { data: responseData } = await axios.get(serverUrl+`noc/getNocByDoctorId/${doctorId}`, {
            headers: {
                'authorization': 'Bearer '+token,
                'Content-Type': 'application/json'
            }
        });
        return responseData;
    },
    async getNocsByFilter(newdate:any, statusValue:any){
        const token = tokenManager.getToken();
        const { data: responseData } = await axios.get(serverUrl+`noc/getNocsByFilter/${newdate}/${statusValue}`, {
            headers: {
                'authorization': 'Bearer '+token,
                'Content-Type': 'application/json'
            }
        });
        return responseData;

    },
    async getNocRegDetails(nocdata:any){
        const token = tokenManager.getToken();
        const { data: responseData } = await axios.post(serverUrl+`noc/getNocRegFeeDetails`,nocdata, {
            headers: {
                'authorization': 'Bearer '+token,
                'Content-Type': 'multipart/form-data'
            }
        });
        return responseData;

    },
    async getNocByUserId(reg_date: any,user_id: number,regType:any){
        const token = tokenManager.getToken();
        const { data: responseData } = await axios.get(serverUrl+`noc/getNocByUserId/${reg_date}/${user_id}/${regType}`, {
            headers: {
                'authorization': 'Bearer '+token,
                'Content-Type': 'application/json'
            }
        });
        return responseData;
    },
        async  getNocById(nocPrimaryId: any){
            const token = tokenManager.getToken();
            const { data: responseData } = await axios.get(serverUrl+`noc/getNocById/${nocPrimaryId}`, {
                headers: {
                    'authorization': 'Bearer '+token,
                    'Content-Type': 'application/json'
                }
            });
            return responseData;
        },

        async updateNoc(nocPrimaryId: number, data: any) {
            const { data: responseData } = await axiosInstance.put(`noc/updatenoc/${nocPrimaryId}`, data);
            return responseData;
        },
};