import { ApiResponseType } from "./api";

export type socialSignInType = {
    Email: string;
    firstName: string;
    lastName: string;
};

export enum SocialEnum {
    microsoft,
    google,
    linkedIn,
    amazon,
}
export type SocialEnumKeyType = keyof typeof SocialEnum;

export type UserType = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
};


export type AuthResponseType = Omit<ApiResponseType, 'resultObject'> & {
    resultObject: {
        accessToken: string;
    };
};
