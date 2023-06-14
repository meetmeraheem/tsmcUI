import { ApiResponseType } from "./api";

export type AddQualFormType = {
    country: number,
    state: number,
    university: string,
    college: string,
    qualification: string;
    exam_month: string;
    exam_year: string;
    duration: string,
    edu_cert1: string,
    edu_cert2: string,
    appliedFor: string,
    affidivit: string,
    testimonal1: string,
    testimonal2: string,
    reg_other_state: string,
    screen_test: string,
    intership_comp: string,
    mci_eligi: string,
    inter_verif_cert: string,
    mci_reg: string,
    imr_certificate: string,
    approval_status:string
  }
  export type AddQualDataFormType = {
    country: string,
    state: string,
    university: string,
    college: string,
    qualification: string;
    exam_month: string;
    exam_year: string;
    appliedFor: string,
    approval_status:string,
    extra_col3:string
  }
  export type AdminAddQualDataFormType = {
    country: string,
    state: string,
    university: string,
    college: string,
    qualification: string;
    exam_month: string;
    exam_year: string;
    appliedFor: string,
    approval_status:string,
    receipt_no:string,
    dd_amount:string
    reg_date:Date,
    edu_cert1:string,
    edu_cert2:string,
  }