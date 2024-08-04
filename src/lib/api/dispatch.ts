import { ApiResponseType } from '../../types/api';
import { axiosInstance } from './index';

 const dispatchservice = {
    async getDoctorByFMR(requestType:string,searchType:string,fmrNo: string,regDate:any) {
        const { data: responseData } = await axiosInstance.get(`dispatch/getDoctorByFMR?requestType=${requestType}&searchType=${searchType}&fmrNo=${fmrNo}&regDate=${regDate}`);
        return responseData as ApiResponseType;
    },
    async saveDispatchinfo( data: any) {
        const { data: responseData } = await axiosInstance.post(`dispatch/saveDispatchinfo`,data);
        return responseData as ApiResponseType;
    },

    async getDispatchinfo( doctorId: any,requestPrimaryId:any) {
        const { data: responseData } = await axiosInstance.post(`dispatch/getDispatchinfo/${doctorId}/${requestPrimaryId}`);
        return responseData as ApiResponseType;
    },
    async updateDispatchinfo( data: any,dispatchId:any) {
        const { data: responseData } = await axiosInstance.post(`dispatch/updateDispatchinfo/${dispatchId}`,data);
        return responseData as ApiResponseType;
    },

    async getDispachByFilter(from_date: any, to_Date:any){
        const { data: responseData } = await axiosInstance.get(`dispatch/getDispatchByFilter/${from_date}/${to_Date}`);
        return responseData as ApiResponseType;
    }
    
}
 export default dispatchservice;