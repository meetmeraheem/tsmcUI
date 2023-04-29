// eslint-disable-next-line no-useless-escape
export const emailRegexp = /^[a-zA-Z0-9\_*\-*\.*]+@[a-zA-Z0-9\-*]+\.*[A-Za-z\.*\-*]*\.[A-Za-z]+$/;

export const siteRegexp = /.+\..+/;

export const mobileMask = ['+', '9', '1', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

export const yearMask = [/[1-2]/, /\d/, /\d/, /\d/];

export const aadharMask = [
    'X',
    'X',
    'X',
    'X',
    ' ',
    'X',
    'X',
    'X',
    'X',
    ' ',
    'X',
    'X',
    'X',
    'X',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
];

export const numberRegexp = /[0-9]/;

export const spaceRegexp = /^[A-Z\d\s\(\-']{1,5}$/;

export const USERNAME_REGEX = /([a-zA-Z])+([ -~])*/;