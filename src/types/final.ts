import { ApiResponseType } from "./api";

export type FinalFormType = {
  country: string,
  state: string,
  university: string,
  college: string,
  qualification: string;
  exam_month: string;
  exam_year: string;
  duration: string,
  edu_cert1: string,
  edu_cert2: string,
  edu_cert3: string,
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
  telanganapmrNo:string,
  calc_date:string
}

export type FinalEditFormType = {
  country: number,
  state: number,
  university: string,
  college: string,
  qualification: number;
  exam_month: string;
  exam_year: string;
  duration: string,
  edu_cert1: string,
  edu_cert2: string,
  edu_cert3: string,
  affidivit: string,
  testimonal1: string,
  testimonal2: string,
  reg_other_state: string,
  screen_test: string,
  intership_comp: string,
  mci_eligi: string,
  inter_verif_cert: string,
  mci_reg: string,
  imr_certificate: string
}

export type FinalProfileType = {
  id: number,
  doctor_id: number,
  serialno: number,
  country: number,
  state: number,
  university: string,
  college: string,
  qualification: string,
  exam_month: string;
  exam_year: string;
  duration: string,
  edu_cert1: string,
  edu_cert2: string,
  edu_cert3: string,
  affidivit: string,
  testimonal1: string,
  testimonal2: string,
  reg_other_state: string,
  screen_test: string,
  intership_comp: string,
  mci_eligi: string,
  inter_verif_cert: string,
  mci_reg: string,
  imr_certificate: string
  createdon: string,
  posttime: string
}

export type GetFinalResponse = Omit<ApiResponseType, 'list'> & {
  list: FinalProfileType[];
};

export type FinalRegFormType = {
  serialno: number,
  country: string,
  state: string,
  university: string,
  college: string,
  qualification: string,
  exam_month: string;
  exam_year: string;
  approval_status: string;
  createdon: string,
  posttime: string
}

export type FinalMyProfileType = {
  id: number,
  serialno: number,
  reg_date: Date,
  country: string,
  state: string,
  university: string,
  college: string,
  qualification: string,
  exam_month: string;
  exam_year: string;
  approval_status: string;
  createdon: string,
  posttime: string,
  extra_col3:string,
  extra_col1:string,
  row_type:string
}

export type AdminFinalProfileType = {
  serialno: number,
  country: number,
  state: number,
  university: string,
  college: string,
  qualification: string,
  exam_month: string;
  exam_year: string;
  edu_cert1: string,
  edu_cert2: string,
  edu_cert3: string,
  affidivit: string,
  testimonal1: string,
  testimonal2: string,
  reg_other_state: string,
  screen_test: string,
  internship_comp: string,
  mci_eligi: string,
  inter_verif_cert: string,
  mci_reg: string,
  imr_certificate: string
  createdon: string,
  reg_date: Date,
  posttime: string,
  approval_status: string,
  receipt_no:String,
  dd_amount:String,
  transanctionId:string,
  calc_date:string,
  visitDate:string
}


export type FinalPaymentFormType = {
  country: string,
  state: string,
  university: string,
  college: string,
  qualification: string;
  exam_month: string;
  exam_year: string;
  duration: string,
  extra_col1: string;
  edu_cert1: string,
  edu_cert2: string,
  edu_cert3: string,
  affidivit: string,
  testimonal1: string,
  testimonal2: string,
  reg_other_state: string,
  screen_test: string,
  intership_comp: string,
  mci_eligi: string,
  inter_verif_cert: string,
  mci_reg: string,
  imr_certificate: string
}

export type FinalRegOLDFormType = {
  country: number,
  state: number,
  university: string,
  college: string,
  qualification: number;
  exam_month: string;
  exam_year: string;
  duration: string,
  edu_cert1: string,
  edu_cert2: string,
  edu_cert3: string,
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
  doctor_id:string,
  reg_date: Date|null,
  receipt_no:string,
  receipt_date:Date|null,
  dd_number:string,
  dd_date:Date|null,
  serialno: number,
  prefix:string,
  addedBy:number
}
