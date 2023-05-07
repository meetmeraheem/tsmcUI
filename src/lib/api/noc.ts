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
   
 
};