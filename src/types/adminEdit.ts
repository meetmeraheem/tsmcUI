import { ApiResponseType } from "./api";

export type adminFinalType = {
    id: number,
    doctor_id: number,
    serialno: number,
    country: number,
    state: number,
    university: string,
    college: string,
    qualification: number,
    exam_month: string;
    exam_year: string;
    duration: string,
    reg_date:string,

  }

  export type AdminAdditionalFormType = {
    country: number,
    state: number,
    university: string,
    college: string,
    qualification: string;
    exam_month: string;
    exam_year: string;
    duration: string,
    appliedFor: string,
    reg_date:string
  }
  