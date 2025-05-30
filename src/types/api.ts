export type ApiResponseType = {
    success: string;
    message: string;
    data: any;
};

export type ApiPostResponseType = {
    success: string;
    message: string;
    data: any;
};

export type ApiLoginResponseType = {
    success: string;
    message: string;
    code: number;
    data: any;
    token:string;
};

export type DispatchApiResponseType = {
    success: string;
    message: string;
    data: any;
    dispatchdata:any

};

// export type ApiResponseType = {
//     list: [];
//     PageInfo: {};
// };