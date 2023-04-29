import { ApiResponseType } from "./api";

export type GetAdminResponseType = Omit<ApiResponseType, 'list'> & {
    list: AdminFormType[];
};

export type AdminFormType = {
    Id: number
    username: string
    password: string
    role_name: string
    main_perm: string
    sub_perm: string
    sub_sub_menu: string
    status: string
    user_type: string
}