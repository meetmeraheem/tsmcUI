import { ApiResponseType } from "./api";

export type ProvisionalFormType = {
    doctor_id: number;
    qualification: string;
    exam_month: string;
    exam_year: string;
    country: string;
    state: string;
    university: string;
    college: string;
    edu_cert1: string;
    edu_cert2: string;
    edu_cert3: string;
};

export type GetProvisionalResponse = Omit<ApiResponseType, 'data'> & {
    data: ProvisionalFormType[];
};

export type ProvisionalProfileType = {
    id: number,
    doctor_id: number;
    qualification: string;
    exam_month: string;
    exam_year: string;
    country: string;
    state: string;
    university: string;
    approval_status: string;
    college: string;
    edu_cert1: string;
    edu_cert2: string;
    edu_cert3: string;
};

export type ProvisionalEditFormType = {
    qualification: number;
    exam_month: string;
    exam_year: string;
    country: number,
    state: number,
    university: string;
    college: string;
    edu_cert1: string;
    edu_cert2: string;
    edu_cert3: string;
};

export type ProvisionalMyProfileType = {
    id: number,
    reg_date: Date,
    receipt_no: string,
    doctor_id: number;
    qualification: string;
    exam_month: string;
    exam_year: string;
    country: string;
    state: string;
    university: string;
    approval_status: string;
    college: string;
    edu_cert1: string;
    edu_cert2: string;
    edu_cert3: string;
};


export type Provisional_DoctorFormType = {
    fullname: number;
    mobileno: string;
    emailid: string;
    status: string;
    receipt_no:string
};

export type AdminProvisionalProfileType = {
    doctor_id: number;
    qualification: string;
    exam_month: string;
    exam_year: string;
    country: string;
    state: string;
    university: string;
    reg_date: Date,
    college: string;
    edu_cert1: string;
    edu_cert2: string;
    edu_cert3: string;
};