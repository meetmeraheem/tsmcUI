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