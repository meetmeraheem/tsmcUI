import { axiosInstance } from './index';



export const nocService = {
   
    async nocRegistration(data: any) {
        const { data: responseData } = await axiosInstance.post(`noc/createNoc`, data);
        return responseData;
    },

     
    async nocEditRegistration(nocPrimaryId: any,data: any) {
        const { data: responseData } = await axiosInstance.put(`noc/editnoc/${nocPrimaryId}`, data);
        return responseData;
    },
   
    async nocDataByDoctorId(doctorId: any) {
        const { data: responseData } = await axiosInstance.get(`noc/getNocByDoctorId/${doctorId}`);
        return responseData;
    },
    async getNocsByFilter(fromdate:any,toDate:any, statusValue:any,istatkal:any){
        const { data: responseData } = await axiosInstance.get(`noc/getNocsByFilter/${fromdate}/${toDate}/${statusValue}/${istatkal}`);
        return responseData;

    },
    async getNocRegDetails(nocdata:any){
        const { data: responseData } = await axiosInstance.post(`noc/getNocRegFeeDetails`,nocdata);
        return responseData;

    },
    async getNocByUserId(fromdate: any,todate: any,user_id: number,regType:any,istatkal:any){
        const { data: responseData } = await axiosInstance.get(`noc/getNocByUserId/${fromdate}/${todate}/${user_id}/${regType}/${istatkal}`);
        return responseData;
    },
        async  getNocById(nocPrimaryId: any){
            const { data: responseData } = await axiosInstance.get(`noc/getNocById/${nocPrimaryId}`);
            return responseData;
        },

        async updateNoc(nocPrimaryId: number, data: any) {
            const { data: responseData } = await axiosInstance.put(`noc/updatenoc/${nocPrimaryId}`, data);
            return responseData;
        },
};