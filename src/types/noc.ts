
export type nocUserFormType = {
   
    councilname: string,
    address1: string,
    address2: string,
    country: string,
    state: string,
    city: string,
    councilpincode: string,
    createdon: string,
    posttime: string,
    modifiedon: string,
    status: string,
    added_by: number,
    approval_status:string,
    extra_col3:string,
    edu_cert1:string,
    edu_cert2:string
    
  }

  export type nocEditFormType = {
   
    councilname: string,
    address1: string,
    address2: string,
    country: number,
    state: number,
    city: number,
    councilpincode: string,
    edu_cert1:string,
    edu_cert2:string
  }



  export type adminNocFormType = {
   
    councilname: string,
    address1: string,
    address2: string,
    country: string,
    state: string,
    city: string,
    reg_date:string
    councilpincode: string,
    approval_status:string,
    receipt_no:String,
    dd_amount:String,
    edu_cert1:string,
    edu_cert2:string,
    transanctionId:string
  }

