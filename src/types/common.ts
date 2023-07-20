import { ApiResponseType } from "./api";

export type Qualification = {
    id: number;
    name: string;
};

export type GetQualificationsResponseType = Omit<ApiResponseType, 'data'> & {
    data: Qualification[];
};

export type Country = {
    id: number;
    sortname: string;
    name: string;
    phonecode: string;
};

export type GetCountriesResponseType = Omit<ApiResponseType, 'list'> & {
    list: Country[];
};

export type State = {
    id: number;
    name: string;
    country_id: number;
};


export type GetStatesResponseType = Omit<ApiResponseType, 'data'> & {
    data: State[];
};

export type City = {
    id: number;
    name: string;
    state_id: number;
};


export type GetCitiesResponseType = Omit<ApiResponseType, 'data'> & {
    data: City[];
};

export type University = {
    id: number;
    university: string;
    state_id: number;
    country_id: number;
};


export type GetUniversitiesResponseType = Omit<ApiResponseType, 'data'> & {
    data: University[];
};

export type College = {
    id: number;
    college: string;
    university_id: number;
};


export type GetCollegesResponseType = Omit<ApiResponseType, 'list'> & {
    list: College[];
};

export type Serials = {
    id: number
    serialtype: string,
    serial_starts: number,
    created_date: string,
    modified_date: string,
    serial_prefix: string
  }

export type SerialResponseType = Omit<ApiResponseType, 'data'> & {
    data: Serials;
};

export type UserRole = {
    id: number;
    username:string
    role_name: string;
    user_type: string;
    status: string;
};

export type RegPayDetailsFormType = {
    registrationFee: number;
    penalityAmount:string
    totalAmount: string;
    extraCharges: string;
    fullName: string;
    dataOfbirth: string;
    phoneNo: string;
    address1: string;
    address2: string;
    examYear: string;
    examMonth: string;
    doctor_id: string;
};


export type goodStandingFormType = {
    createdon: string,
    posttime: string,
    modifiedon: string,
    status: string,
    added_by: number,
    approval_status:string
    doctor_id: string,
    doctorPrimaryId:string,
    extra_col3:string;
    

  }
  export type renewalsFormType = {
    oldRegDate: string,
    posttime: string,
    modifiedon: string,
    status: string,
    added_by: number,
    approval_status:string
    doctor_id: string,
    doctorPrimaryId:string,
    document10:string;

  }
  export type renewalsType = {
        status: string,
        reg_date: string,
        doctor_id: number,
        edu_cert1: string,
        edu_cert2: string,
        edu_cert3: string,
  };

  export type AdminrenewalsType = {
    status: string,
    reg_date: string,
    doctor_id: number,
    edu_cert1: string,
    edu_cert2: string,
    edu_cert3: string,
    dd_amount:string,
    receipt_no:string,
    transanctionId:string,
    

};

  export type changeOfNameType = {
   status: string,
   reg_date: string,
   doctor_id: number,
   edu_cert1: string,
   Gazette_No:string,
   extra_col3:string,
   newName:string,
};

export type AdminChangeOfNameType = {
    approval_status: string,
    gazzetNotificationDate: string,
    doctor_id: number,
    gazzetNotificationDocument: string,
    gazzetNotificationNo:string,
    extra_col1:string,
    currentName:string,
    newName:string,
    dd_amount:string,
    receipt_no:string
 };


export type provisional_Revalidation = {
    status: string,
    prov_reg_date: string,
    doctor_id: number,
    edu_cert1: string,
    edu_cert2: string,
    revalidationReason:string,
    extra_col3:string,
    
 };

 export type admin_provisional_Revalidation = {
    approval_status: string,
    prov_reg_date: string,
    doctor_id: number,
    edu_cert1: string,
    edu_cert2: string,
    revalidationReason:string,
    extra_col1:string,
    dd_amount:string,
    receipt_no:string
 };