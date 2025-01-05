import { ApiResponseType } from '../../types/api';
import { axiosInstance } from './index';

export const slotbookingService = {
    async getSlotsByDate(){ 
        const { data: responseData } = await axiosInstance.get(`slotbooking/getSlotsByDate`);
        return responseData as ApiResponseType;
    },

    async insertSlot(booking_date: any, slot_no:any, doctor_id:any,reg_type:any,serialno:any,tatkal:any){ 
        const { data: responseData } = await axiosInstance.post(`slotbooking/insertSlot?booking_date=${booking_date}&slot_no=${slot_no}&doctor_id=${doctor_id}&reg_type=${reg_type}&serialno=${serialno}&tatkal=${tatkal}`);
        return responseData as ApiResponseType;
    },
    async validateSlot(booking_date: any, slot_time:any){ 
        const { data: responseData } = await axiosInstance.post(`slotbooking/validateSlot?booking_date=${booking_date}&slot_time=${slot_time}`);
        return responseData as ApiResponseType;
    },
    async getTatkalCurrentStatus() {
        const { data: responseData } = await axiosInstance.get(`slotbooking/getTatkalCurrentCnt`);
        return responseData;
    },
}

export default slotbookingService;